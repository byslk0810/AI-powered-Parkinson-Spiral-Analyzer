// ============================================
// i18n.js - สลับภาษาไทย/อังกฤษ
// ใช้ร่วมกันทุกหน้า ผ่าน data-i18n attribute
// ============================================

const translations = {

    hero_subtitle: {
        th: "ระบบคัดกรองโรคพาร์กินสันเบื้องต้นจากการวาดเส้นเกลียวด้วยปัญญาประดิษฐ์",
        en: "An AI-based preliminary screening tool for Parkinson's disease using spiral drawing analysis."
    },
    btn_about: { th: "โรคพาร์กินสันคือ", en: "About Parkinson's" },
    btn_project: { th: "เกี่ยวกับโครงงาน", en: "About the Project" },
    btn_start_test: { th: "เริ่มทำแบบทดสอบ", en: "Start the Test" },
    credits_title: { th: "คณะผู้จัดทำ", en: "Project Team" },
    credits_name: { th: "นางสาวบุญญิศา อยู่บัว", en: "Ms. Bunyisa Yoobua" },
    credits_name: { th: "นางสาวศศวรรณ คุ้มกลางดอน", en: "Ms. Sasawan Koomklangdon" },
    credits_name: { th: "นางสาวจิตมณี อินแสง", en: "Ms. Jitmanee Insaeng" },
    credits_school: {
        th: "โรงเรียนกาญจนาภิเษกวิทยาลัย นครปฐม (พระตำหนักสวนกุหลาบมัธยม)",
        en: "Kanchanapisek Wittayalai Nakhon Pathom School (Phra Tamnak Suan Kularb Mattayom)"
    },
    credits_name1: { th: "นางสาวบุญญิศา อยู่บัว", en: "Ms. Bunyisa Yoobua" },
    credits_name2: { th: "นางสาวจิตมณี อินแสง", en: "Ms. Jitmanee Insaeng" },
    credits_name3: { th: "นางสาวศศวรรณ คุ้มกลางดอน", en: "Ms. Sasawan Koomklangdon" },

    about_title: { th: "โรคพาร์กินสันคือ", en: "About Parkinson's Disease" },
    about_subtitle: { th: "ทำความรู้จักโรค อาการ และแนวทางป้องกันเบื้องต้น", en: "Learn about the disease, symptoms, and basic prevention" },
    about_what_title: { th: "โรคพาร์กินสันคือ", en: "What is Parkinson's Disease" },
    about_what_body: {
        th: "โรคพาร์กินสันเป็นโรคทางระบบประสาทที่เกิดจากการเสื่อมของเซลล์สมองที่ผลิตสารโดพามีน ซึ่งทำหน้าที่ควบคุมการเคลื่อนไหวของร่างกาย เมื่อสารนี้ลดลง ผู้ป่วยจะมีปัญหาด้านการเคลื่อนไหวที่ค่อยๆ รุนแรงขึ้นตามเวลา",
        en: "Parkinson's disease is a neurological disorder caused by the degeneration of brain cells that produce dopamine, which controls body movement. As dopamine levels decline, patients gradually experience worsening movement difficulties."
    },
    about_symptoms_title: { th: "อาการ", en: "Symptoms" },
    about_video_credit: { th: "ขอขอบคุณคลิปวิดีโอจากโรงพยาบาลกรุงเทพราชสีมา", en: "Video courtesy of Bangkok Hospital Ratchasima" },
    about_prevention_title: { th: "แนวทางการป้องกัน", en: "Prevention Guidelines" },
    prevention_1: { th: "ออกกำลังกายยืดเหยียดกล้ามเนื้อสม่ำเสมอ", en: "Exercise and stretch muscles regularly" },
    prevention_2: {
        th: "รับประทานอาหารที่ดีต่อสมอง เช่น ผักผลไม้สด อาหารที่มีกรดไขมันโอเมก้า 3 และสารต้านอนุมูลอิสระ",
        en: "Eat brain-healthy foods such as fresh fruits and vegetables, omega-3 fatty acids, and antioxidants"
    },
    prevention_3: { th: "ระมัดระวังการกระทบกระเทือนทางศีรษะ", en: "Avoid head injuries and trauma" },

    test_title: { th: "แบบทดสอบวาดก้นหอย", en: "Spiral Drawing Test" },
    test_subtitle: { th: "ระบบคัดกรองโรคพาร์กินสันเบื้องต้นจากการวาดก้นหอยด้วย AI", en: "AI-based preliminary Parkinson's screening from spiral drawing" },
    draw_title: { th: "วาดก้นหอย", en: "Draw a Spiral" },
    draw_instruction: {
        th: "กรุณาวาดตามเส้นก้นหอยด้านล่าง เริ่มวาดจากจุดศูนย์กลางออกด้านนอก และไม่ยกปากกาขณะวาด",
        en: "Please trace the spiral guide below. Start from the center and draw outward without lifting your pen."
    },
    privacy_note: {
        th: "ภาพวาดนี้จะได้รับการประมวลผลอย่างปลอดภัย โดยไม่มีการจัดเก็บข้อมูลส่วนบุคคล",
        en: "This drawing is processed securely and no personal data is stored."
    },
    btn_clear: { th: "ล้าง", en: "Clear" },
    btn_analyze: { th: "วิเคราะห์", en: "Analyze" },
    result_title: { th: "ผลการวิเคราะห์", en: "Analysis Result" },
    gauge_label: { th: "คะแนนความเสี่ยง", en: "Risk Score" },
    metric_tremor: { th: "Tremor", en: "Tremor" },
    metric_tremor_sub: { th: "(อาการสั่น)", en: "(shaking)" },
    metric_deviation: { th: "Deviation", en: "Deviation" },
    metric_deviation_sub: { th: "(ความคลาดเคลื่อน)", en: "(path error)" },
    metric_speed: { th: "Speed", en: "Speed" },
    metric_speed_sub: { th: "(ความเร็ว)", en: "(drawing speed)" },
    level_title: { th: "ระดับความเสี่ยง", en: "Risk Level" },
    level_empty: { th: "ยังไม่มีข้อมูล", en: "No data yet" },
    level_low: { th: "ความเสี่ยงต่ำ", en: "Low Risk" },
    level_mid: { th: "ความเสี่ยงปานกลาง", en: "Moderate Risk" },
    level_high: { th: "ความเสี่ยงสูง", en: "High Risk" },
    back_link: { th: "← กลับหน้าแรก", en: "← Back to Home" },


    project_title: { th: "เกี่ยวกับโครงงาน", en: "About the Project" },
    project_subtitle: { th: "ที่มา ระเบียบวิธีวิจัย และข้อจำกัดของระบบ", en: "Background, methodology, and system limitations" },
    project_objective_title: { th: "วัตถุประสงค์ของโครงงาน", en: "Project Objective" },
    project_objective_body: { th: "โครงงานนี้จัดทำขึ้นเพื่อพัฒนาเครื่องมือประเมินความเสี่ยงของโรคพาร์กินสันเบื้องต้น โดยใช้ปัญญาประดิษฐ์วิเคราะห์ลักษณะการวาดเส้นเกลียว ซึ่งเป็นวิธีที่ใช้ในทางการแพทย์ เพื่อประเมินความสั่นและความสามารถในการควบคุมกล้ามเนื้อมัดเล็ก (Fine Motor Control) ของผู้ทดสอบ", en: "This project is developed to create a risk assessment tool for early-stage Parkinson's disease using AI to analyze spiral drawing patterns, a method used in medical practice to evaluate tremor and fine motor control abilities of test subjects." },
    project_dataset_title: { th: "ชุดข้อมูลที่ใช้เทรนโมเดล (Dataset)", en: "Training Dataset" },
    project_dataset_body: { th: "ชุดข้อมูลที่ใช้เทรนโมเดลนี้เป็นชุดข้อมูลสาธารณะจาก Kaggle โดยมีผู้เข้าร่วมทดสอบ 100 คน แบ่งเป็นผู้ป่วยโรคพาร์กินสันและกลุ่มควบคุม", en: "The training dataset used in this model is a public dataset from Kaggle with 100 test participants divided into Parkinson's patients and healthy control groups" },
    project_limitations_body: { th: "เป็นเพียงเครื่องมือคัดกรองเบื้องต้น ไม่สามารถใช้แทนการวินิจฉัยของแพทย์ผู้เชี่ยวชาญได้", en: "This is only a preliminary screening tool and cannot replace a specialist's diagnosis" },
    project_limitation_1: { th: "เป็นเพียงเครื่องมือคัดกรองเบื้องต้น ไม่สามารถใช้แทนการวินิจฉัยของแพทย์ผู้เชี่ยวชาญได้", en: "This is only a preliminary screening tool and cannot replace a specialist's diagnosis" },
    project_limitation_2: { th: "ผลลัพธ์อาจคลาดเคลื่อนได้จากอุปกรณ์ที่ใช้วาด (เมาส์ / นิ้ว / ปากกาสไตลัส) และขนาดหน้าจอ", en: "Results may vary depending on drawing device (mouse / finger / stylus pen) and screen size" },
    project_limitation_3: { th: "โมเดลเทรนจากภาพวาดผ่านหน้าจอดิจิทัล อาจมีความแม่นยำต่างจากการวาดบนกระดาษจริง", en: "Model trained on digital screen drawings may have different accuracy than hand-drawn paper drawings" },
    project_limitation_4: { th: "ยังไม่ได้ผ่านการรับรองจากหน่วยงานทางการแพทย์อย่างเป็นทางการ", en: "Not yet officially certified by medical authorities" },
    table_group: { th: "กลุ่ม", en: "Group" },
    table_count: { th: "จำนวนภาพ", en: "Image Count" },
    project_architecture_title: { th: "สถาปัตยกรรมโมเดล (Model Architecture)", en: "Model Architecture" },
    project_architecture_body: { th: "โมเดลใช้เทคนิค Transfer Learning บนสถาปัตยกรรม MobileNetV2 ซึ่งเป็นโครงข่ายประสาทเทียมแบบ Convolutional Neural Network (CNN)", en: "The model uses Transfer Learning technique on MobileNetV2 architecture, a Convolutional Neural Network (CNN) designed for efficient processing" },
    project_dataset_body_full: { th: "โมเดลถูกเทรนด้วยภาพลายเส้นก้นหอยจากผู้ป่วยโรคพาร์กินสันและกลุ่มควบคุม (healthy control) รวมทั้งสิ้น 1,073 ภาพ แบ่งเป็นชุดฝึก (train) 939 ภาพ (healthy 486 / parkinson 453), ชุดตรวจสอบระหว่างเทรน (validation) 90 ภาพ (healthy 47 / parkinson 43), และชุดทดสอบ (test) 44 ภาพ (healthy 23 / parkinson 21) โดยข้อมูลภาพทั้งหมดมาจากแหล่งข้อมูลสาธารณะ Roboflow", en: "The model was trained with spiral drawing images from Parkinson's disease patients and healthy control groups totaling 1,073 images divided into training set 939 images, validation set 90 images, and test set 44 images from the public Roboflow dataset" },
    project_architecture_body_full: { th: "โมเดลใช้เทคนิค Transfer Learning บนสถาปัตยกรรม MobileNetV2 ซึ่งเป็นโครงข่ายประสาทเทียมแบบ Convolutional Neural Network (CNN) ที่ออกแบบมาให้มีขนาดเล็กและประมวลผลได้รวดเร็ว เหมาะกับการรันบนเบราว์เซอร์โดยตรง ผ่าน TensorFlow.js โดยต่อท้ายด้วยชั้น Global Average Pooling, Dense(128, ReLU) และ Dense(1, Sigmoid) สำหรับการจำแนกแบบ 2 กลุ่ม (Parkinson's / Healthy)", en: "The model uses Transfer Learning technique on MobileNetV2 architecture, a Convolutional Neural Network (CNN) designed for efficient processing suitable for direct browser execution via TensorFlow.js with additional layers for 2-class classification (Parkinson's / Healthy)" },
    project_results_title: { th: "ผลการทดสอบความแม่นยำของโมเดล", en: "Model Accuracy Results" },
    project_results_body: { th: "ผลการทดสอบบนชุดข้อมูล test (44 ภาพ) พบว่าโมเดลมีความแม่นยำโดยรวม (Overall Accuracy) 91%", en: "The model achieved 91% overall accuracy on the test dataset (44 images)" },
    project_limitations_title: { th: "ข้อจำกัดของระบบ", en: "System Limitations" },
    project_references_title: { th: "เอกสารอ้างอิง (References)", en: "References" },
    reference_1_org: { th: "โรงพยาบาลรามาธิบดี", en: "Ramathibodi Hospital" },
    reference_1_title: { th: "โรคพาร์กินสัน อาการสั่น", en: "Parkinson's Disease: Tremor Symptoms" },
    reference_2_org: { th: "โรงพยาบาลพระรามเก้า", en: "Praram 9 Hospital" },
    reference_2_title: { th: "โรคพาร์กินสัน (Parkinson's Disease)", en: "Parkinson's Disease" },
    reference_3_org: { th: "โรงพยาบาลเมดพาร์ค", en: "MedPark Hospital" },
    reference_3_title: { th: "โรคพาร์กินสัน", en: "Parkinson's Disease" },
    project_advisor_title: { th: "อาจารย์ที่ปรึกษาโครงงาน", en: "Project Advisor" },
    project_advisor_body: { th: "1.นายสุทธิศักดิ์ จันทร์ห้างหว้า", en: "1. Mr. Sutthisak Chanhaengwaa" },
    project_advisor_name: { th: "นายสุทธิศักดิ์ จันทร์ห้างหว้า", en: "Mr. Sutthisak Chanhaengwaa" },
    project_advisor_name2: { th: "2.นางปิ่นแก้ว กฤชแสงโชติ", en: "2. Ms. Pinngaw Kritsangchot" },
    project_results_credit: { th: "💡 ประเมินด้วย classification_report() จาก scikit-learn บนชุดข้อมูล test ที่โมเดลไม่เคยเห็นระหว่างเทรน", en: "💡 Evaluated with classification_report() from scikit-learn on unseen test data" },
    ai_title: { th: "AI วิเคราะห์เพิ่มเติม", en: "Additional AI Analysis" },
    ai_default: { th: "ระบบจะแสดงผลการวิเคราะห์จาก AI ที่นี่", en: "AI analysis results will appear here" },
    history_title: { th: "ประวัติการทดสอบ", en: "Test History" },
    history_empty: { th: "ยังไม่มีประวัติการทดสอบในเครื่องนี้", en: "No test history on this device yet" },
    btn_download_result: { th: "ดาวน์โหลดผลลัพธ์", en: "Download Result" },
    recommend_title: { th: "ข้อแนะนำ", en: "Recommendation" },
    recommend_body: {
        th: "ระบบนี้เป็นเพียงเครื่องมือคัดกรองโรคพาร์กินสันเบื้องต้น ไม่สามารถใช้แทนการวินิจฉัยของแพทย์ได้ หากท่านมีอาการติดต่อกันเป็นเวลานาน ควรปรึกษาแพทย์ผู้เชี่ยวชาญ",
        en: "This system is only a preliminary screening tool and cannot replace a medical diagnosis. If you experience persistent symptoms, please consult a specialist."
    },
    btn_assessment: { th: "แบบประเมิน", en: "Assessment Form" },
    footer_line1: { th: "Parkinson Spiral Analyzer Version 6.0", en: "Parkinson Spiral Analyzer Version 6.0" },
    footer_line2: { th: "จัดทำขึ้นเพื่อการศึกษาและงานวิจัย", en: "Developed for Educational & Research Purposes" },
    back_link: { th: "← กลับหน้าแรก", en: "← Back to Home" }

};

function applyLanguage(lang) {

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const entry = translations[key];
        if (entry && entry[lang]) {
            el.innerHTML = entry[lang];
        }
    });

    document.documentElement.lang = lang === "en" ? "en" : "th";
    localStorage.setItem("psa_lang", lang);

    const btn = document.getElementById("langToggleBtn");
    if (btn) btn.textContent = lang === "th" ? "EN" : "ไทย";

    if (typeof refreshDynamicText === "function") refreshDynamicText();

}

function toggleLanguage() {
    const current = localStorage.getItem("psa_lang") || "th";
    applyLanguage(current === "th" ? "en" : "th");
    if (typeof playClick === "function") playClick();
}

document.addEventListener("DOMContentLoaded", () => {

    const saved = localStorage.getItem("psa_lang") || "th";
    applyLanguage(saved);

    const langBtn = document.getElementById("langToggleBtn");
    if (langBtn) langBtn.addEventListener("click", toggleLanguage);

});
