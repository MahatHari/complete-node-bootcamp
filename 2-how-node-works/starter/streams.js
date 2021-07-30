const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  //solution one => loading entire file to memory and send it ..
  /* fs.readFile('test-file.txt', (err, data) => {
    if (err) {
      console.log(err);
    }
    res.end(data);
  }); */
  // solution 2: streams Problem => readable stream is faster than response write over network, back pressure
  /* const readable = fs.createReadStream('tet-file.txt');
  readable.on('data', (chunk) => {
    res.write(chunk);
  });
  readable.on('end', () => {
    res.end();
  });
  readable.on('error', (err) => {
    console.log(err);
    res.statusCode = 500;
    res.end('File not found');
  }); */
  // Solution 3: using pipe operator, fix problem of back pressure
  const readable = fs.createReadStream('test-file.txt');
  readable.pipe(res);

  // readbaleSource.pipe(writeableDestination)
});

server.listen(8000, () => console.log('server started'));
