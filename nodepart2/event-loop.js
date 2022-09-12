const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 1;
setTimeout(() => {
  console.log("Timer 1 Finished");
}, 0);

setImmediate(() => console.log("Immediate 1 Finished"));

fs.readFile("./test.txt", "utf-8", (err, data) => {
  console.log(data);
  console.log("_______________________________");
  setTimeout(() => {
    console.log("Timer 2 Finished");
  }, 0);
  setTimeout(() => {
    console.log("Timer 3 Finished");
  }, 3000);

  setImmediate(() => console.log("Immediate 2 Finished"));

  process.nextTick(() => console.log("Process.nextTick"));

  crypto.pbkdf2("password", "salt", 1000000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password Encrypted");
  });
  crypto.pbkdf2("password", "salt", 1000000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password Encrypted");
  });
  crypto.pbkdf2("password", "salt", 1000000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password Encrypted");
  });
});

console.log("Hello from top level code");
