const EventEmitter = require('events');
const http = require('http');
const myEmitter = new EventEmitter();

// using class

myEmitter.on('newSale', () => console.log('There was new sale'));

myEmitter.on('newSale', () => console.log('There was another sale'));

myEmitter.on('newSale', (stock) => console.log('Ther are now ', stock));

myEmitter.emit('newSale', 9);

//
const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request Received');
  console.log(req.url);
  res.end('Request received');
});
server.on('request', (req, res) => {
  console.log('Another Request Received');
});
server.on('request', (req, res) => {
  console.log('Third Request Received');
});

server.on('close', () => {
  console.log('Server closed');
});

server.listen(8000, () => {
  console.log('waiting for request');
});
