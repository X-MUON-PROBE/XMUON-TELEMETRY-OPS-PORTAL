import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';

import AtomicInfoCard from './informationCards.jsx';
import * as missionDashboardScript from '../../businessLogic/missionDataScript.js';
import './GeigerCountsGraph.css';

//####################################################################################################################################
//####################################################################################################################################

export default function LiveMainStats({ missionData }) {
    const [totalLogCount, setTotalLogCount] = useState(0);
    const [currentGeigerCounts, setTotalGeigerCounts] = useState(0);
    const [currentHeading, setCurrentHeading] = useState('');
    const [averageActivity, setAverageActivity] = useState(0);
    const [currActivity, setCurrActivity] = useState(0);
    const [maxActivity, setMaxActivity] = useState(0);
    const [maxDose, setMaxDose] = useState(0);
    const [currEnvTemp, setEnvTemp] = useState(0);
    const [currATMPressure, setATMPressure] = useState(0);
    const [currAirDensity, setAirDensity] = useState(0);
    const [currAltitude, setAltitude] = useState(0);
    const [currGyroChipTemp, setGyroChipTemp] = useState(0);

    useEffect(() => {
        if (!missionData || missionData.length === 0) return <div className="graph-container">No data available</div>;

        const chartData = missionData.map((record, index) => ({
            index: index,
            totalGeigerCounts: record.totalGeigerCounts,
            geigerCountsPerSecond: record.geigerCountsPerSecond,
            geigerDose: record.geigerDose,
            temperature: record.temperature,
            gyroChipTemp: record.gyroChipTemperature,
            atmPressure: record.atmPressure,
            airDensity: record.airDensity,
            altitude: record.altitude,
            heading: record.headingFloat,
            timestamp: record.logTimestamp
        }));

        setTotalLogCount(chartData.length);
        setTotalGeigerCounts(Math.max(...chartData.map(d => d.totalGeigerCounts)).toFixed(0));
        setCurrentHeading(missionDashboardScript.getCompassPoint16(chartData[chartData.length - 1].heading));
        setAverageActivity((chartData.reduce((sum, d) => sum + d.geigerCountsPerSecond, 0) / chartData.length).toFixed(2));
        setCurrActivity((chartData[chartData.length - 1].geigerCountsPerSecond).toFixed(2));
        setMaxActivity(Math.max(...chartData.map(d => d.geigerCountsPerSecond)).toFixed(2));
        setMaxDose(Math.max(...chartData.map(d => d.geigerDose)).toFixed(4));
        setEnvTemp(chartData[chartData.length - 1].temperature.toFixed(2));
        setATMPressure(chartData[chartData.length - 1].atmPressure.toFixed(2));
        setAltitude(chartData[chartData.length - 1].altitude.toFixed(2));
        setGyroChipTemp(chartData[chartData.length - 1].gyroChipTemp.toFixed(2));
        setAirDensity(chartData[chartData.length - 1].airDensity.toFixed(2));
    }, [missionData]);

    return (
        <>
            <h2>Dados em tempo real:</h2>
            <div className="graph-stats">
                <AtomicInfoCard cardTitle="Direção Atual" cardValue={currentHeading} />
                <AtomicInfoCard cardTitle="Temperatura Ambiente" cardValue={`${currEnvTemp} ºC`} />
                <AtomicInfoCard cardTitle="Pressão Atmosférica" cardValue={`${(currATMPressure / 100).toFixed(2)} hPa`} />
                <AtomicInfoCard cardTitle="Densidade do Ar" cardValue={`${currAirDensity} kg/m³`} />
            </div>
            <div className="graph-stats">
                <AtomicInfoCard cardTitle="Altitude" cardValue={`${currAltitude} m`} />
                <AtomicInfoCard cardTitle="Temperatura Chip Giroscópio" cardValue={`${currGyroChipTemp} ºC`} />
                <AtomicInfoCard cardTitle="Nº Registos" cardValue={totalLogCount} />
                <AtomicInfoCard cardTitle="Total Contagens" cardValue={currentGeigerCounts} />
                <AtomicInfoCard cardTitle="Atividade" cardValue={`${currActivity} Bq`} />
            </div>
            <br />
            <br />
        </>
    );
}