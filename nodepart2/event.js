const EventEmmiter = require("events");
const http = require("http");

class Sales extends EventEmmiter {
  constructor() {
    super();
  }
}
const myEmmiter = new Sales();

myEmmiter.on("newSale", () => {
  console.log("There was a new sale!");
});

myEmmiter.on("newSale", () => {
  console.log("Customer name: Jonas");
});

myEmmiter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items`);
});

myEmmiter.emit("newSale", 9);

///////////////////////////

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request received");
  res.end("Request Received");
});

server.on("request", (req, res) => {
  console.log("Antoer Request received");
});

server.on("close", () => {
  console.log("Server Closed");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on port 8000");
});
