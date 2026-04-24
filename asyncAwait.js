"use strict";

const array = [1, 2, 3];

const asyncMapPromise = (x) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(x * 2), 1000);
  });
};

const asyncMap = (array, element) => {
  return new Promise((resolve, reject) => {
    if (array.length === 0) return resolve([]);

    const results = [];
    let completed = 0;
    let isFinished = false;

    array.forEach((item, index) => {
      element(item)
        .then((result) => {
          if (isFinished) return;

          results[index] = result;
          completed++;

          if (completed === array.length) {
            isFinished = true;
            resolve(results);
          }
        })
        .catch((error) => {
          if (!isFinished) {
            isFinished = true;
            reject(error);
          }
        });
    });
  });
};

async function realization() {
  try {
    const result = await asyncMap(array, asyncMapPromise);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

realization();
