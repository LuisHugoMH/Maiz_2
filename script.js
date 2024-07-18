async function loadModel() {
    try {
        const model = await tf.loadLayersModel('https://<tu-usuario>.github.io/<tu-repo>/model/model.json');
        return model;
    } catch (error) {
        console.error('Error al cargar el modelo:', error);
    }
}

async function setupCamera() {
    const video = document.getElementById('videoElement');
    const constraints = {
        video: {
            width: { ideal: 256 },
            height: { ideal: 256 },
            facingMode: { exact: 'environment' }
        }
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                resolve(video);
            };
        });
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
    }
}

async function predictFrame(model, video) {
    const tensor = tf.browser.fromPixels(video)
        .resizeNearestNeighbor([256, 256])
        .toFloat()
        .expandDims();
    const predictions = model.predict(tensor).dataSync();
    const predictedClass = tf.argMax(predictions).dataSync()[0];
    const classes = ['Enfermo', 'Sano']; // Ajusta esto según tus clases
    document.getElementById('prediction').innerText = `Maíz ${classes[predictedClass]}`;
}

async function main() {
    const video = await setupCamera();
    const model = await loadModel();
    if (model) {
        video.play();
        setInterval(() => {
            predictFrame(model, video);
        }, 1000); // Realiza una predicción cada segundo
    } else {
        document.getElementById('prediction').innerText = 'Error al cargar el modelo';
    }
}

main();
