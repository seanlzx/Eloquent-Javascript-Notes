let squareWorker = new Worker("code/squareworker.js");
squareWorker.addEventListener("message", event => {
    console.log("Worker responds: ", event.data);
});
squareWorker.postMessage(5);