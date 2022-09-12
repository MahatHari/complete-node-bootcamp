const fs = require("fs");

// Blocking synchronous way
/* const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);
let date = new Date();
const textOut = ` This is what we know about the avocado ${textIn}. \n Created on ${new Date().toLocaleDateString()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written"); */

// Non Blocking Asynchronous way

fs.readFile("./txt/output.txt", "utf-8", (err, data) => {
  console.log(data);
});
console.log("Will read File!");

// Call back hell
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile("./txt/output.txt", "utf-8", (err, data3) => {
      console.log(data3);

      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log("your file has been written");
      });
    });
  });
});
console.log("Will Read File");
