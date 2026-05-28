import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';

import AtomicInfoCard from './informationCards.jsx';
import './GeigerCountsGraph.css';

//####################################################################################################################################
//####################################################################################################################################

export default function AtmosphericConditionsGraph({ missionStats }) {
    const [activeChart, setActiveChart] = useState('line');

    const [missionData, setMissionData] = useState( missionStats != null ? missionStats.missionMeasurementRecords : []);
    const [tempPressOverAltitudeDistribution, setTempPressOverAltitudeDistribution] = useState( missionStats != null ? missionStats.tempAndATMPressureDistribution : []);
    const [numericAtmStats, setNumericAtmStats] = useState( missionStats != null ? missionStats.numericAtmStats : {});

    if (!missionData || missionData.length === 0) return <div className="graph-container">No data available</div>;

    const chartData = missionData.map((record, index) => ({
        index: index,
        totalGeigerCounts: record.totalGeigerCounts,
        geigerCountsPerSecond: record.geigerCountsPerSecond,
        geigerDose: record.geigerDose,
        temperature: record.temperature,
        atmPressure: record.atmPressure,
        altitude: record.altitude,
        timestamp: record.logTimestamp
    }));

    const distData = tempPressOverAltitudeDistribution.map((record, index) => ({
        index: index,
        temperature: record.temperature,
        atmPressure: record.atmPressure,
        altitude: record.altitude
    }));

    const [maxAltitude, setMaxAltitude] = useState(0);
    const [maxPressure, setMaxPressure] = useState(0);
    const [maxTemperature, setMaxTemperature] = useState(0);
    const [minPressure, setMinPressure] = useState(0);
    const [minTemperature, setMinTemperature] = useState(0);

    useEffect(() => {
        if (missionStats) {
            setMaxAltitude(missionStats.numericAtmStats.maX_ALTITUDE.toFixed(2));
            setMaxPressure((missionStats.numericAtmStats.maX_PRESSURE / 100).toFixed(2));
            setMaxTemperature(missionStats.numericAtmStats.maX_TEMPERATURE.toFixed(2));
            setMinPressure((missionStats.numericAtmStats.miN_PRESSURE / 100).toFixed(2));
            setMinTemperature(missionStats.numericAtmStats.miN_TEMPERATURE.toFixed(2));
        }
    }, [missionStats]);

    return (
        <div className="graph-container">
            <div className="graph-header">
                <h2>Estatisticas Condições Atmosféricas:</h2>
                <div className="chart-type-selector">
                    <button className={`chart-btn ${activeChart === 'line' ? 'active' : ''}`} onClick={() => setActiveChart('line')}>Temperatura & Pressão Atmosférica/log</button>
                    <button className={`chart-btn ${activeChart === 'bar' ? 'active' : ''}`} onClick={() => setActiveChart('bar')}>Temperatura & Pressão Atmosférica/tempo</button>
                    <button className={`chart-btn ${activeChart === 'combined' ? 'active' : ''}`} onClick={() => setActiveChart('combined')} >Temperatura & Pressão Atmosférica/Altitude</button>
                </div>
            </div>

            {activeChart === 'line' && (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333333" />

                        <XAxis dataKey="index" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'ID Log', position: 'insideBottomRight', offset: -5, fill: '#9f9f9f' }} />
                        <YAxis yAxisId="left" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Temperatura (ºC)', angle: -90, position: 'insideLeft', fill: '#9f9f9f' }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Pressão Atmosférica (hPa)', angle: 90, position: 'insideRight', fill: '#9f9f9f' }} />

                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #e45c1d', borderRadius: '4px' }} labelStyle={{ color: '#f5f5f5' }} formatter={(value) => value.toFixed(2)} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />

                        <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#e45c1d" dot={false} strokeWidth={2} name="Temperatura (ºC)" />
                        <Line yAxisId="right" type="monotone" dataKey="atmPressure" stroke="#4a90e2" dot={false} strokeWidth={2} name="Pressão Atmosférica (hPa)" />
                    </LineChart>
                </ResponsiveContainer>
            )}

            {activeChart === 'bar' && (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333333" />

                        <XAxis dataKey="timestamp" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Instante (hh:mm:ss)', position: 'insideBottomRight', offset: -5, fill: '#9f9f9f' }} />
                        <YAxis yAxisId= "left" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Temperatura (ºC)', angle: -90, position: 'insideLeft', fill: '#9f9f9f' }} />
                        <YAxis yAxisId= "right" orientation= "right" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Pressão Atmosférica (hPa)', angle: -90, position: 'insideRight', fill: '#9f9f9f' }} />

                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #e45c1d', borderRadius: '4px' }} labelStyle={{ color: '#f5f5f5' }} formatter={(value) => value.toFixed(2)} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />

                        <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#e45c1d" dot={false} strokeWidth={2} name="Temperatura (ºC)" />
                        <Line yAxisId="right" type="monotone" dataKey="atmPressure" stroke="#4a90e2" dot={false} strokeWidth={2} name="Pressão Atmosférica (hPa)" />
                    </LineChart>
                </ResponsiveContainer>
            )}

            {activeChart === 'combined' && (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={distData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333333" />

                        <XAxis dataKey="altitude" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Altitude (m)', position: 'insideBottomRight', offset: -5, fill: '#9f9f9f' }} />
                        <YAxis yAxisId= "left" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Temperatura (ºC)', angle: -90, position: 'insideLeft', fill: '#9f9f9f' }} />
                        <YAxis yAxisId= "right" orientation= "right" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Pressão Atmosférica (hPa)', angle: -90, position: 'insideRight', fill: '#9f9f9f' }} />

                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #e45c1d', borderRadius: '4px' }} labelStyle={{ color: '#f5f5f5' }} formatter={(value) => value.toFixed(2)} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />

                        <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#e45c1d" dot={false} strokeWidth={2} name="Temperatura (ºC)" />
                        <Line yAxisId="right" type="monotone" dataKey="atmPressure" stroke="#4a90e2" dot={false} strokeWidth={2} name="Pressão Atmosférica (hPa)" />
                    </LineChart>
                </ResponsiveContainer>
            )}

            <div className="graph-stats">
                <AtomicInfoCard cardTitle="Altitude Máxima" cardValue={`${maxAltitude} m`} />
                <AtomicInfoCard cardTitle="Temperatura Máxima" cardValue={`${maxTemperature} ºC`} />
                <AtomicInfoCard cardTitle="Temperatura Mínima" cardValue={`${minTemperature} ºC`} />
                <AtomicInfoCard cardTitle="Pressão Máxima" cardValue={`${maxPressure} hPa`} />
                <AtomicInfoCard cardTitle="Pressão Mínima" cardValue={`${minPressure} hPa`} />
            </div>
        </div>
    );
}