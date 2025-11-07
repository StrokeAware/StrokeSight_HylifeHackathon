import './App.css';
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Speech from './pages/Speech';
import History from './pages/History';
import TimeForm from './pages/TimeForm';
import ArmDetection from './ArmDetection';
import FloatingActionButton from './FloatingActionButton';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/speech" element={<Speech />} />
        <Route path="/History" element={<History />} />
        <Route path="/time-form" element={<TimeForm />} />
        <Route path="/arm-detection" element={<ArmDetection />} />
      </Routes>
      <FloatingActionButton />
    </div>
  );
}

export default App;
