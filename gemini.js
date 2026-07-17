// ======================================
// Parkinson Spiral AI V4.0
// TensorFlow.js
// ======================================


// วิเคราะห์ภาพจาก Canvas
async function analyzeWithGemini(canvas, analysisResult) {

    if (!aiModel) {

        document.getElementById("aiResult").innerHTML =
            "AI Model ยังโหลดไม่เสร็จ";

        return;

    }

    try {

        // เตรียมรูปให้ตรงกับโมเดล
        const image = tf.tidy(() => {

            return tf.browser
                .fromPixels(canvas)
                .resizeBilinear([224, 224])
                .toFloat()
                .div(255.0)
                .expandDims();

        });

        // Predict
        const prediction = aiModel.predict(image);

        const value = (await prediction.data())[0];

        tf.dispose(image);
        tf.dispose(prediction);

        let label = "";
        let confidence = 0;

        if (value >= 0.5) {

            label = "Parkinson";
            confidence = value * 100;

        } else {

            label = "Healthy";
            confidence = (1 - value) * 100;

        }

        document.getElementById("aiResult").innerHTML = `
            <h3>${label}</h3>
            <p>Confidence : ${confidence.toFixed(2)}%</p>
        `;

    }

    catch (err) {

        console.error(err);

        document.getElementById("aiResult").innerHTML =
            "AI วิเคราะห์ไม่สำเร็จ";

    }

}