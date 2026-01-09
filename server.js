const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const { getAggregatedData } = require("./api/data");
const { getOrdersPerCall } = require("./api/orders-per-call");
const { getSessionsOrdersConversion } = require("./api/sessions-orders-conversion");

http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === "/api/data") {
    const { view, granularity } = parsedUrl.query;
    const data = getAggregatedData(view, granularity);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(data));
  }

  if (parsedUrl.pathname === "/api/orders-per-call") {
    const { granularity } = parsedUrl.query;
    const data = getOrdersPerCall(granularity);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(data));
  }

  if (parsedUrl.pathname === "/api/sessions-orders-conversion") {
    const { granularity } = parsedUrl.query;
    const data = getSessionsOrdersConversion(granularity);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(data));
  }

  if (parsedUrl.pathname === "/" || parsedUrl.pathname === "/index.html") {
    const html = fs.readFileSync(path.join(__dirname, "public", "index.html"));
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(html);
  }

  res.writeHead(404);
  res.end("Not Found");
}).listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
