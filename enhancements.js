// ============================================
// enhancements.js - Dark mode / Sound / Skeleton
// ใช้ร่วมกันทุกหน้า
// ============================================

// ----------------------------
// Dark Mode
// ----------------------------

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("psa_theme", theme);
    const btn = document.getElementById("themeToggleBtn");
    if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
    playClick();
}

(function initTheme() {
    const saved = localStorage.getItem("psa_theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
})();

// ----------------------------
// Sound Feedback (เปิด/ปิดได้)
// ----------------------------

let audioCtx = null;

function isSoundOn() {
    return localStorage.getItem("psa_sound") !== "off";
}

function toggleSound() {
    const on = isSoundOn();
    localStorage.setItem("psa_sound", on ? "off" : "on");
    updateSoundBtn();
    playClick();
}

function updateSoundBtn() {
    const btn = document.getElementById("soundToggleBtn");
    if (btn) btn.textContent = isSoundOn() ? "🔊" : "🔇";
}

function playClick() {
    if (!isSoundOn()) return;
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = 660;
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
        // เบราว์เซอร์บางตัวอาจบล็อก AudioContext ก่อน user interaction - ไม่เป็นไร ข้ามไปเงียบๆ
    }
}

function playSuccessSound() {
    if (!isSoundOn()) return;
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        [523, 659, 784].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            const start = audioCtx.currentTime + i * 0.09;
            gain.gain.setValueAtTime(0.05, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(start);
            osc.stop(start + 0.18);
        });
    } catch (e) { }
}

// ----------------------------
// Page Load Skeleton
// ----------------------------

window.addEventListener("load", () => {
    const skel = document.getElementById("pageSkeleton");
    if (skel) {
        setTimeout(() => {
            skel.classList.add("hide");
            setTimeout(() => skel.remove(), 450);
        }, 250);
    }
});

// ----------------------------
// ผูกปุ่มทั้งหมดหลังโหลดหน้า
// ----------------------------

document.addEventListener("DOMContentLoaded", () => {

    applyTheme(document.documentElement.getAttribute("data-theme") || "light");
    updateSoundBtn();

    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

    const soundBtn = document.getElementById("soundToggleBtn");
    if (soundBtn) soundBtn.addEventListener("click", toggleSound);

    // ใส่เสียงคลิกเบาๆ ให้ทุกปุ่ม .btn โดยอัตโนมัติ
    document.querySelectorAll(".btn, .util-btn").forEach(btn => {
        btn.addEventListener("click", () => playClick());
    });

});
