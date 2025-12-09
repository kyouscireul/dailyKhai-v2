import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Routine from './pages/Routine';
import Finance from './pages/Finance';
import About from './pages/About';

import PillarDetail from './pages/PillarDetail';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Routine />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/about" element={<About />} />
        <Route path="/pillar/:type" element={<PillarDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
