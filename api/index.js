const corsAnywhere = require("cors-anywhere");

const server = corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: [],
  removeHeaders: ["cookie", "cookie2"],
});

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Handle query parameter approach
  if (req.query.url) {
    const targetUrl = req.query.url;
    
    // Ensure the URL is properly formatted
    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      req.url = '/' + targetUrl;
    } else {
      req.url = '/https://' + targetUrl;
    }
    
    console.log("Proxying to:", req.url);
  }
  
  server.emit("request", req, res);
};
