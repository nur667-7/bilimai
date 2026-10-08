import { z } from 'zod';
import { BodyTooLarge, readBoundedJSON } from './bounded-json.ts';
import { ProviderError, quotaSQL } from './claude.ts';

const reply = (status: number, data: unknown) =>
  Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
  });

export async function pilotAPI<T>(
  request: Request,
  env: Cloudflare.Env,
  getUser: () => Promise<{ userId: string } | null>,
  schema: z.ZodType<T>,
  generate: (input: T, config: { key: string; model: string }) => Promise<object>,
  preview?: (input: T) => object
) {
  const reqOrigin = request.headers.get('origin');
  const selfOrigin = new URL(request.url).origin;
  const validOrigin =
    reqOrigin && (env.APP_ORIGIN ? reqOrigin === env.APP_ORIGIN : reqOrigin === selfOrigin);
  if (!validOrigin) return reply(403, { error: 'origin', reasonCode: 'origin_mismatch' });

  const allowed = (env.PILOT_ALLOWED_USER_IDS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const liveConfigured = Boolean(env.ANTHROPIC_API_KEY || env.ANTHROPIC_MODEL);

  let user: { userId: string } | null = null;
  if (allowed.length > 0 || !preview) {
    user = await getUser().catch(() => null);
    if (!user) return reply(401, { error: 'signin', reasonCode: 'unauthenticated' });
    if (!allowed.includes(user.userId)) return reply(403, { error: 'pilot', reasonCode: 'not_in_allowlist' });
  }

  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json')
    return reply(415, { error: 'content_type', reasonCode: 'invalid_content_type' });
  if (Number(request.headers.get('content-length')) > 4096)
    return reply(413, { error: 'too_large', reasonCode: 'content_length_exceeded' });

  let input: T;
  try {
    input = schema.parse(await readBoundedJSON(request.body, 4096));
  } catch (error) {
    return reply(error instanceof BodyTooLarge ? 413 : 400, {
      error: error instanceof BodyTooLarge ? 'too_large' : 'input',
      reasonCode: error instanceof BodyTooLarge ? 'body_too_large' : 'schema_validation_failed'
    });
  }

  // Intentional pre-grant demo mode when neither API key nor model is provisioned
  if (!liveConfigured) {
    if (preview) {
      try {
        return reply(200, { ...preview(input), source: 'preview', reasonCode: 'demo_preview_mode' });
      } catch {
        return reply(400, { error: 'input', reasonCode: 'context_mismatch' });
      }
    }
    return reply(503, { error: 'not_configured', reasonCode: 'api_key_not_configured' });
  }

  // Fail-closed in live mode: require API key, model, D1 database, and quota hash secret
  if (!env.ANTHROPIC_API_KEY || !env.ANTHROPIC_MODEL || !env.DB || !env.QUOTA_HASH_SECRET) {
    return reply(503, { error: 'not_configured', reasonCode: 'missing_live_safeguards' });
  }

  const subjectId = user?.userId ?? request.headers.get('cf-connecting-ip') ?? 'anonymous-client';

  try {
    const hash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(env.QUOTA_HASH_SECRET + ':' + subjectId)
    );
    const uid = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const now = new Date(),
      day = now.toISOString().slice(0, 10),
      minute = Math.floor(now.getTime() / 60000);
    const result = await env.DB.prepare(quotaSQL)
      .bind(crypto.randomUUID(), uid, day, minute, uid, day, uid, minute, day)
      .run();
    if (!result.meta.changes) return reply(429, { error: 'quota', reasonCode: 'rate_limit_exceeded' });
    return reply(200, {
      ...(await generate(input, { key: env.ANTHROPIC_API_KEY, model: env.ANTHROPIC_MODEL })),
      source: 'claude',
      reasonCode: 'live_claude_ok'
    });
  } catch (error) {
    const isTimeout = error instanceof ProviderError && error.code === 'timeout';
    return reply(isTimeout ? 504 : 502, {
      error: 'temporarily_unavailable',
      reasonCode: isTimeout ? 'provider_timeout' : 'provider_or_db_error'
    });
  }
}
