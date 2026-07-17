// =====================================
// Parkinson Spiral Analysis V4.0
// =====================================

function analyzeSpiral(points) {

    if (!points || points.length < 20) {
        return null;
    }

    // Tremor
    let tremorValues = [];

    for (let i = 2; i < points.length; i++) {

        const dx1 = points[i - 1].x - points[i - 2].x;
        const dy1 = points[i - 1].y - points[i - 2].y;

        const dx2 = points[i].x - points[i - 1].x;
        const dy2 = points[i].y - points[i - 1].y;

        const change = Math.sqrt(
            Math.pow(dx2 - dx1, 2) +
            Math.pow(dy2 - dy1, 2)
        );

        tremorValues.push(change);
    }

    const tremorStd = standardDeviation(tremorValues);

    const tremorScore = clamp(
        Math.round(normalize(tremorStd, 20)),
        0,
        40
    );

    // Speed
    let speedValues = [];

    for (let i = 1; i < points.length; i++) {

        const d = distance(points[i], points[i - 1]);
        const dt = (points[i].time - points[i - 1].time) / 1000;

        if (dt > 0) {
            speedValues.push(d / dt);
        }
    }

    const speedStd = standardDeviation(speedValues);

    const speedScore = clamp(
        Math.round(normalize(speedStd, 250)),
        0,
        30
    );

    // Deviation
    const smoothness = average(tremorValues);

    const deviationScore = clamp(
        Math.round(normalize(smoothness, 12)),
        0,
        30
    );

    // Risk
    let risk = tremorScore + speedScore + deviationScore;

    risk = clamp(risk, 0, 100);

    let level = "";
    const currentLang = localStorage.getItem("psa_lang") || "th";

    if (risk <= 30) {

        level = currentLang === "en" ? "Low Risk" : "ความเสี่ยงต่ำ";

    } else if (risk <= 60) {

        level = currentLang === "en" ? "Moderate Risk" : "ความเสี่ยงปานกลาง";

    } else {

        level = currentLang === "en" ? "High Risk" : "ความเสี่ยงสูง";

    }

    return {
        risk,
        tremorScore,
        speedScore,
        deviationScore,
        level
    };
}