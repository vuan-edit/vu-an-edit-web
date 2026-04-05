// =============================================
// Cloudflare Worker: blog-proxy
// Route: vuanedit.online/blog/*
// Purpose: Proxy /blog/* requests to WordPress on Hostinger
// =============================================

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Only handle /blog paths
    if (!url.pathname.startsWith('/blog')) {
      return fetch(request);
    }

    // Hostinger WordPress origin
    const WP_ORIGIN = 'https://darksalmon-fox-423208.hostingersite.com';

    // Map /blog/xyz → WordPress /xyz
    // WordPress is installed at root on Hostinger, but served as /blog/ on vuanedit.online
    const wpPath = url.pathname.replace(/^\/blog\/?/, '/') || '/';
    const wpUrl = new URL(wpPath + url.search, WP_ORIGIN);

    // Forward request with proper headers
    const headers = new Headers(request.headers);
    headers.set('Host', 'darksalmon-fox-423208.hostingersite.com');
    headers.set('X-Forwarded-Host', 'vuanedit.online');
    headers.set('X-Forwarded-Proto', 'https');
    headers.set('X-Real-IP', request.headers.get('CF-Connecting-IP') || '');
    headers.set('X-Original-URL', url.pathname);

    const wpRequest = new Request(wpUrl.toString(), {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'manual',
    });

    let response;
    try {
      response = await fetch(wpRequest);
    } catch (err) {
      return new Response(
        '<html><body style="background:#000;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0"><div style="text-align:center"><h1>Blog tạm thời không khả dụng</h1><p>Vui lòng thử lại sau.</p><a href="/" style="color:#b4fd00">← Về trang chủ</a></div></body></html>',
        {
          status: 502,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }
      );
    }

    // Fix redirects — rewrite Hostinger URL back to vuanedit.online/blog
    if ([301, 302, 307, 308].includes(response.status)) {
      const location = response.headers.get('Location');
      if (location) {
        let fixedLocation = location;
        
        // Rewrite hostinger origin to vuanedit.online/blog
        fixedLocation = fixedLocation.replace(
          WP_ORIGIN,
          'https://vuanedit.online/blog'
        );
        // Fix double /blog/blog if WordPress already includes /blog
        fixedLocation = fixedLocation.replace('/blog/blog/', '/blog/');
        // Ensure HTTPS
        fixedLocation = fixedLocation.replace(
          /http:\/\/vuanedit\.online/g,
          'https://vuanedit.online'
        );

        return new Response(null, {
          status: response.status,
          headers: {
            Location: fixedLocation,
            'Cache-Control': 'no-cache',
          },
        });
      }
    }

    // Process response
    const contentType = response.headers.get('Content-Type') || '';
    const newHeaders = new Headers(response.headers);
    newHeaders.delete('x-frame-options');
    newHeaders.set('X-Robots-Tag', 'index, follow');

    // For HTML responses, rewrite URLs in the body
    if (contentType.includes('text/html')) {
      let body = await response.text();

      // Rewrite all Hostinger URLs → vuanedit.online/blog
      body = body.replaceAll(WP_ORIGIN + '/', 'https://vuanedit.online/blog/');
      body = body.replaceAll(WP_ORIGIN, 'https://vuanedit.online/blog');
      
      // Fix wp-content/wp-includes paths to point back to Hostinger
      // These are static assets that should load from Hostinger directly
      body = body.replaceAll(
        'https://vuanedit.online/blog/wp-content/',
        WP_ORIGIN + '/wp-content/'
      );
      body = body.replaceAll(
        'https://vuanedit.online/blog/wp-includes/',
        WP_ORIGIN + '/wp-includes/'
      );

      return new Response(body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    // For CSS responses, also rewrite URLs
    if (contentType.includes('text/css')) {
      let body = await response.text();
      body = body.replaceAll(WP_ORIGIN, 'https://vuanedit.online/blog');

      return new Response(body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    // All other assets (images, JS, etc.) — pass through
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
