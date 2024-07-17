async function loadModel() {
    try {
        const model = await tf.loadLayersModel('model/model.json');
        return model;
    } catch (error) {
        console.error('Error al cargar el modelo:', error);
    }
}

async function setupCamera() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
    });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function predictVideo(model) {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const classes = ['Enfermo', 'Sano']; // Ajusta esto según tus clases

    async function framePrediction() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img = tf.browser.fromPixels(canvas).resizeNearestNeighbor([256, 256]).toFloat().expandDims();
        const predictions = model.predict(img).dataSync();
        const predictedClass = tf.argMax(predictions).dataSync()[0];
        document.getElementById('prediction').innerText = `Maíz ${classes[predictedClass]}`;
        requestAnimationFrame(framePrediction);
    }

    framePrediction();
}

async function main() {
    const model = await loadModel();
    await setupCamera();
    predictVideo(model);
}

main();
window.addEventListener('load', loadModel);
