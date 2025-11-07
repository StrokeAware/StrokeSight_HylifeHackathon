import React, { useState, useRef } from "react";
import "./personalInfo.css";
import { useNavigate } from "react-router-dom";
// Make sure you run 'npm install sweetalert2' in your project!
import Swal from "sweetalert2";
import { db } from '../auth';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';

function PersonalInfo() {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [age, setAge] = useState("");
  // ✅ State สำหรับบัตรประชาชน 13 หลัก
  const [idDigits, setIdDigits] = useState(Array(13).fill(""));
  const inputsRef = useRef([]);

  const handleDigitChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // ✅ รับเฉพาะเลข 0–9
    const newDigits = [...idDigits];
    newDigits[index] = value;
    setIdDigits(newDigits);
    // ✅ auto ไปช่องถัดไป
    if (value !== "" && index < 12) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && idDigits[index] === "" && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ✅ ตรวจครบทุกช่อง  
  const idComplete = idDigits.every((d) => d !== "");
  const allFilled =
    firstname.trim() !== "" &&
    lastname.trim() !== "" &&
    age.trim() !== "" &&
    idComplete;

  const handleSave = async () => {
    if (!allFilled) return;
    const idcard = idDigits.join("");
    const patientId = `${firstname.trim()}-${lastname.trim()}`;
    const document = {
      name: `${firstname.trim()} ${lastname.trim()}`,
      cardid: idcard,
      age: age.trim(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'patients', patientId), document, { merge: true });
      // Save current patient ID to localStorage for use in other pages
      localStorage.setItem("currentPatientId", patientId);
      await Swal.fire({
        title: "บันทึกข้อมูลสำเร็จ!",
        text: "ข้อมูลผู้ป่วยถูกบันทึกเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
      navigate("/history");
    } catch (err) {
      await Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: err.message || "ไม่สามารถบันทึกข้อมูลได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  return (
    <div className="personal-info-container">
      <div className="Header-textpersonal">กรอกประวัติ</div>
      <div className="Box-personal">
        <label className="label">ชื่อ</label>
        <input
          type="text"
          className="input-box"
          placeholder="กรอกชื่อ"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <label className="label">นามสกุล</label>
        <input
          type="text"
          className="input-box"
          placeholder="กรอกนามสกุล"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        {/* ✅ หมายเลขบัตรประชาชน 13 หลัก */}
        <label className="label">หมายเลขบัตรประชาชน</label>
        <div className="idcard-container">
          {idDigits.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="idcard-box"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>
        <label className="label">อายุ</label>
        <input
          type="number"
          className="input-box"
          placeholder="กรอกอายุ"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      <div style={{ textAlign: "center", marginTop: "25px" }}>
        <button
          className={`next-button ${allFilled ? "active" : ""}`}
          disabled={!allFilled}
          onClick={handleSave}
        >
          บันทึก
        </button>
      </div>
    </div>
  );
}

export default PersonalInfo;