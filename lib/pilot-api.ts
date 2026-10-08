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
  if (!validOrigin) return reply(403, { error: 'origin' });

  const allowed = (env.PILOT_ALLOWED_USER_IDS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  let user: { userId: string } | null = null;
  if (allowed.length > 0 || !preview) {
    user = await getUser().catch(() => null);
    if (!user) return reply(401, { error: 'signin' });
    if (!allowed.includes(user.userId)) return reply(403, { error: 'pilot' });
  }

  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json')
    return reply(415, { error: 'content_type' });
  if (Number(request.headers.get('content-length')) > 4096) return reply(413, { error: 'too_large' });

  let input: T;
  try {
    input = schema.parse(await readBoundedJSON(request.body, 4096));
  } catch (error) {
    return reply(error instanceof BodyTooLarge ? 413 : 400, {
      error: error instanceof BodyTooLarge ? 'too_large' : 'input'
    });
  }

  if (!env.ANTHROPIC_API_KEY || !env.ANTHROPIC_MODEL) {
    if (preview) return reply(200, { ...preview(input), source: 'preview' });
    return reply(503, { error: 'not_configured' });
  }

  const subjectId = user?.userId ?? request.headers.get('cf-connecting-ip') ?? 'reviewer-pilot';
  const secret = env.QUOTA_HASH_SECRET || 'bilimai-pilot-quota-salt';

  try {
    if (env.DB) {
      const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret + ':' + subjectId));
      const uid = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      const now = new Date(),
        day = now.toISOString().slice(0, 10),
        minute = Math.floor(now.getTime() / 60000);
      const result = await env.DB.prepare(quotaSQL)
        .bind(crypto.randomUUID(), uid, day, minute, uid, day, uid, minute, day)
        .run();
      if (!result.meta.changes) return reply(429, { error: 'quota' });
    }
    return reply(200, {
      ...(await generate(input, { key: env.ANTHROPIC_API_KEY, model: env.ANTHROPIC_MODEL })),
      source: 'claude'
    });
  } catch (error) {
    if (preview) return reply(200, { ...preview(input), source: 'preview' });
    return reply(error instanceof ProviderError && error.code === 'timeout' ? 504 : 502, {
      error: 'temporarily_unavailable'
    });
  }
}
