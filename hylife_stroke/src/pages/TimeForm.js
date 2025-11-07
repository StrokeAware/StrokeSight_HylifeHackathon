import React, { useState } from 'react';
import './TimeForm.css';

function toHourMinute(decimal) {
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  return `${h} hr${h === 1 ? '' : 's'} ${m} min${m === 1 ? '' : 's'}`;
}

const TimeForm = () => {
  const [hoursInput, setHoursInput] = useState('');
  const [minutesInput, setMinutesInput] = useState('');
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const h = parseInt(hoursInput, 10);
    const m = parseInt(minutesInput, 10);
    if ((isNaN(h) && isNaN(m)) || (h < 0 || m < 0 || m > 59)) {
      setError('Please enter hours >= 0 and minutes between 0 and 59.');
      return;
    }
    const hourPart = isNaN(h) ? 0 : h;
    const minutePart = isNaN(m) ? 0 : m;
    const decimalTime = hourPart + minutePart / 60;
    if (decimalTime === 0) {
      setError('Please enter a time greater than zero.');
      return;
    }
    const newEntry = {
      id: Date.now(),
      hours: hourPart,
      minutes: minutePart,
      decimal: decimalTime,
      timestamp: new Date().toLocaleString(),
    };
    setEntries([newEntry]);  // Only one record at a time
    setHoursInput('');
    setMinutesInput('');
    setError('');
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const totalDecimal = entries.reduce((sum, entry) => sum + entry.decimal, 0);
  const averageDecimal = entries.length > 0 ? (totalDecimal / entries.length) : null;
  return (
    <div className="time-form-page">
      <div className="time-form-card">
        {showPopup && (
          <div className="time-popup-success">
            <span className="time-check-icon big-check">✔</span> Time submitted!
          </div>
        )}
        <h2>Time Reporting Form</h2>
        <p className="time-form-description">
          Record how many hours and minutes have passed since the event occurred. (e.g., 1 hr 30 min = 1.5 hours)
        </p>

        <form className="time-form" onSubmit={handleSubmit}>
          <label>Time elapsed</label>
          <div className="time-form-input-group">
            <input
              id="hoursInput"
              name="hours"
              type="number"
              step="1"
              min="0"
              placeholder="Hours"
              value={hoursInput}
              onChange={(event) => setHoursInput(event.target.value)}
            />
            <span style={{fontWeight:600, alignSelf:'center'}}>:</span>
            <input
              id="minutesInput"
              name="minutes"
              type="number"
              step="1"
              min="0"
              max="59"
              placeholder="Minutes"
              value={minutesInput}
              onChange={(event) => setMinutesInput(event.target.value)}
            />
            <button type="submit" className="time-form-submit">Submit</button>
          </div>
          {error && <p className="time-form-error">{error}</p>}
        </form>

        {entries.length > 0 && (
          <div className="time-form-summary">
            <h3>Summary</h3>
            <p><strong>Total records:</strong> {entries.length}</p>
            <p><strong>Total time recorded:</strong> {toHourMinute(totalDecimal)} ({totalDecimal.toFixed(2)} hours)</p>
          </div>
        )}
      </div>

      {/* <div className="time-form-history">
        <h3>Recent Entries</h3>
        {entries.length === 0 ? (
          <p className="time-form-empty">No entries yet.</p>
        ) : (
          <ul>
            {entries.map((entry) => (
              <li key={entry.id}>
                <span className="time-form-hours">{entry.hours} hr {entry.minutes} min</span>
                <span className="time-form-hours">({entry.decimal.toFixed(2)} hours)</span>
                <span className="time-form-timestamp">Recorded on {entry.timestamp}</span>
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
  );
};

export default TimeForm;
