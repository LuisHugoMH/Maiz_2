// script.js
let model;

async function loadModel() {
    try {
        // Actualiza esta URL con la ruta correcta de tu repositorio de GitHub Pages
        model = await tf.loadLayersModel('https://<tu-usuario>.github.io/<tu-repo>/model/model.json');
        console.log('Modelo cargado correctamente');
    } catch (error) {
        console.error('Error al cargar el modelo:', error);
    }
}

async function predictImage(image) {
    const img = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([256, 256])
        .toFloat()
        .expandDims(0);

    const prediction = await model.predict(img).data();
    return prediction;
}

document.getElementById('imageInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const imageElement = document.getElementById('selectedImage');
    const reader = new FileReader();

    reader.onload = async function(e) {
        imageElement.src = e.target.result;
        imageElement.onload = async function() {
            const prediction = await predictImage(imageElement);
            document.getElementById('prediction').innerText = `Predicción: ${prediction}`;
        }
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});

window.addEventListener('load', loadModel);