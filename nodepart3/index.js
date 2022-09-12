const fs = require('fs');
const superagent = require('superagent');

// Promise function

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        reject('Could not find file');
      }
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Could not write file', err);
      resolve('success');
    });
  });
};

/* //Cosuming readFilePromise with .then
readFilePromise(`${__dirname}/dog.txt`).then((data) => {
  console.log(data);
});
 */
/* fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`Breed ${data}`); */

//  readFilePromise(`${__dirname}/dog.txt`).then((data) => {
//   console.log(data);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.log(err.message);
//       console.log(res.body.message);
//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         console.log('Random image ');
//       });
//     });
// });

// Re writing above read write with promises TODO:
/* readFilePromise(`${__dirname}/dogg.txt`)
  .then((data) => {
    console.log(`Breed ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(`Message, ${res.body.message}`);
    return writeFilePromise('dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('Random dog image saved to File');
  })
  .catch((err) => {
    console.log('Error thrown', err.message);
  }); */

// Re writing using async await
const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePromise('dog-img.txt', res.body.message);
    console.log('Random dog image saved to file');
  } catch (e) {
    if (e.message) {
      console.log(e.message);
    } else {
      console.log(e);
    }
  }
};

getDogPic();
