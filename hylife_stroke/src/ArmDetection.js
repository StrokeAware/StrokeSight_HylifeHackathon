import React, { useEffect, useRef, useState } from 'react';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import './ArmDetection.css';

const VISIBILITY_THRESHOLD = 0.4;
const DETECTION_DURATION_SECONDS = 15;
const POSITIVE_RANGE = { min: 168, max: 180 };
const NEGATIVE_RANGE = { min: -180, max: -168 };
const LEFT_ARM_INDICES = [11, 13, 15];
const RIGHT_ARM_INDICES = [12, 14, 16];

const DEFAULT_DETECTION_STATE = {
  detected: false,
  arms: [],
  activeArm: null,
  angle: null,
  withinTolerance: false,
};

const formatArmLabel = (arm) => (arm === 'left' ? 'Left arm' : 'Right arm');

const formatArmsLabel = (arms) => {
  if (!arms || arms.length === 0) return 'None';
  return arms.map(formatArmLabel).join(' + ');
};

const areLandmarksVisible = (landmarks, indices) => {
  if (!landmarks) return false;
  return indices.every((index) => {
    const point = landmarks[index];
    if (!point) return false;
    if (typeof point.visibility !== 'number') return true;
    return point.visibility >= VISIBILITY_THRESHOLD;
  });
};

const drawArmSegments = (ctx, landmarks, indices, color) => {
  const [shoulderIdx, elbowIdx, wristIdx] = indices;
  const shoulder = landmarks?.[shoulderIdx];
  const elbow = landmarks?.[elbowIdx];
  const wrist = landmarks?.[wristIdx];
  if (!shoulder || !elbow || !wrist) return;

  const { width, height } = ctx.canvas;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.moveTo(shoulder.x * width, shoulder.y * height);
  ctx.lineTo(elbow.x * width, elbow.y * height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(elbow.x * width, elbow.y * height);
  ctx.lineTo(wrist.x * width, wrist.y * height);
  ctx.stroke();
};

const isWithinRange = (angle) => {
  const withinPositive = angle >= POSITIVE_RANGE.min && angle <= POSITIVE_RANGE.max;
  const withinNegative = angle >= NEGATIVE_RANGE.min && angle <= NEGATIVE_RANGE.max;
  return withinPositive || withinNegative;
};

const computeArmData = (landmarks, indices) => {
  if (!areLandmarksVisible(landmarks, indices)) return null;

  const [shoulderIdx, elbowIdx, wristIdx] = indices;
  const shoulder = landmarks[shoulderIdx];
  const elbow = landmarks[elbowIdx];
  const wrist = landmarks[wristIdx];
  if (!shoulder || !elbow || !wrist) return null;

  const angleRadians = Math.atan2(wrist.y - shoulder.y, wrist.x - shoulder.x);
  const angleDegrees = angleRadians * (180 / Math.PI);
  const withinTolerance = isWithinRange(angleDegrees);

  const visibilityValues = [
    shoulder.visibility ?? 1,
    elbow.visibility ?? 1,
    wrist.visibility ?? 1,
  ];
  const visibility = visibilityValues.reduce((sum, value) => sum + value, 0) / visibilityValues.length;

  return {
    angle: angleDegrees,
    withinTolerance,
    visibility,
  };
};

const selectArm = (leftData, rightData) => {
  if (leftData && rightData) {
    if (leftData.withinTolerance !== rightData.withinTolerance) {
      return leftData.withinTolerance
        ? { name: 'left', data: leftData }
        : { name: 'right', data: rightData };
    }
    return leftData.visibility >= rightData.visibility
      ? { name: 'left', data: leftData }
      : { name: 'right', data: rightData };
  }
  if (leftData) return { name: 'left', data: leftData };
  if (rightData) return { name: 'right', data: rightData };
  return null;
};

const ArmDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const poseRef = useRef(null);
  const isDetectingRef = useRef(false);

  const [isDetecting, setIsDetecting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(DETECTION_DURATION_SECONDS);
  const [result, setResult] = useState(null);
  const [currentDetection, setCurrentDetection] = useState(DEFAULT_DETECTION_STATE);

  const presenceRef = useRef({ detected: false, arms: [] });
  const [presence, setPresence] = useState({ detected: false, arms: [] });

  const statsRef = useRef({
    frames: 0,
    detectedFrames: 0,
    withinToleranceFrames: 0,
    leftFrames: 0,
    rightFrames: 0,
    angleSum: 0,
    angleCount: 0,
  });

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.save();
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(results.image, 0, 0, ctx.canvas.width, ctx.canvas.height);

      const landmarks = results.poseLandmarks;

      if (landmarks) {
        drawConnectors(ctx, landmarks, POSE_CONNECTIONS, { color: '#2ecc71', lineWidth: 1 });
        drawLandmarks(ctx, landmarks, { color: '#ff6b6b', radius: 3, lineWidth: 0 });

        const leftArm = computeArmData(landmarks, LEFT_ARM_INDICES);
        const rightArm = computeArmData(landmarks, RIGHT_ARM_INDICES);

        if (leftArm) drawArmSegments(ctx, landmarks, LEFT_ARM_INDICES, '#3498db');
        if (rightArm) drawArmSegments(ctx, landmarks, RIGHT_ARM_INDICES, '#3498db');

        const detectedArms = [];
        if (leftArm) detectedArms.push('left');
        if (rightArm) detectedArms.push('right');

        const selectedArm = selectArm(leftArm, rightArm);
        const detected = !!selectedArm;

        if (
          presenceRef.current.detected !== (detectedArms.length > 0) ||
          presenceRef.current.arms.join('-') !== detectedArms.join('-')
        ) {
          presenceRef.current = { detected: detectedArms.length > 0, arms: detectedArms };
          setPresence({ detected: detectedArms.length > 0, arms: detectedArms });
        }

        if (isDetectingRef.current && selectedArm) {
          statsRef.current.frames += 1;
          statsRef.current.detectedFrames += 1;
          if (selectedArm.name === 'left') statsRef.current.leftFrames += 1;
          if (selectedArm.name === 'right') statsRef.current.rightFrames += 1;
          if (selectedArm.data.withinTolerance) statsRef.current.withinToleranceFrames += 1;
          statsRef.current.angleSum += selectedArm.data.angle;
          statsRef.current.angleCount += 1;
        }

        setCurrentDetection({
          detected,
          arms: detectedArms,
          activeArm: selectedArm ? selectedArm.name : null,
          angle: selectedArm ? selectedArm.data.angle : null,
          withinTolerance: selectedArm ? selectedArm.data.withinTolerance : false,
        });
      } else {
        if (presenceRef.current.detected) {
          presenceRef.current = { detected: false, arms: [] };
          setPresence({ detected: false, arms: [] });
        }
        setCurrentDetection(DEFAULT_DETECTION_STATE);
        if (isDetectingRef.current) {
          statsRef.current.frames += 1;
        }
      }

      ctx.restore();
    });

    poseRef.current = pose;

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await pose.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    cameraRef.current = camera;
    camera.start();

    return () => {
      cameraRef.current?.stop();
      poseRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!isDetecting) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          isDetectingRef.current = false;
          setIsDetecting(false);
          finalizeDetection();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isDetecting]);

  const finalizeDetection = () => {
    const {
      frames,
      detectedFrames,
      withinToleranceFrames,
      leftFrames,
      rightFrames,
      angleSum,
      angleCount,
    } = statsRef.current;

    if (frames === 0 || detectedFrames === 0) {
      setResult({
        success: false,
        message:
          frames === 0
            ? 'No camera frames captured during the detection window.'
            : 'No arm was visible during the 15-second period.',
      });
      return;
    }

    const detectionPercent = (detectedFrames / frames) * 100;
    const withinPercent = withinToleranceFrames > 0
      ? (withinToleranceFrames / detectedFrames) * 100
      : 0;
    const averageAngle = angleCount > 0 ? angleSum / angleCount : null;

    let dominantArm = null;
    if (leftFrames === rightFrames && leftFrames > 0) {
      dominantArm = 'Both arms';
    } else if (leftFrames > rightFrames) {
      dominantArm = 'Left arm';
    } else if (rightFrames > leftFrames) {
      dominantArm = 'Right arm';
    }

    const success = withinPercent >= 50;

    setResult({
      success,
      message: success
        ? `Arm stayed within the target range (168°-180° or -180° to -168°) for ${withinPercent.toFixed(1)}% of detected frames.`
        : `Arm was within the target range only ${withinPercent.toFixed(1)}% of the time.`,
      detectionPercent: detectionPercent.toFixed(1),
      withinPercent: withinPercent.toFixed(1),
      totalFrames: frames,
      detectedFrames,
      withinToleranceFrames,
      averageAngle: averageAngle !== null ? averageAngle.toFixed(2) : null,
      dominantArm,
      armsDetected: [
        leftFrames > 0 ? 'Left arm' : null,
        rightFrames > 0 ? 'Right arm' : null,
      ].filter(Boolean),
      statusLabel: success ? 'Normal' : 'Not Normal',
    });
  };

  const startDetection = () => {
    statsRef.current = {
      frames: 0,
      detectedFrames: 0,
      withinToleranceFrames: 0,
      leftFrames: 0,
      rightFrames: 0,
      angleSum: 0,
      angleCount: 0,
    };
    setResult(null);
    setTimeRemaining(DETECTION_DURATION_SECONDS);
    setCurrentDetection(DEFAULT_DETECTION_STATE);
    isDetectingRef.current = true;
    setIsDetecting(true);
  };

  const stopDetection = () => {
    isDetectingRef.current = false;
    setIsDetecting(false);
    setTimeRemaining(DETECTION_DURATION_SECONDS);
    finalizeDetection();
  };

  const resetDetection = () => {
    isDetectingRef.current = false;
    setIsDetecting(false);
    setTimeRemaining(DETECTION_DURATION_SECONDS);
    setResult(null);
    statsRef.current = {
      frames: 0,
      detectedFrames: 0,
      withinToleranceFrames: 0,
      leftFrames: 0,
      rightFrames: 0,
      angleSum: 0,
      angleCount: 0,
    };
    setCurrentDetection(DEFAULT_DETECTION_STATE);
  };

  return (
    <div className="arm-detection-container">
      <div className="arm-detection-header">
        <h2>Arm Alignment Detection</h2>
        <p>
          Hold your arm close to horizontal but reversed (angle 168°-180° or -180° to -168°)
          for {DETECTION_DURATION_SECONDS} seconds.
        </p>
      </div>

      <div className="camera-section">
        <div className="video-container">
          <video
            ref={videoRef}
            className="video-element"
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="canvas-overlay"
            width={640}
            height={480}
          />
        </div>

        <div className="detection-controls">
          {!isDetecting && !result && (
            <button className="btn-start" onClick={startDetection}>
              Start Detection ({DETECTION_DURATION_SECONDS} seconds)
            </button>
          )}

          {isDetecting && (
            <div className="detection-status">
              <div className="timer">
                <span className="timer-label">Time Remaining:</span>
                <span className="timer-value">{timeRemaining}s</span>
              </div>
              <button className="btn-stop" onClick={stopDetection}>
                Stop Early
              </button>
            </div>
          )}

          {result && (
            <div className="result-section">
              <button className="btn-reset" onClick={resetDetection}>
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="status-section">
        <div className="live-status presence-status">
          <div className="status-item">
            <span className="status-label">Arm Detection:</span>
            <span className={`status-value ${presence.detected ? 'parallel' : 'not-parallel'}`}>
              {presence.detected
                ? `Detected (${formatArmsLabel(presence.arms)})`
                : 'No arm detected'}
            </span>
          </div>
        </div>

        <div className="live-status">
          <div className="status-item">
            <span className="status-label">Active Arm:</span>
            <span className="status-value">
              {currentDetection.activeArm ? currentDetection.activeArm.toUpperCase() : 'None'}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Current Angle:</span>
            <span className="status-value">
              {currentDetection.angle !== null ? `${currentDetection.angle.toFixed(2)}°` : 'N/A'}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Within target range (168°-180° or -180° to -168°):</span>
            <span className={`status-value ${currentDetection.withinTolerance ? 'parallel' : 'not-parallel'}`}>
              {currentDetection.withinTolerance ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Arms visible now:</span>
            <span className="status-value">{formatArmsLabel(currentDetection.arms)}</span>
          </div>
          {isDetecting && (
            <div className="status-item">
              <span className="status-label">Frames processed:</span>
              <span className="status-value">{statsRef.current.frames}</span>
            </div>
          )}
        </div>

        {result && (
          <div className={`result-box ${result.success ? 'success' : 'failure'}`}>
            <h3>Detection Result</h3>
            {result.statusLabel && (
              <div className={`result-status ${result.success ? 'normal' : 'not-normal'}`}>
                {result.statusLabel}
              </div>
            )}
            <p className="result-message">{result.message}</p>
            <div className="result-details">
              <p><strong>Total frames:</strong> {result.totalFrames}</p>
              <p><strong>Frames with arm visible:</strong> {result.detectedFrames}</p>
              <p><strong>Within target range:</strong> {result.withinToleranceFrames} frames ({result.withinPercent}%)</p>
              <p><strong>Arm visibility:</strong> {result.detectionPercent}% of all frames</p>
              {result.averageAngle !== null && (
                <p><strong>Average angle:</strong> {result.averageAngle}°</p>
              )}
              {result.dominantArm && (
                <p><strong>Dominant arm:</strong> {result.dominantArm}</p>
              )}
              {result.armsDetected && result.armsDetected.length > 0 && (
                <p><strong>Arms seen:</strong> {result.armsDetected.join(', ')}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArmDetection;

