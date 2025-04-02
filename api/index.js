const corsAnywhere = require("cors-anywhere");

const server = corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ["origin", "x-requested-with"],
  removeHeaders: ["cookie", "cookie2"],
});

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  server.emit("request", req, res);
};
