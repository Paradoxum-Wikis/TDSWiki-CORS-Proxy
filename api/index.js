const { createServer } = require("http");
const { URL } = require("url");
const corsAnywhere = require("cors-anywhere");

const proxy = corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ["origin", "x-requested-with"],
  removeHeaders: ["cookie", "cookie2"],
});

module.exports = (req, res) => {
  const server = createServer((req, res) => {
    proxy.emit("request", req, res);
  });

  server.emit("request", req, res);
};
