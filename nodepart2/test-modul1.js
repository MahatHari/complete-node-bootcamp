/* class Calculator {
  add(a, b) {
    return a + b;
  }
  multipliy(a, b) {
    return a * b;
  }
  divide(a, b) {
    return a / b;
  }
}

module.exports = Calculator; */

// Above can be done like this also
module.exports = class {
  add(a, b) {
    return a + b;
  }
  multipliy(a, b) {
    return a * b;
  }
  divide(a, b) {
    return a / b;
  }
};
