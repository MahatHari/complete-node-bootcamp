// module.exports
const Calculator = require("./test-modul1");

const calc1 = new Calculator();
console.log(calc1.add(2, 3));

// exports.name=()=>()
const { add, multiply, divide } = require("./test-module2");
console.log(multiply(3, 4));

// Caching, so the file is loaded and run once, and function are run with call
require("./test-module3")();
require("./test-module3")();
require("./test-module3")();
