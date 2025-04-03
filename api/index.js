const corsAnywhere = require("cors-anywhere");

const server = corsAnywhere.createServer({
  originWhitelist: [], // We'll handle domain restriction manually
  requireHeader: [],
  removeHeaders: ["cookie", "cookie2"],
  helpFile: null, // Disable default help file
});

// Allowed domain
const ALLOWED_DOMAIN = "tds.fandom.com";

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
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
          <title>CORS Proxy for TDS Wiki</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="shortcut icon" href="https://static.wikia.nocookie.net/tower-defense-sim/images/4/4a/Site-favicon.ico">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 { color: #2c3e50; }
            code {
              background: #f8f8f8;
              padding: 2px 5px;
              border-radius: 3px;
            }
            .lmao {
              background: #f5f7f9;
              padding: 15px;
              border-left: 4px solid #4b9ad8;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <h1>TDS Wiki CORS Proxy</h1>
          <p>This service enables cross-origin requests to the <a href="https://tds.fandom.com">TDS Wiki</a> only.</p>
          
          <h2>Usage</h2>
          <p>Use this proxy to fetch TDS Wiki pages by prepending the proxy URL to your target wiki URL or by passing the target URL as a query parameter. The two methods are, of course, supported for flexibility.</p>

          <h3>Method 1: Query Parameter (Recommended)</h3>
          <p>Pass the TDS Wiki URL as a URL-encoded <code>url</code> query parameter after the proxy base URL:</p>
          <div class="lmao">
            <p><code>https://occulticnine.vercel.app/?url=https%3A%2F%2Ftds.fandom.com%2Fwiki</code></p>
            <p><strong>Example Output:</strong> Returns the HTML content of the <code>/wiki</code> page.</p>
          </div>
          <p><strong>Note:</strong> Use a tool like JavaScript’s <code>encodeURIComponent("https://tds.fandom.com/wiki/")</code> to encode the URL properly.</p>

          <h3>Method 2: Path-Based Proxy</h3>
          <p>Simply just append the full TDS Wiki URL (including <code>https://</code>) directly after the proxy base URL:</p>
          <div class="lmao">
            <p><code>https://occulticnine.vercel.app/https://tds.fandom.com/wiki/</code></p>
            <p><strong>Example Output:</strong> Returns the HTML content of the <code>/wiki/</code> page.</p>
          </div>
          <p><strong>Note:</strong> Make sure that the target URL is fully qualified (starts with <code>https://</code>) and belongs to <code>tds.fandom.com</code>.</p>

          <h3>Example in JavaScript</h3>
          <div class="lmao">
            <pre><code>fetch('https://occulticnine.vercel.app/?url=' + encodeURIComponent('https://tds.fandom.com/wiki'))
            .then(response => response.text())
            .then(html => console.log(html))
            .catch(error => console.error('Error:', error));</code></pre>
          </div>

          <h2>Restrictions:</h2>
          <ul>
            <li>Only requests to <code>tds.fandom.com</code> are allowed</li>
            <li>Cookies are disabled and stripped from requests</li>
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

  // Check if URL is from allowed domain
  try {
    const urlObj = new URL(targetUrl);
    if (!urlObj.hostname.endsWith(ALLOWED_DOMAIN)) {
      res.statusCode = 403;
      res.end(`Poyaya!? Only ${ALLOWED_DOMAIN} are allowed, sorry!`);
      return;
    }
  } catch (err) {
    res.statusCode = 400;
    res.end('Poyaya!? The URL provided is an invalid one!');
    return;
  }
  
  // Ensure the URL is properly formatted for cors-anywhere
  if (req.query.url) {
    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      req.url = '/' + targetUrl;
    } else {
      req.url = '/https://' + targetUrl;
    }
    console.log("Proxying to:", req.url);
  }
  
  server.emit("request", req, res);
};