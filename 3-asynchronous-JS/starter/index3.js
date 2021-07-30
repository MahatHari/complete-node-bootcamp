const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('file not found');
      resolve(data);
    });
  });
};
const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('could not write file');
      resolve('success');
    });
  });
};

/*  Async Await method */
const getDocPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);
    await writeFilePromise('dog-img.txt', res.body.message);
    console.log('Random dog image link saved');
  } catch (err) {
    console.log(err.message);
    throw err;
  }
  return '2: Dog pic Returned';
};
//getDocPic();

//IIFE function, Immediately Invoked Function Expression
(async () => {
  try {
    console.log('1: Will get dog pics');
    const x = await getDocPic();
    console.log(x);
    console.log('3: Done getting dog pics');
  } catch (err) {
    console.log('ERROR');
  }
})();

/* getDocPic()
  .then((x) => console.log(x))
  .catch((err) => console.log(err)); */

/* readFilePromise(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePromise('dog-img.txt', res.body.message);
  })
  .then(() => console.log('Rdandom dog image saved'))

  .catch((err) => console.log(err.message)); */
