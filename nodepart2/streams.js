const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // Solution 1
  /* fs.readFile("./test-file.txt", (err, data) => {
    if (err) console.log(err);
    res.end(data);
  }); */

  // Solution 2, Streaming data chunk by chunk
  /* const readble = fs.createReadStream("./test-file.txt");
  readble.on("data", (chunk) => {
    res.write(chunk);
  });
  // On Finish,  end response
  readble.on("end", () => {
    res.end();
  });
  readble.on("error", (err) => {
    console.log(error);
    res.statusCode(500);
    res.end("File Not Found");
  }); */

  // Solution 3, Using pipe Operator on Readable stream,
  const readble = fs.createReadStream("./test-file.txt");
  // readableSource .pipe (writeableDest)
  readble.pipe(res);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to port 8000....");
});
