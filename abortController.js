"use strict";

const array = [1, 2, 3];

const asyncMapPromise = (x) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x * 2);
    }, 2000);
  });
};

const asyncMap = (array, element, { signal } = {}) => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new Error("Aborted at start"));
    }

    const onAbort = () => {
      reject(new Error("Aborted"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });

    const results = [];
    let completed = 0;
    let isFinished = false;

    array.forEach((item, index) => {
      element(item)
        .then((result) => {
          if (signal?.aborted) return;

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
  const controller = new AbortController();

  setTimeout(() => controller.abort(), 1000);
  try {
    const result = await asyncMap(array, asyncMapPromise, {
      signal: controller.signal,
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

realization();
