import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import * as missionDashboardScript from '../../businessLogic/missionDataScript.js';
import MainPage from '../HomePage/homePage.jsx';
import GeigerCountsGraph from './GeigerCountsGraph';
import LiveMainStats from './LiveMainStats'
import '../../App.css';

library.add(fas, far, fab);

//####################################################################################################################################
//####################################################################################################################################

function LogRow(props) {
    const { record, index } = props;
    return (
        <>
            <tr>
                <td style={{ padding: '20px' }}>{index}</td>
                <td style={{ padding: '20px' }}>{record.totalGeigerCounts}</td>
                <td style={{ padding: '20px' }}>{record.geigerCountsPerSecond}</td>
                <td style={{ padding: '20px' }}>{record.geigerDose}</td>
                <td style={{ padding: '20px' }}>{record.temperature}</td>
                <td style={{ padding: '20px' }}>{record.atmPressure}</td>
                <td style={{ padding: '20px' }}>{record.altitude}</td>
                <td style={{ padding: '20px' }}>({record.accelVector.ax}, {record.accelVector.ay}, {record.accelVector.az})</td>
                <td style={{ padding: '20px' }}>({record.gyroVector.gx}, {record.gyroVector.gy}, {record.gyroVector.gz})</td>
                <td style={{ padding: '20px' }}>({record.magneticFieldVector.mx}, {record.magneticFieldVector.my}, {record.magneticFieldVector.mz})</td>
                <td style={{ padding: '20px' }}>{record.headingFloat}</td>
                <td style={{ padding: '20px' }}>{record.gyroChipTemperature}</td>
            </tr>
        </>
    );
}

function LogGroup(props) {
    console.log("sdlkgfasdkfnsadklfnaskdfnaskljdfnlasjkdfnlkasjdnflkasdnfkljn");
    console.log(props._missionDashboardData);
    let max = 201;
    if(props._missionDashboardData.length < 201){
        max = props._missionDashboardData.length;
    }
    return (
        <>
            {props._missionDashboardData.slice(0, max).map((record, index) => (
                <LogRow record={record} index={index} />
            ))}
        </>
    );
}

export default function MissionDashboard() {
    const [missionDashboardData, setMissionDashboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const urlParams = new URLSearchParams(window.location.search);
    const missionID = urlParams.get('missionID');

    useEffect(() => {
        const fetchMissionData = async () => {
            try {
                const data = await missionDashboardScript.loadMissionData(Number(missionID));
                setMissionDashboardData(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchMissionData();
    }, []);

	if (error) {
		return <div class="missionsHero"><h1>Erro ao carregar sessões: {error}</h1></div>;
	}

    return (
        <div class="missionsHero">
          <h1 id="missionNameH1">
            {loading ? (
                '...'
            ) : missionDashboardData.missionData.missioN_NAME}
          </h1>
          {!loading && (
            <GeigerCountsGraph missionData={missionDashboardData.missionMeasurementRecords} />
		  <LiveMainStats missionData={missionDashboardData.missionMeasurementRecords} />
          )}
          <div id="missionsTable" class="missionsTableContainer">
            <table class="missionsTable">
              <thead style={{ backgroundColor: '#4a2012ee', position: 'sticky', top: 0 }}>
                <tr>
                  <th>ID REGISTO</th>
                  <th>TOTAL CONTAGENS GEIGER (counts)</th>
                  <th>ATIVIDADE (counts/min)</th>
                  <th>DOSE RADIAÇÃO MUÓNICA (μSv)</th>
                  <th>TEMPERATURA AMBIENTE (ºC)</th>
                  <th>PRESSÃO ATMOSFÉRICA (Pa)</th>
                  <th>ALTITUDE (m)</th>
                  <th>ACELERAÇÃO (m/s^2)</th>
                  <th>VELOCIDADE ANGULAR (ROTAÇÃO - º/sec)</th>
                  <th>CAMPO MAGNÉTICO (μT)</th>
                  <th>ORIENTAÇÃO GEOGRÁFICA</th>
                  <th>TEMPERATURA GIROSCÓPIO (ºc)</th>
                </tr>
              </thead>
              <tbody id="sessionList">
                {loading ? (
                  <tr>
                    <td colSpan="12" style={{ padding: '200px', textAlign: 'center' }}>
                        <FontAwesomeIcon icon="fa-solid fa-hourglass" spinPulse size="5x" style={{ color: '#d6b081' }} />
                    </td>
                  </tr>
                ) : (
                  <LogGroup _missionDashboardData={ missionDashboardData.missionMeasurementRecords } />
                )}
              </tbody>
            </table>
          </div>
        </div>
    );
}
