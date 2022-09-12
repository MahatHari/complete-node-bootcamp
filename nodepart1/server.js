const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");

// Create  SERVER

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productData = JSON.parse(data);

const overview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const products = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = productData
      .map((product) => {
        return replaceTemplate(tempCard, product);
      })
      .join("");

    const output = overview.replace(/{%PRODUCTS_CARDS%}/g, cardsHtml);
    res.end(output);

    // Product Page
  } else if (pathname === "/product") {
    const product = productData[query.id];
    const output = replaceTemplate(products, product);
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(output);
  }
  // API
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h1>Page not Found</h1>");
  }
});

// Listen to incoming calls on port 3000 of server
server.listen(3000, "127.0.0.1", () => {
  console.log("Listening to request on port 3000");
});
