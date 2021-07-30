const fs = require('fs');
setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('test-file.text', () => {
  console.log('I/O finished');
  console.log('----------------');

  setTimeout(() => console.log('Timer 2 Finished'), 0);
  setTimeout(() => console.log('Timer 3 Finished'), 3000);
  setImmediate(() => console.log('Immediate 2 Finished'), 0);
});

console.log('Hello from the top-level code');
