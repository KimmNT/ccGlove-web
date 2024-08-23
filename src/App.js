import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import NotFoundPage from './components/NotFoundPage';
import AboutPage from './components/AboutPage';

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} /> {/* Fallback route for 404 */}
    </Routes>
  </Router>
  );
}

export default App;
