import React, { useState } from "react";
import "./History.css";

function History() {
  const questions = [
    { id: "q-onset", text: "เริ่มมีอาการครั้งแรกเมื่อไหร่? (Onset time / Last known well)" },
    { id: "q-face-arm-speech", text: "มีหน้าเบี้ยว แขนอ่อนแรง หรือพูดไม่ชัดไหม?" },
    { id: "q-vision", text: "มองไม่ชัด มองเห็นภาพซ้อน หรือมองไม่เห็นข้างเดียวไหม?" },
    { id: "q-balance", text: "เสียการทรงตัว เดินเซ เวียนศีรษะมากไหม?" },
    { id: "q-headache", text: "มีปวดศีรษะรุนแรงเฉียบพลันผิดปกติหรือไม่?" },
    { id: "q-history-stroke-heart", text: "เคยเป็นสโตรกมาก่อนหรือมีโรคหัวใจ (เช่น Atrial Fibrillation) ไหม?" },
    { id: "q-medical-history", text: "มีโรคประจำตัวสำคัญอะไรบ้าง? (ความดัน เบาหวาน ไขมันสูง)" },
    { id: "q-medication", text: "กำลังใช้ยาอะไรอยู่บ้าง? โดยเฉพาะ Warfarin / DOAC / Aspirin / Clopidogrel" },
    { id: "q-allergy-bleeding", text: "มีประวัติแพ้ยาหรือเลือดออกง่ายผิดปกติไหม?" },
    { id: "q-lifestyle", text: "สูบบุหรี่ ดื่มแอลกอฮอล์ หรือใช้สารเสพติดไหม?" }
  ];

  const [answers, setAnswers] = useState(
    Object.fromEntries(questions.map(q => [q.id, { value: "", none: false }]))
  );

  const handleChange = (id, value) => {
    setAnswers(prev => ({
      ...prev,
      [id]: { ...prev[id], value }
    }));
  };

  const handleToggleNone = (id) => {
    setAnswers(prev => {
      const nowNone = !prev[id].none;
      return {
        ...prev,
        [id]: {
          value: nowNone ? "" : prev[id].value,
          none: nowNone
        }
      };
    });
  };

  // ✅ ตรวจว่าตอบครบทุกข้อหรือยัง
  const allCompleted = Object.values(answers).every(
    (q) => q.none === true || q.value.trim() !== ""
  );

  return (
    <div className="body-history">
      <div className="Header-text">ซักประวัติ</div>

      <div className="Box">
        {questions.map((q) => {
          const { value, none } = answers[q.id];

          return (
            <div key={q.id} className="question-block">
              <label className="question-text">{q.text}</label>

              <input
                type="text"
                className="answer-input"
                placeholder={none ? "ถูกเลือกเป็น “ไม่มี”" : "พิมพ์คำตอบที่นี่..."}
                value={value}
                onChange={(e) => handleChange(q.id, e.target.value)}
                disabled={none}
              />

              <button
                type="button"
                className={`none-button ${none ? "active" : ""}`}
                onClick={() => handleToggleNone(q.id)}
              >
                ไม่มี
              </button>
            </div>
          );
        })}
      </div>

      {/* ✅ ปุ่มถัดไป */}
      <div style={{ textAlign: "center", marginTop: "25px" }}>
        <button
          className={`next-button ${allCompleted ? "active" : ""}`}
          disabled={!allCompleted}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}

export default History;