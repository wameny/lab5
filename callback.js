"use strict";

const array = [1, 2, 3];

// arrayEdited = array.map((x) => x * 2);
// console.log(arrayEdited);

const asyncMapCallback = (x, callback) => {
  setTimeout(() => {
    const result = x * 2;
    console.log(result);

    callback(null, result);
  }, 1000);
};

const asyncMap = (array, element, done) => {
  const results = [];
  let completed = 0;
  let isFinished = false;

  if (array.length === 0) return done(null, []);

  array.forEach((item, index) => {
    element(item, (err, result) => {
      if (isFinished) return;

      if (err) {
        isFinished = true;
        return done(err);
      }

      results[index] = result;
      completed++;

      if (completed === array.length) {
        isFinished = true;
        done(null, results);
      }
    });
  });
};

const errorFunc = (err, res) => {
  if (err) {
    console.log("Error:", err.message);
  } else {
    console.log("Succes:", res);
  }
};

asyncMap(array, asyncMapCallback, errorFunc);
