import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';

import AtomicInfoCard from './informationCards.jsx';
import * as missionDashboardScript from '../../businessLogic/missionDataScript.js';
import './GeigerCountsGraph.css';

//####################################################################################################################################
//####################################################################################################################################

export default function LiveMainStats({ missionData }) {
    if (!missionData || missionData.length === 0) return <div className="graph-container">No data available</div>;

    const chartData = missionData.map((record, index) => ({
        index: index,
        totalGeigerCounts: record.totalGeigerCounts,
        geigerCountsPerSecond: record.geigerCountsPerSecond,
        geigerDose: record.geigerDose,
        temperature: record.temperature,
	    gyroChipTemp: record.gyroChipTemperature,
	    atmPressure: record.atmPressure,
	altitude: record.altitude,
        heading: record.headingFloat,
	timestamp: record.logTimestamp
    }));

    const [totalLogCount, setTotalLogCount] = useState(chartData.length);
    const [currentGeigerCounts, setTotalGeigerCounts] = useState(Math.max(...chartData.map(d => d.totalGeigerCounts)).toFixed(0));
    const [currentHeading, setCurrentHeading] = useState(missionDashboardScript.getCompassPoint16(chartData[chartData.length - 1].heading));
    const [averageActivity, setAverageActivity] = useState((chartData.reduce((sum, d) => sum + d.geigerCountsPerSecond, 0) / chartData.length).toFixed(2));
	const [currActivity, setCurrActivity] = useState((chartData[chartData.length - 1].geigerCountsPerSecond).toFixed(2));
    const [maxActivity, setMaxActivity] = useState(Math.max(...chartData.map(d => d.geigerCountsPerSecond)).toFixed(2));
    const [maxDose, setMaxDose] = useState(Math.max(...chartData.map(d => d.geigerDose)).toFixed(4));
const [currEnvTemp, setEnvTemp] = useState(chartData[chartData.length - 1].temperature.toFixed(2));
const [currATMPressure, setATMPressure] = useState(chartData[chartData.length - 1].atmPressure.toFixed(2));
const [currAltitude, setAltitude] = useState(chartData[chartData.length - 1].altitude.toFixed(2));
const [currGyroChipTemp, setGyroChipTemp] = useState(chartData[chartData.length - 1].gyroChipTemp.toFixed(2));

    return (
	    <>
	    <h2>Dados em tempo real:</h2>
        <div className="graph-stats">
                <AtomicInfoCard cardTitle="Direção Atual" cardValue={currentHeading} />
		<AtomicInfoCard cardTitle="Temperatura Ambiente" cardValue={`${currEnvTemp} ºC`} />
		<AtomicInfoCard cardTitle="Pressão Atmosférica" cardValue={`${currATMPressure} Pa`} />

	</div>
	<div className="graph-stats">
	    <AtomicInfoCard cardTitle="Altitude" cardValue={`${currAltitude} m`} />
	    <AtomicInfoCard cardTitle="Temperatura Chip Giroscópio" cardValue={`${currGyroChipTemp} ºC`} />
		<AtomicInfoCard cardTitle="Nº Registos" cardValue={totalLogCount} />
                <AtomicInfoCard cardTitle="Total Contagens" cardValue={currentGeigerCounts} />
		<AtomicInfoCard cardTitle="Atividade" cardValue={`${currActivity} Bq`} />
        </div>
	    <br/>
	    <br/>
	    </>
    );
}
