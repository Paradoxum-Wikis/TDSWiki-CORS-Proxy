// Update your cors-anywhere implementation
const corsAnywhere = require("cors-anywhere");

const server = corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: [], // Remove header requirements - this was likely causing issues
  removeHeaders: ["cookie", "cookie2"],
  redirectSameOrigin: true,
  httpProxyOptions: {
    followRedirects: true, // Ensure redirects are followed
    xfwd: true
  }
});

module.exports = (req, res) => {
  // Always set CORS headers for all responses including redirects
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  // Add debug headers to help diagnose issues
  req.corsAnywhereRequestState = {
    getProxyForUrl: () => true // Always proxy
  };
  
  server.emit("request", req, res);
};