const corsAnywhere = require("cors-anywhere");

const server = corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: [], // Remove header requirements
  removeHeaders: ["cookie", "cookie2"],
  redirectSameOrigin: true,
  httpProxyOptions: {
    xfwd: true // Forward client IP
  }
});

module.exports = (req, res) => {
  // Set CORS headers directly
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Process the request
  server.emit("request", req, res);
};