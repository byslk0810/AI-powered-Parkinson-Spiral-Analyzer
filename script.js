// ============================================
// Parkinson Spiral Analyzer V6.0
// script.js - Part 1
// ============================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ป้องกันการเลื่อนหน้าจอขณะวาดบนมือถือ/iPad
canvas.style.touchAction = "none";

// ----------------------------
// ตัวแปรหลัก
// ----------------------------

let drawing = false;
let points = [];
let hasAnalyzed = false;

// ===== AI Model =====
let aiModel = null;

// เก็บจุดของก้นหอยมาตรฐาน
let referencePoints = [];

async function loadAIModel() {

    const aiResult = document.getElementById("aiResult");
    if (aiResult) {
        aiResult.innerHTML = '<div>กำลังโหลด AI Model...</div><div class="ai-loading-bar"><div class="fill"></div></div>';
    }

    try {

        await tf.setBackend('cpu');
        await tf.ready();

        aiModel = await tf.loadLayersModel("model/model.json");

        console.log("AI Model Loaded, backend:", tf.getBackend());

        if (aiResult) {
            const lang = localStorage.getItem("psa_lang") || "th";
            aiResult.innerHTML = (typeof translations !== "undefined" && translations.ai_default)
                ? translations.ai_default[lang]
                : "ระบบจะแสดงผลการวิเคราะห์จาก AI ที่นี่";
        }

    } catch (err) {

        console.error("โหลดโมเดลไม่สำเร็จ:", err);
        console.error("ข้อความ:", err.message);

        if (aiResult) {
            aiResult.textContent = "โหลด AI Model ไม่สำเร็จ กรุณารีเฟรชหน้าใหม่";
        }

    }

}

// ----------------------------
// ปรับขนาด Canvas
// ----------------------------

function resizeCanvas() {

    const size = Math.min(window.innerWidth * 0.9, 640);

    canvas.width = size;
    canvas.height = size;

    drawReferenceSpiral();
    generateReferenceSpiral();

}

window.addEventListener("resize", resizeCanvas);

// ----------------------------
// วาดก้นหอยต้นแบบ
// ----------------------------

function drawReferenceSpiral() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // เพิ่ม 2 บรรทัดนี้ — เติมพื้นหลังขาว "จริง" ลงในบิตแมพ ไม่ใช่แค่ CSS
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.beginPath();

    ctx.strokeStyle = "#d8e6ff";
    ctx.lineWidth = 1.5;

    const coeff = canvas.width * 0.011;

    for (let angle = 0; angle <= 10 * Math.PI; angle += 0.1) {

        const r = coeff * angle;

        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        if (angle === 0) {

            ctx.moveTo(x, y);

        } else {

            ctx.lineTo(x, y);

        }

    }

    ctx.stroke();

}

// ----------------------------
// ตำแหน่งเมาส์ / นิ้ว / Apple Pencil
// ----------------------------

function getPoint(event) {

    const rect = canvas.getBoundingClientRect();

    return {

        x: event.clientX - rect.left,

        y: event.clientY - rect.top,

        pressure: event.pressure || 0.5,

        time: Date.now()

    };

}

// ----------------------------
// เริ่มวาด
// ----------------------------

function startDraw(event) {

    event.preventDefault();

    drawing = true;

    canvas.setPointerCapture(event.pointerId);

    const p = getPoint(event);

    ctx.beginPath();

    ctx.moveTo(p.x, p.y);

    points.push(p);

}

// ----------------------------
// Pointer Events
// ----------------------------

canvas.addEventListener("pointerdown", startDraw);
canvas.addEventListener("pointermove", draw);
canvas.addEventListener("pointerup", stopDraw);
canvas.addEventListener("pointerleave", stopDraw);
canvas.addEventListener("pointercancel", stopDraw);

// เรียกครั้งแรก
resizeCanvas();

// ----------------------------
// วาดเส้น
// ----------------------------

function draw(event) {

    if (!drawing) return;

    const p = getPoint(event);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // ถ้าเป็น Apple Pencil จะใช้แรงกดปรับความหนา
    const pressure = p.pressure || 0.5;
    ctx.lineWidth = 2 + pressure * 2;

    ctx.strokeStyle = "#000000";

    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    points.push(p);

}

// ----------------------------
// หยุดวาด
// ----------------------------

function stopDraw(event) {

    if (!drawing) return;

    drawing = false;

    if (event.pointerId !== undefined) {
        canvas.releasePointerCapture(event.pointerId);
    }

}

// ----------------------------
// ล้าง Canvas
// ----------------------------

function clearCanvas() {

    points = [];
    hasAnalyzed = false;

    ctx.beginPath();

    drawReferenceSpiral();

    setGauge(0);
    setBar("tremorBar", "tremor", 0, 40);
    setBar("deviationBar", "deviation", 0, 30);
    setBar("speedBar", "speed", 0, 30);
    const lang = localStorage.getItem("psa_lang") || "th";
    document.getElementById("level").textContent = lang === "en" ? "No data yet" : "ยังไม่มีข้อมูล";
    setLevelBoxColor("");

    const ai = document.getElementById("aiResult");
    if (ai) {
        ai.classList.remove("ai-thinking");
        const lang = localStorage.getItem("psa_lang") || "th";
        ai.textContent = lang === "en" ? "AI analysis results will appear here" : "ระบบจะแสดงผลการวิเคราะห์จาก AI ที่นี่";
    }

}

// ============================================
// Part 2 : Gauge & Progress Bar Animation
// ============================================

const gaugeFill = document.getElementById("gaugeFill");
const gaugeNeedle = document.getElementById("gaugeNeedle");
const gaugeArcLength = gaugeFill.getTotalLength();

gaugeFill.style.strokeDasharray = gaugeArcLength;
gaugeFill.style.strokeDashoffset = gaugeArcLength;

function riskColor(score) {
    if (score <= 30) return getComputedStyle(document.documentElement).getPropertyValue('--risk-low').trim();
    if (score <= 60) return getComputedStyle(document.documentElement).getPropertyValue('--risk-mid').trim();
    return getComputedStyle(document.documentElement).getPropertyValue('--risk-high').trim();
}

function setGauge(score) {

    const clamped = Math.max(0, Math.min(100, score));
    const offset = gaugeArcLength * (1 - clamped / 100);

    gaugeFill.style.strokeDashoffset = offset;
    gaugeFill.style.stroke = riskColor(clamped);

    const angle = -90 + (clamped / 100) * 180;
    gaugeNeedle.style.transform = `rotate(${angle}deg)`;

    animateCount("riskScore", clamped);

}

function setBar(barId, valueId, value, max) {

    const pct = Math.max(0, Math.min(100, (value / max) * 100));

    document.getElementById(barId).style.width = pct + "%";
    document.getElementById(valueId).textContent = value;

}

function setLevelBoxColor(level) {

    const box = document.getElementById("levelBox");
    if (!box) return;

    box.classList.remove("level-low", "level-mid", "level-high");

    if (level.includes("ต่ำ")) box.classList.add("level-low");
    else if (level.includes("ปานกลาง")) box.classList.add("level-mid");
    else if (level.includes("สูง")) box.classList.add("level-high");

}

function animateCount(elId, target) {

    const el = document.getElementById(elId);
    const start = parseInt(el.textContent) || 0;
    const duration = 700;
    const startTime = performance.now();

    function step(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(start + (target - start) * eased);
        if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);

}
function createCleanCanvasForAI(points, size) {
    const cleanCanvas = document.createElement("canvas");
    cleanCanvas.width = size;
    cleanCanvas.height = size;
    const cctx = cleanCanvas.getContext("2d");

    cctx.fillStyle = "#FFFFFF";
    cctx.fillRect(0, 0, size, size);

    cctx.strokeStyle = "#000000";
    cctx.lineWidth = size * 0.012;
    cctx.lineCap = "round";
    cctx.lineJoin = "round";

    cctx.beginPath();
    points.forEach((p, i) => {
        if (i === 0) cctx.moveTo(p.x, p.y);
        else cctx.lineTo(p.x, p.y);
    });
    cctx.stroke();

    return cleanCanvas;
}
function softenAIProb(rawProb, T = 2.5) {
    const clamped = Math.min(Math.max(rawProb, 0.001), 0.999); // กัน log(0)
    const logit = Math.log(clamped / (1 - clamped));
    const scaledLogit = logit / T;
    return 1 / (1 + Math.exp(-scaledLogit));
}
function combineResults(ruleRisk, aiProb, threshold = 0.70) {

    const RULE_WEIGHT = 0.65;
    const AI_WEIGHT = 0.35;

    let adjustedAI;
    if (aiProb >= threshold) {
        adjustedAI = 0.5 + ((aiProb - threshold) / (1 - threshold)) * 0.5;
    } else {
        adjustedAI = (aiProb / threshold) * 0.5;
    }

    const ruleNormalized = ruleRisk / 100;
    const fused = (ruleNormalized * RULE_WEIGHT) + (adjustedAI * AI_WEIGHT);
    const fusedScore = Math.round(fused * 100);

    let level = "";
    const lang = localStorage.getItem("psa_lang") || "th";

    if (fusedScore <= 30) {
        level = lang === "en" ? "Low Risk" : "ความเสี่ยงต่ำ";
    } else if (fusedScore <= 60) {
        level = lang === "en" ? "Moderate Risk" : "ความเสี่ยงปานกลาง";
    } else {
        level = lang === "en" ? "High Risk" : "ความเสี่ยงสูง";
    }

    return { fusedScore, level };

}
// ----------------------------
// วิเคราะห์
// ----------------------------

async function analyzeDrawing() {

    if (points.length < 20) {
        const lang = localStorage.getItem("psa_lang") || "th";
        alert(lang === "en" ? "Please draw a spiral first" : "กรุณาวาดก้นหอยก่อน");

        return;

    }

    const btnText = document.getElementById("analyzeBtnText");
    const spinner = document.getElementById("analyzeSpinner");
    const analyzeBtn = document.getElementById("analyzeBtn");

    if (spinner) spinner.hidden = false;
    if (btnText) btnText.style.opacity = "0";
    if (analyzeBtn) analyzeBtn.disabled = true;

    try {

        // ให้เห็นแอนิเมชันโหลดสักครู่ก่อนคำนวณ (feedback ให้ผู้ใช้รับรู้ว่ากำลังทำงาน)
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = analyzeSpiral(points);

        if (!result) {
            const lang = localStorage.getItem("psa_lang") || "th";
            alert(lang === "en" ? "Unable to analyze" : "ไม่สามารถวิเคราะห์ได้");
            return;
        }

        setGauge(result.risk);
        setBar("tremorBar", "tremor", result.tremorScore, 40);
        setBar("deviationBar", "deviation", result.deviationScore, 30);
        setBar("speedBar", "speed", result.speedScore, 30);
        document.getElementById("level").textContent = result.level;
        setLevelBoxColor(result.level);

        hasAnalyzed = true;
        window.lastResult = result;
 
        if (typeof playSuccessSound === "function") playSuccessSound();

        // คืนสถานะปุ่มก่อน แล้วค่อยเรียก AI ต่อ (ไม่ให้ AI บล็อกปุ่ม)
        if (spinner) spinner.hidden = true;
        if (btnText) btnText.style.opacity = "1";
        if (analyzeBtn) analyzeBtn.disabled = false;

        // ถ้ามี AI ให้เรียกใช้งาน
       if (typeof analyzeWithGemini === "function") {

    const ai = document.getElementById("aiResult");
    if (ai) ai.classList.add("ai-thinking");

    try {

        const cleanCanvas = createCleanCanvasForAI(points, canvas.width);
        const aiProb = await analyzeWithGemini(cleanCanvas);

        if (aiProb !== null) {

            const AI_THRESHOLD = 0.70;
            const softenedProb = softenAIProb(aiProb, 4.5);
            const fused = combineResults(result.risk, softenedProb, AI_THRESHOLD);
            setGauge(fused.fusedScore);
            document.getElementById("level").textContent = fused.level;
            setLevelBoxColor(fused.level);

            // แสดงรายละเอียด AI เป็นข้อมูลประกอบ
            const aiLabel = softenedProb >= AI_THRESHOLD ? "Parkinson" : "Healthy";
            const aiConfidence = softenedProb >= AI_THRESHOLD 
            ? softenedProb * 100 
            : (1 - softenedProb) * 100;

            document.getElementById("aiResult").innerHTML = `
                <h3>${aiLabel}</h3>
                <p>Confidence : ${aiConfidence.toFixed(2)}%</p>
                <p style="font-size:13px;color:#5B7480;margin-top:6px;">
                    คะแนนรวม (ระบบ + AI) : ${fused.fusedScore}/100 — ${fused.level}
                </p>
            `;

            // อัปเดตผลลัพธ์ที่จะใช้บันทึกประวัติ/ดาวน์โหลด ให้เป็นคะแนนรวม
            result.risk = fused.fusedScore;
            result.level = fused.level;
            window.lastResult = result;

            saveToHistory(result);

        }

    } catch (aiErr) {
        console.error("AI วิเคราะห์ผิดพลาด:", aiErr);
    } finally {
        if (ai) ai.classList.remove("ai-thinking");
    }
        }

    } catch (err) {

        console.error("วิเคราะห์ผิดพลาด:", err);
        const lang = localStorage.getItem("psa_lang") || "th";
        alert(lang === "en" ? "Error during analysis. Please try again." : "เกิดข้อผิดพลาดระหว่างวิเคราะห์ ลองใหม่อีกครั้ง");

    } finally {

        // กันไว้อีกชั้น: ไม่ว่าจะเกิดอะไรขึ้น ปุ่มต้องกลับสถานะปกติเสมอ
        if (spinner) spinner.hidden = true;
        if (btnText) btnText.style.opacity = "1";
        if (analyzeBtn) analyzeBtn.disabled = false;

    }

}

// ============================================
// Part 3 : Reference Spiral & Export
// ============================================


// สร้างข้อมูลก้นหอยมาตรฐาน
function generateReferenceSpiral() {

    referencePoints = [];

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const coeff = canvas.width * 0.011;

    for (let angle = 0; angle <= 10 * Math.PI; angle += 0.05) {

        const r = coeff * angle;

        referencePoints.push({

            x: cx + r * Math.cos(angle),

            y: cy + r * Math.sin(angle)

        });

    }

}

// เรียกสร้างก้นหอยมาตรฐาน
generateReferenceSpiral();


// ============================================
// ส่งออกภาพ Canvas
// ============================================

function exportCanvasImage() {

    return canvas.toDataURL("image/png");

}


// ============================================
// ดาวน์โหลดรูป
// ============================================

// ============================================
// ประวัติการทดสอบ (localStorage)
// ============================================

const HISTORY_KEY = "psa_history";
const HISTORY_MAX = 10;

function saveToHistory(result) {

    let history = [];
    try {
        history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch (e) {
        history = [];
    }

    history.push({
        date: new Date().toISOString(),
        risk: result.risk,
        tremorScore: result.tremorScore,
        deviationScore: result.deviationScore,
        speedScore: result.speedScore,
        level: result.level
    });

    if (history.length > HISTORY_MAX) {
        history = history.slice(history.length - HISTORY_MAX);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    renderHistory();

}

function renderHistory() {

    const container = document.getElementById("historyList");
    if (!container) return;

    let history = [];
    try {
        history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch (e) {
        history = [];
    }

    if (history.length === 0) {
        const lang = localStorage.getItem("psa_lang") || "th";
        const emptyText = (typeof translations !== "undefined" && translations.history_empty)
            ? translations.history_empty[lang]
            : "ยังไม่มีประวัติการทดสอบในเครื่องนี้";
        container.innerHTML = `<p class="history-empty">${emptyText}</p>`;
        return;
    }

    let html = "";

    history.slice().reverse().forEach(item => {
        const d = new Date(item.date);
        const dateStr = d.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "2-digit" }) +
            " " + d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
        html += `<div class="history-item"><span>${dateStr} — ${item.level}</span><strong>${item.risk}</strong></div>`;
    });

    container.innerHTML = html;

    drawSparkline(history);

}

function drawSparkline(history) {

    let svgEl = document.getElementById("historySparkline");
    if (!svgEl) {
        svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgEl.setAttribute("id", "historySparkline");
        svgEl.setAttribute("class", "sparkline");
        svgEl.setAttribute("viewBox", "0 0 600 100");
        svgEl.setAttribute("width", "100%");
        svgEl.setAttribute("style", "max-width:100%;");
        document.getElementById("historyList").after(svgEl);
    }

    const w = 600, h = 100, padX = 20, padY = 16;
    const values = history.map(h => h.risk);
    const n = values.length;

    const coords = values.map((v, i) => {
        const x = n === 1 ? w / 2 : padX + (i / (n - 1)) * (w - padX * 2);
        const y = h - padY - (v / 100) * (h - padY * 2);
        return { x, y, v };
    });

    const points = coords.map(c => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");

    const teal = getComputedStyle(document.documentElement).getPropertyValue('--teal').trim() || "#1F7A6C";
    const inkSoft = getComputedStyle(document.documentElement).getPropertyValue('--ink-soft').trim() || "#5B7480";

    const dots = coords.map(c =>
        `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="4" fill="${teal}" stroke="white" stroke-width="1.5"/>`
    ).join("");

    svgEl.innerHTML = `
        <line x1="${padX}" y1="${h - padY}" x2="${w - padX}" y2="${h - padY}" stroke="${inkSoft}" stroke-width="1" opacity="0.25"/>
        <polyline points="${points}" fill="none" stroke="${teal}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        ${dots}
    `;

}

// ============================================
// ดาวน์โหลดผลลัพธ์เป็นรูปภาพสรุป
// ============================================

function downloadResultImage() {

    if (!hasAnalyzed || !window.lastResult) {
        const lang = localStorage.getItem("psa_lang") || "th";
        alert(lang === "en" ? "Please draw a spiral and analyze first" : "กรุณาวาดก้นหอยและกดวิเคราะห์ก่อน");
        return;
    }

    const result = window.lastResult;

    const out = document.createElement("canvas");
    out.width = 700;
    out.height = 900;
    const octx = out.getContext("2d");

    // พื้นหลัง
    octx.fillStyle = "#EEF3F4";
    octx.fillRect(0, 0, out.width, out.height);

    // หัวข้อ
    octx.fillStyle = "#0B2942";
    octx.font = "bold 28px sans-serif";
    octx.textAlign = "center";
    octx.fillText("Parkinson Spiral Analyzer", out.width / 2, 50);
    octx.font = "16px sans-serif";
    octx.fillStyle = "#5B7480";
    octx.fillText(new Date().toLocaleString("th-TH"), out.width / 2, 78);

    // ภาพวาดก้นหอย
    const drawW = 500;
    const drawX = (out.width - drawW) / 2;
    octx.drawImage(canvas, drawX, 100, drawW, drawW);
    octx.strokeStyle = "#1F7A6C";
    octx.lineWidth = 3;
    octx.strokeRect(drawX, 100, drawW, drawW);

    // สรุปผล
    let y = 100 + drawW + 50;
    octx.textAlign = "left";
    octx.fillStyle = "#0B2942";
    octx.font = "bold 22px sans-serif";
    const lang = localStorage.getItem("psa_lang") || "th";
    const riskLabel = lang === "en" ? "Risk Score:" : "คะแนนความเสี่ยง:";
    octx.fillText(`${riskLabel} ${result.risk} (${result.level})`, 60, y);

    y += 40;
    octx.font = "18px sans-serif";
    octx.fillStyle = "#142A38";
    const tremorLabel = lang === "en" ? "Tremor (shaking):" : "Tremor (อาการสั่น):";
    octx.fillText(`${tremorLabel} ${result.tremorScore} / 40`, 60, y);
    y += 30;
    const deviationLabel = lang === "en" ? "Deviation (path error):" : "Deviation (ความคลาดเคลื่อน):";
    octx.fillText(`${deviationLabel} ${result.deviationScore} / 30`, 60, y);
    y += 30;
    const speedLabel = lang === "en" ? "Speed (drawing speed):" : "Speed (ความเร็ว):";
    octx.fillText(`${speedLabel} ${result.speedScore} / 30`, 60, y);

    y += 50;
    octx.font = "14px sans-serif";
    octx.fillStyle = "#5B7480";
    wrapText(octx, "ระบบนี้เป็นเพียงเครื่องมือคัดกรองเบื้องต้น ไม่สามารถใช้แทนการวินิจฉัยของแพทย์ได้", 60, y, 580, 20);

    const link = document.createElement("a");
    link.download = "parkinson-spiral-result.png";
    link.href = out.toDataURL("image/png");
    link.click();

}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

function downloadDrawing() {

    const link = document.createElement("a");

    link.download = "spiral.png";

    link.href = exportCanvasImage();

    link.click();

}


// ============================================
// ไปหน้าแบบประเมิน (บันทึกรูปอัตโนมัติก่อน)
// ============================================

const ASSESSMENT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdp6A5UuzbkmnmWYRohR4SDM5fMfqoWaJqQdVwFsB_-OwREOw/viewform?usp=header";

async function goToAssessment() {

    if (!hasAnalyzed) {
        const lang = localStorage.getItem("psa_lang") || "th";
        alert(lang === "en" ? "Please complete spiral drawing and analysis first before taking the assessment" : "กรุณาวาดก้นหอยและกดปุ่ม \"วิเคราะห์\" ให้เสร็จก่อน จึงจะไปแบบประเมินได้");
        return;
    }

    if (navigator.canShare) {

        try {
            const dataUrl = exportCanvasImage();
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], "spiral.png", { type: "image/png" });

            if (navigator.canShare({ files: [file] })) {

                const lang = localStorage.getItem("psa_lang") || "th";
                alert(lang === "en"
                    ? "A share menu will appear. Please choose 'Save Image' to download your result."
                    : "ระบบจะแสดงเมนูแชร์ กรุณาเลือก \"บันทึกรูปภาพ\" เพื่อดาวน์โหลดผลลัพธ์");

                await navigator.share({
                    files: [file],
                    title: "Parkinson Spiral Analyzer"
                });
            } else {
                downloadDrawing();
            }
        } catch (err) {
            console.error("แชร์ภาพไม่สำเร็จ:", err);
            downloadDrawing();
        }

    } else {
        downloadDrawing();
    }

    window.open(ASSESSMENT_FORM_URL, "_blank");

}

// ============================================
// นับเวลาการวาด
// ============================================

function getDrawingTime() {

    if (points.length < 2) return 0;

    return (

        points[points.length - 1].time -

        points[0].time

    ) / 1000;

}


// ============================================
// ความยาวเส้นทั้งหมด
// ============================================

function getTotalDistance() {

    let total = 0;

    for (let i = 1; i < points.length; i++) {

        total += Math.sqrt(

            Math.pow(points[i].x - points[i - 1].x, 2) +

            Math.pow(points[i].y - points[i - 1].y, 2)

        );

    }

    return total;

}


// ============================================
// ความเร็วเฉลี่ย
// ============================================

function getAverageSpeed() {

    const time = getDrawingTime();

    if (time === 0) return 0;

    return getTotalDistance() / time;

}


// ============================================
// Export Report
// ============================================

function exportReport() {

    const report = {

        date: new Date().toLocaleString(),

        risk: document.getElementById("riskScore").textContent,

        tremor: document.getElementById("tremor").textContent,

        deviation: document.getElementById("deviation").textContent,

        speed: document.getElementById("speed").textContent,

        level: document.getElementById("level").textContent,

        drawingTime: getDrawingTime(),

        averageSpeed: getAverageSpeed()

    };

    console.table(report);

    return report;

}

// ============================================
// Keyboard Shortcut
// ============================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Delete"){

        clearCanvas();

    }

    if(e.key==="Enter"){

        analyzeDrawing();

    }

});

// ============================================
// เริ่มระบบ
// ============================================

 window.onload = async () => {

    resizeCanvas();

    drawReferenceSpiral();

    generateReferenceSpiral();

    renderHistory();

    await loadAIModel();

    console.log("Parkinson Spiral Analyzer V6.0 Ready");

};
