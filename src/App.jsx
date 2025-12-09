import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Routine from './pages/Routine';
import Goals from './pages/Goals';

import PillarDetail from './pages/PillarDetail';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Routine />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/pillar/:type" element={<PillarDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
