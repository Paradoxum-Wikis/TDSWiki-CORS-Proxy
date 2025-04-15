const corsAnywhere = require("cors-anywhere");

// Create server with modified settings
const server = corsAnywhere.createServer({
  originWhitelist: [],
  requireHeader: [],
  removeHeaders: ["cookie2"],  // Don't remove all cookies
  helpFile: null
});

// Allow both TDS Wiki and Roblox domains
const ALLOWED_DOMAINS = ["tds.fandom.com", "roblox.com", "roproxy.com"];

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // If accessing the root, show custom help page
  if (req.url === "/" || req.url === "") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>CORS Proxy for Roblox APIs</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="shortcut icon" href="https://www.roblox.com/favicon.ico">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3 { color: #2c3e50; }
            code {
              background: #f8f8f8;
              padding: 2px 5px;
              border-radius: 3px;
              font-size: 0.9em;
            }
            .lmao {
              background: #f5f7f9;
              padding: 15px;
              border-left: 4px solid #4b9ad8;
              margin: 20px 0;
            }
            .new-feature {
              background: #eaffea;
              border-left: 4px solid #4CAF50;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h1>Roblox CORS Proxy</h1>
          <p>This service enables cross-origin requests to Roblox APIs with authentication support.</p>
          
          <h2>General Proxy Usage</h2>
          <p>Use this proxy to fetch content from allowed domains by using a query parameter.</p>

          <p>To use the query, simply pass the target URL as a URL-encoded <code>url</code> query parameter:</p>
          <div class="lmao">
            <p><code>https://occulticnine.vercel.app/?url=https%3A%2F%2Fassetdelivery.roblox.com%2Fv1%2Fasset%2F...</code></p>
            <p><strong>Example Output:</strong> Returns the content from the requested Roblox API endpoint.</p>
          </div>
          <p><strong>Note:</strong> Use JavaScript's <code>encodeURIComponent()</code> to encode URLs properly.</p>

          <h2>Special Endpoints</h2>
          
          <h3>Badge Counter API</h3>
          <div class="lmao new-feature">
            <p>Use our dedicated badge API to fetch Roblox badge awarded counts.</p>
            
            <h4>Method 1: Direct Script Embedding</h4>
            <p><code>https://occulticnine.vercel.app/badges?id=2124475816</code></p>
            <p>Add this script tag to your HTML:</p>
            <pre><code>&lt;script src="https://occulticnine.vercel.app/badges?id=2124475816"&gt;&lt;/script&gt;</code></pre>
            <p>And implement this function to handle the counts:</p>
            <pre><code>window.__updateBadgeCount = function(id, count) {
  document.getElementById('badge-' + id).textContent = count.toLocaleString();
};</code></pre>
          
            <h4>Method 2: Class-based Integration</h4>
            <p>Add this code to your application to automatically load badge counts for elements with id classes:</p>
            <pre><code>window.__updateBadgeCount = function(id, count) {
  document.querySelectorAll('.id' + id).forEach(el => {
    el.textContent = count.toLocaleString();
  });
};

document.querySelectorAll('[class*="id"]').forEach(el => {
  const match = el.className.match(/id(\d{5,})/);
  if (!match) return;

  const badgeId = match[1];
  const script = document.createElement('script');
  script.src = 'https://occulticnine.vercel.app/badges?id=' + badgeId;
  document.head.appendChild(script);
});</code></pre>
            
            <p>Then simply add the badge ID as a class to any HTML element:</p>
            <pre><code>&lt;span class="id2124475816"&gt;Loading...&lt;/span&gt;</code></pre>
            <p>You can use multiple badge counters on the same page:</p>
            <pre><code>&lt;div&gt;Event Badge: &lt;span class="id2124475816"&gt;Loading...&lt;/span&gt; awarded&lt;/div&gt;
&lt;div&gt;Golden Badge: &lt;span class="id12345678"&gt;Loading...&lt;/span&gt; awarded&lt;/div&gt;</code></pre>
          </div>

          <h2>Code Examples</h2>
          
          <h3>Fetching Roblox Assets</h3>
          <div class="lmao new-feature">
            <pre><code>// Fetching a Roblox asset with authentication
fetch('https://occulticnine.vercel.app/https://assetdelivery.roproxy.com/v2/assetId/123456789')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));</code></pre>
          </div>

          <div class="lmao new-feature">
            <pre><code>// Using query parameter format
fetch('https://occulticnine.vercel.app/?url=' + encodeURIComponent('https://assetdelivery.roproxy.com/v2/assetId/123456789'))
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));</code></pre>
          </div>

          <h2>Supported Domains</h2>
          <table>
            <tr>
              <th>Domain</th>
              <th>Features</th>
              <th>Cache Duration</th>
            </tr>
            <tr>
              <td>roblox.com</td>
              <td>Authenticated API access</td>
              <td>24 hours</td>
            </tr>
            <tr>
              <td>roproxy.com</td>
              <td>Authenticated API access</td>
              <td>24 hours</td>
            </tr>
          </table>
          <p><strong>Note:</strong> Badges are cached for a week.</p>

          <h2>Restrictions</h2>
          <ul>
            <li>Only requests to <code>roblox.com, roproxy.com</code> are allowed</li>
            <li>Redirects are automatically followed (up to 5 redirects)</li>
          </ul>
          
          <p><small>Powered by <a href="https://github.com/Rob--W/cors-anywhere/">CORS Anywhere</a>, named after <a href="https://wikipedia.org/wiki/Occultic;Nine">Occultic;Nine</a>.</small></p>
        </body>
      </html>
    `);
    return;
  }

  // Extract target URL (either from query param or path)
  let targetUrl = "";
  
  if (req.query.url) {
    targetUrl = req.query.url;
  } else {
    // Extract from path if using the /https://example.com format
    const match = req.url.match(/^\/(https?):\/\/(.*)/);
    if (match) {
      targetUrl = `${match[1]}://${match[2]}`;
    }
  }

  // Check if URL is from allowed domains
  try {
    const urlObj = new URL(targetUrl);
    if (!ALLOWED_DOMAINS.some(domain => urlObj.hostname.includes(domain))) {
      res.statusCode = 403;
      res.end(`Poyaya!? Sorry, only these domains are allowed: ${ALLOWED_DOMAINS.join(', ')}`);
      return;
    }

    // Add ROBLOSECURITY cookie for Roblox domains
    if (urlObj.hostname.includes('roblox.com') || urlObj.hostname.includes('roproxy.com')) {
      req.headers['cookie'] = `.ROBLOSECURITY=${process.env.ROBLOSECURITY}`;
    }

    // Add inside the request handler before calling server.emit
    if (urlObj.hostname.includes('tds.fandom.com')) {
      // Cache wiki content for 1 hour
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    } else if (urlObj.hostname.includes('roblox.com') || urlObj.hostname.includes('roproxy.com')) {
      // Cache Roblox assets for 24 hours
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    }
  } catch (err) {
    res.statusCode = 400;
    res.end('Poyaya!? You need to provide a valid URL!');
    return;
  }
  
  // Format URL for cors-anywhere
  if (req.query.url) {
    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      req.url = '/' + targetUrl;
    } else {
      req.url = '/https://' + targetUrl;
    }
    console.log("Ishishu! Proxying to:", req.url);
  }
  
  server.emit("request", req, res);
};