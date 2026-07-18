// ======================================
// Parkinson Spiral AI V4.0
// TensorFlow.js
// ======================================

async function analyzeWithGemini(canvas) {

    if (!aiModel) {
        return null;
    }

    try {

        const image = tf.tidy(() => {

            return tf.browser
                .fromPixels(canvas)
                .resizeBilinear([224, 224])
                .toFloat()
                .div(255.0)
                .expandDims();

        });

        const prediction = aiModel.predict(image);

        const value = (await prediction.data())[0];   // ความน่าจะเป็นดิบว่าเป็น Parkinson (0-1)

        tf.dispose(image);
        tf.dispose(prediction);

        return value;

    } catch (err) {

        console.error(err);
        return null;

    }

}