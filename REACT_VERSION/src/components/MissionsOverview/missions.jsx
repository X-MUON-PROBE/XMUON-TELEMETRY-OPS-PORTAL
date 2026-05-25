import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import * as missionsScript from '../../businessLogic/missions.js';
import MainPage from '../HomePage/homePage.jsx';
import '../../App.css';

export default function MissionsPage() {
	const [missionData, setMissionData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchMissions = async () => {
			try {
				const data = await missionsScript.loadMissionsListData();
				setMissionData(data);
				setLoading(false);
			} catch (err) {
				setError(err);
				setLoading(false);
			}
		};

		fetchMissions();
	}, []); // Empty dependency array means this runs only once on mount

	if (loading) {
		return <div class="missionsHero"><h1>Carregando...</h1></div>;
	}

	if (error) {
		return <div class="missionsHero"><h1>Erro ao carregar sessões: {error}</h1></div>;
	}

	return (
        <>
            <div class="missionsHero">
                <h1>SESSÕES DE MEDIÇÃO:</h1>
                <div class="missionsTableContainer">
                    <table class="missionsTable">
                        <thead style={{backgroundColor: "#27221a", position: "sticky", top: 0}}>
                            <tr>
                            <th>ID SESSÃO</th>
                            <th>NOME SESSÃO</th>
                            <th>DATA DE CRIAÇÃO (TIMESTAMP)</th>
                            <th>ABRIR SESSÃO</th>
                            </tr>
                        </thead>
                        <tbody id="sessionList">
                            {missionData.map((session, index) => (
                                <tr key={index}>
                                    <td style={{padding: "20px"}}>{session.missioN_ID}</td>
                                    <td style={{padding: "20px"}}>{session.missioN_NAME}</td>
                                    <td style={{padding: "20px"}}>{session.missioN_START_TIMESTAMP}</td>
                                    <td style={{padding: "0px !important"}}><Link to={`/XMUON-TELEMETRY-OPS-WEB-PORTAL/REACT_VERSION/dist/missionDashboard?missionID=${session.missioN_ID}`}><button class="openMissionButton" id={`openButton_${index}`}>ABRIR</button></Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}