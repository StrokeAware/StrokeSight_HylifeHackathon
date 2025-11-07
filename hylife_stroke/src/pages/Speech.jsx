import React, { useState, useEffect } from 'react';
import './Speech.css';

// Function สำหรับตรวจสอบความถูกต้อง
export const checkCorrectness = (text, targetPhrase) => {
  const normalizedText = text.trim().replace(/\s+/g, '');
  const normalizedTarget = targetPhrase.replace(/\s+/g, '');
  return normalizedText === normalizedTarget;
};

// Function สำหรับเริ่มต้น Speech Recognition
export const initializeSpeechRecognition = (onResult, onError, onEnd) => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'th-TH';

    recognitionInstance.onresult = onResult;
    recognitionInstance.onerror = onError;
    recognitionInstance.onend = onEnd;

    return recognitionInstance;
  }
  return null;
};

// Function สำหรับจัดการ Speech Result
export const handleSpeechResult = (event) => {
  let finalTranscript = '';
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript;
    }
  }
  return finalTranscript;
};

// Function สำหรับเริ่มฟัง
export const startListening = (recognition, setTranscript, setIsCorrect, setIsListening) => {
  if (recognition) {
    setTranscript('');
    setIsCorrect(null);
    recognition.start();
    setIsListening(true);
  }
};

// Function สำหรับหยุดฟัง
export const stopListening = (recognition, setIsListening) => {
  if (recognition) {
    recognition.stop();
    setIsListening(false);
  }
};

// Main Speech Component
function Speech() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [recognition, setRecognition] = useState(null);
  
  const targetPhrase = "ยายพาหลานไปซื้อขนมที่ตลาด";

  useEffect(() => {
    const onResult = (event) => {
      const finalTranscript = handleSpeechResult(event);
      
      if (finalTranscript) {
        setTranscript(finalTranscript);
        const correct = checkCorrectness(finalTranscript, targetPhrase);
        setIsCorrect(correct);
      }
    };

    const onError = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    const onEnd = () => {
      setIsListening(false);
    };

    const recognitionInstance = initializeSpeechRecognition(onResult, onError, onEnd);
    setRecognition(recognitionInstance);
  }, []);

  const handleStart = () => {
    startListening(recognition, setTranscript, setIsCorrect, setIsListening);
  };

  const handleStop = () => {
    stopListening(recognition, setIsListening);
  };

  return (
    <div className="speech-container">
      <div className="speech-card">
        <h1 className="speech-title">ระบบตรวจสอบการพูด</h1>
        
        {/* ส่วนที่ 1: ประโยคเป้าหมาย */}
        <div className="section-box target-section">
          <div className="section-header">
            <span className="section-number">1</span>
            <h2 className="section-title">ประโยคเป้าหมาย</h2>
          </div>
          <p className="target-phrase">{targetPhrase}</p>
        </div>

        {/* ปุ่มเริ่มพูด */}
        <div className="button-container">
          {!isListening ? (
            <button onClick={handleStart} className="speech-btn btn-start">
              🎤 เริ่มพูด
            </button>
          ) : (
            <button onClick={handleStop} className="speech-btn btn-stop">
              ⏹️ หยุดพูด
            </button>
          )}
        </div>

        {isListening && (
          <div className="listening-indicator">
            <div className="listening-badge">
              <span className="pulse-dot">🔴</span>
              <span className="listening-text">กำลังฟัง...</span>
            </div>
          </div>
        )}

        {/* ส่วนที่ 2: คำที่พูด */}
        <div className="section-box transcript-section">
          <div className="section-header">
            <span className="section-number">2</span>
            <h2 className="section-title">คำที่คุณพูด</h2>
          </div>
          {transcript ? (
            <p className="transcript-text">{transcript}</p>
          ) : (
            <p className="transcript-placeholder">รอการพูด...</p>
          )}
        </div>

        {/* ส่วนที่ 3: ผลการตรวจสอบ */}
        <div className="section-box result-section">
          <div className="section-header">
            <span className="section-number">3</span>
            <h2 className="section-title">ผลการตรวจสอบ</h2>
          </div>
          {isCorrect !== null ? (
            <div className={`result-content ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="result-icon">
                {isCorrect ? '✅' : '❌'}
              </div>
              <p className="result-text">
                {isCorrect ? 'ถูกต้อง!' : 'ไม่ถูกต้อง'}
              </p>
              {!isCorrect && (
                <p className="result-hint">กรุณาลองพูดใหม่อีกครั้ง</p>
              )}
            </div>
          ) : (
            <p className="result-placeholder">รอผลการตรวจสอบ...</p>
          )}
        </div>

        <div className="speech-footer">
          <p>💡 ใช้งานได้ดีที่สุดบน Chrome, Edge หรือ Safari</p>
        </div>
      </div>
    </div>
  );
}

export default Speech;