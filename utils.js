// ===============================
// Utility Functions
// Parkinson Spiral Analysis
// ===============================

// คำนวณระยะห่างระหว่าง 2 จุด
function distance(p1, p2) {
    return Math.sqrt(
        Math.pow(p2.x - p1.x, 2) +
        Math.pow(p2.y - p1.y, 2)
    );
}

// คำนวณมุมระหว่าง 2 จุด
function angle(p1, p2) {
    return Math.atan2(
        p2.y - p1.y,
        p2.x - p1.x
    );
}

// ค่าเฉลี่ยของข้อมูล
function average(arr) {

    if (arr.length === 0) return 0;

    return arr.reduce((a, b) => a + b, 0) / arr.length;

}

// ส่วนเบี่ยงเบนมาตรฐาน
function standardDeviation(arr) {

    if (arr.length === 0) return 0;

    const avg = average(arr);

    const squareDiff = arr.map(value =>
        Math.pow(value - avg, 2)
    );

    return Math.sqrt(
        average(squareDiff)
    );

}

// จำกัดค่าให้อยู่ในช่วง min-max
function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}

// แปลงค่าเป็นเปอร์เซ็นต์
function normalize(value, maxValue) {

    return clamp(
        (value / maxValue) * 100,
        0,
        100
    );

}