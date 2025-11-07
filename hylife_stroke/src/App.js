import './App.css';
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Speech from './pages/Speech';
import History from './pages/History';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/speech" element={<Speech />} />
        <Route path="/History" element={<History />} />
      </Routes>
    </div>
  );
}

export default App;
