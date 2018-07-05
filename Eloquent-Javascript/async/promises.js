class Timeout extends Error { };

const timeout = (ms) => new Promise((_, reject) => {
  setTimeout(() => reject(new Timeout("Timed out")), ms);
});

const reattempt = (request, ms = 250, n = 1, max = 3) => {
  return new Promise((resolve, reject) => {
    let done = false;
    const requests = [request(), timeout(max*ms)];
    for (let i = n; i <= max; ++i) {
      requests.push(
        timeout(i*ms)
          .catch(err => {
            if (!done)
              return request();
          })
      );
    }
    Promise
      .race(requests)
      .then(result => {
        done = true;
        resolve(result); 
      })
      .catch(reject);
  });
};

const getNumber = () => new Promise((resolve) => {
  setTimeout(() => resolve(10), 1000);
});

reattempt(getNumber, ms = 250).then(console.log);
