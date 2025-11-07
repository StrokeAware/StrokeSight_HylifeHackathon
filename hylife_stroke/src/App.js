import './App.css';
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import ArmDetection from './ArmDetection';
import FloatingActionButton from './FloatingActionButton';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/arm-detection" element={<ArmDetection />} />
      </Routes>
      <FloatingActionButton />
    </div>
  );
}

export default App;
