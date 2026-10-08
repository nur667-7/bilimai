import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";

const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
};

export default {
  async fetch(
    request: Request,
    env: Cloudflare.Env,
    ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>
  ) {
    const url = new URL(request.url);
    const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";

    if (!isLocal && proto === "http") {
      return Response.redirect(`https://${url.host}${url.pathname}${url.search}`, 308);
    }

    if (url.pathname === "/robots.txt") {
      return new Response(
        `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://bilimai.dpdns.org/sitemap.xml\n`,
        {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
            ...SECURITY_HEADERS
          }
        }
      );
    }

    if (url.pathname === "/sitemap.xml") {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://bilimai.dpdns.org/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://bilimai.dpdns.org/lab</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://bilimai.dpdns.org/about</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://bilimai.dpdns.org/privacy</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
</urlset>`;
      return new Response(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
          ...SECURITY_HEADERS
        }
      });
    }

    let binding = ctx.props?.CONNECTORS;
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return {
              status: "request_context_expired",
              message: "This request has expired. Please try again."
            };
          }
          return preview.invoke(connectorId, actionName, args);
        }
      };
    }

    const response = await runWithConnectorBinding(binding, () =>
      handler.fetch(request, env, ctx)
    );
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      if (!headers.has(key)) headers.set(key, value);
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
