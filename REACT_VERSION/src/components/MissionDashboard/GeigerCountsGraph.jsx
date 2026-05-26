import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';

import AtomicInfoCard from './informationCards.jsx';
import './GeigerCountsGraph.css';

export default function GeigerCountsGraph({ missionData }) {
    const [activeChart, setActiveChart] = useState('line');

    if (!missionData || missionData.length === 0) return <div className="graph-container">No data available</div>;

    const chartData = missionData.map((record, index) => ({
        index: index,
        totalGeigerCounts: record.totalGeigerCounts,
        geigerCountsPerSecond: record.geigerCountsPerSecond,
        geigerDose: record.geigerDose,
        temperature: record.temperature,
        altitude: record.altitude,
        timestamp: record.logTimestamp
    }));

    const totalGeigerCounts = Math.max(...chartData.map(d => d.totalGeigerCounts)).toFixed(0);
    const averageActivity = (chartData.reduce((sum, d) => sum + d.geigerCountsPerSecond, 0) / chartData.length).toFixed(2);
    const maxActivity = Math.max(...chartData.map(d => d.geigerCountsPerSecond)).toFixed(2);
    const maxDose = Math.max(...chartData.map(d => d.geigerDose)).toFixed(4);

    return (
        <div className="graph-container">
            <div className="graph-header">
                <h2>Estatisticas Detetor Geiger:</h2>
                <div className="chart-type-selector">
                    <button className={`chart-btn ${activeChart === 'line' ? 'active' : ''}`} onClick={() => setActiveChart('line')}>Contagens/log</button>
                    <button className={`chart-btn ${activeChart === 'bar' ? 'active' : ''}`} onClick={() => setActiveChart('bar')}>Atividade vs Altura/tempo</button>
                    <button className={`chart-btn ${activeChart === 'combined' ? 'active' : ''}`} onClick={() => setActiveChart('combined')} >Dose vs Altura/tempo</button>
                </div>
            </div>

            {activeChart === 'line' && (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333333" />

                        <XAxis dataKey="index" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'ID Log', position: 'insideBottomRight', offset: -5, fill: '#9f9f9f' }} />
                        <YAxis yAxisId="left" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Total Contagens', angle: -90, position: 'insideLeft', fill: '#9f9f9f' }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Atividade (Bq)', angle: 90, position: 'insideRight', fill: '#9f9f9f' }} />

                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #e45c1d', borderRadius: '4px' }} labelStyle={{ color: '#f5f5f5' }} formatter={(value) => value.toFixed(2)} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />

                        <Line yAxisId="left" type="monotone" dataKey="totalGeigerCounts" stroke="#e45c1d" dot={false} strokeWidth={2} name="Total Contagens" />
                        <Line yAxisId="right" type="monotone" dataKey="geigerCountsPerSecond" stroke="#4a90e2" dot={false} strokeWidth={2} name="Atividade (Bq)" />
                    </LineChart>
                </ResponsiveContainer>
            )}

            {activeChart === 'bar' && (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333333" />

                        <XAxis dataKey="timestamp" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Instante (hh:mm:ss)', position: 'insideBottomRight', offset: -5, fill: '#9f9f9f' }} />
                        <YAxis yAxisId= "left" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Atividade (Bq)', angle: -90, position: 'insideLeft', fill: '#9f9f9f' }} />
		                <YAxis yAxisId= "right" orientation= "right" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Altitude (m)', angle: -90, position: 'insideRight', fill: '#9f9f9f' }} />

                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #e45c1d', borderRadius: '4px' }} labelStyle={{ color: '#f5f5f5' }} formatter={(value) => value.toFixed(2)} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />

                        <Line yAxisId="left" type="monotone" dataKey="geigerCountsPerSecond" stroke="#e45c1d" dot={false} strokeWidth={2} name="Atividade (Bq)" />
		                <Line yAxisId="right" type="monotone" dataKey="altitude" stroke="#4a90e2" dot={false} strokeWidth={2} name="Altitude (m)" />
                    </LineChart>
                </ResponsiveContainer>
            )}

            {activeChart === 'combined' && (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
		    	        <CartesianGrid strokeDasharray="3 3" stroke="#333333" />

                        <XAxis dataKey="timestamp" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Instante (hh:mm:ss)', position: 'insideBottomRight', offset: -5, fill: '#9f9f9f' }} />
                        <YAxis yAxisId= "left" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Dose (μSv)', angle: -90, position: 'insideLeft', fill: '#9f9f9f' }} />
		                <YAxis yAxisId= "right" orientation= "right" tick={{ fill: '#9f9f9f', fontSize: 12 }} label={{ value: 'Altitude (m)', angle: -90, position: 'insideRight', fill: '#9f9f9f' }} />

                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #e45c1d', borderRadius: '4px' }} labelStyle={{ color: '#f5f5f5' }} formatter={(value) => value.toFixed(2)} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />

                        <Line yAxisId="left" type="monotone" dataKey="geigerDose" stroke="#e45c1d" dot={false} strokeWidth={2} name="Dose (μSv)" />
		                <Line yAxisId="right" type="monotone" dataKey="altitude" stroke="#4a90e2" dot={false} strokeWidth={2} name="Altitude (m)" />
                    </LineChart>
                </ResponsiveContainer>
            )}

            <div className="graph-stats">
                <AtomicInfoCard cardTitle="Total Contagens" cardValue={totalGeigerCounts} />
                <AtomicInfoCard cardTitle="Atividade Média" cardValue={`${averageActivity} Bq (Becquerel)`} />
                <AtomicInfoCard cardTitle="Atividade Máxima" cardValue={`${maxActivity} Bq (Becquerel)`} />
                <AtomicInfoCard cardTitle="Dose Máxima" cardValue={`${maxDose} μSv (Micro Sieverts)`} />
            </div>
        </div>
    );
}