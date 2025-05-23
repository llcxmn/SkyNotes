import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import LanggananPage from "./pages/langganan-page";
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/pricing' element={<LanggananPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
