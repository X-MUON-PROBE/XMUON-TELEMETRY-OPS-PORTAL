import { useState } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MainPage from './components/HomePage/homePage.jsx';
import MissionsPage from './components/MissionsOverview/missions.jsx';
import MissionDashboard from './components/MissionDashboard/missionDashboard.jsx';
import './App.css';

//####################################################################################################################################
//####################################################################################################################################

export default function App() {
  return (
    <BrowserRouter>
      <div class="pageContent">
        <title>XMUON PROBE - Dashboard</title>
        <div class="leftSidebar">
          <div class="logo">
              <div class="logo-icon"></div>
              <h1>XMUON PROBE</h1>
          </div>
          <div class="nav-link-section">
              {/*<Link class="nav-link active" to="/XMUON-TELEMETRY-OPS-WEB-PORTAL/REACT_VERSION/dist/"><i class="fa-solid fa-house fa-lg"></i> Página Inicial</Link>*/}
              <Link class="nav-link active" to="/XMUON-TELEMETRY-OPS-WEB-PORTAL/REACT_VERSION/dist/missions"><i class="fa-solid fa-satellite fa-lg"></i> Missões</Link>
              {/*<Link class="nav-link" to="/XMUON-TELEMETRY-OPS-WEB-PORTAL/REACT_VERSION/dist/about"><i class="fa-solid fa-circle-info fa-lg"></i> Sobre</Link>*/}
          </div>
        </div>

        <div class="mainContent">
          <Routes>
            <Route path="/XMUON-TELEMETRY-OPS-WEB-PORTAL/REACT_VERSION/dist/" element={<MissionsPage />} />
            <Route path="/XMUON-TELEMETRY-OPS-WEB-PORTAL/REACT_VERSION/dist/missions" element={<MissionsPage />} />
            <Route path="/XMUON-TELEMETRY-OPS-WEB-PORTAL/REACT_VERSION/dist/about" element={<MissionsPage />} />
            <Route path="/XMUON-TELEMETRY-OPS-WEB-PORTAL/REACT_VERSION/dist/missionDashboard" element={<MissionDashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}