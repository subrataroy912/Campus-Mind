/**
 * Cloudflare Worker Edge Reverse Proxy for CampusMind
 *
 * Proxies API traffic (/v1/*, /oauth2/*, /login/*) to the Spring Boot backend
 * running on Render, Railway, or VPS.
 *
 * Benefits:
 * - Zero CORS issues (Frontend and Backend share the exact same Cloudflare origin)
 * - Transparent cookie, authorization, and CSRF token propagation
 * - Edge TLS termination and DDoS mitigation
 */

const DEFAULT_BACKEND_URL = "https://m198-backend.onrender.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const backendOrigin = (env?.BACKEND_API_URL || DEFAULT_BACKEND_URL).replace(/\/+$/, "");

    // Construct target URL with backend host and exact path/query
    const targetUrl = new URL(url.pathname + url.search, backendOrigin);

    // Forward original request headers
    const headers = new Headers(request.headers);
    headers.set("X-Forwarded-Host", url.host);
    headers.set("X-Forwarded-Proto", url.protocol.replace(":", ""));
    headers.set("Host", targetUrl.host);

    const isGetOrHead = ["GET", "HEAD"].includes(request.method);

    const proxyRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers,
      body: isGetOrHead ? undefined : request.body,
      redirect: "manual",
    });

    try {
      const response = await fetch(proxyRequest);

      const responseHeaders = new Headers(response.headers);
      responseHeaders.set("Access-Control-Allow-Origin", url.origin);
      responseHeaders.set("Access-Control-Allow-Credentials", "true");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: "Backend Service Unavailable",
          message: err.message || "Failed to reach backend",
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};
