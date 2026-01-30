// test-worker.ts
console.log('Worker file loaded!');

self.onmessage = () => {
  console.log('Worker received message!');
  self.postMessage({ test: 'it works' });
};
