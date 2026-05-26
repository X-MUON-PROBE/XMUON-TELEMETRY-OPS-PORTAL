import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';
import { useState } from 'react';
import './GeigerCountsGraph.css';

export default function LiveMainStats({ missionData }) {
    const [activeChart, setActiveChart] = useState('line');

    if (!missionData || missionData.length === 0) {
        return <div className="graph-container">No data available</div>;
    }

    // Prepare data with index for x-axis
    const chartData = missionData.map((record, index) => ({
        index: index,
        totalGeigerCounts: record.totalGeigerCounts,
        geigerCountsPerSecond: record.geigerCountsPerSecond,
        geigerDose: record.geigerDose,
        temperature: record.temperature,
	altitude: record.altitude,
	timestamp: record.logTimestamp
    }));

    return (
        <div className="graph-stats">
        <div className="stat-box">
                <h4>Total Contagens</h4>
                <p className="stat-value">{Math.max(...chartData.map(d => d.totalGeigerCounts)).toFixed(0)}</p>
        </div>
        <div className="stat-box">
                <h4>Atividade Média</h4>
                <p className="stat-value">{(chartData.reduce((sum, d) => sum + d.geigerCountsPerSecond, 0) / chartData.length).toFixed(2)} Bq (Becquerel)</p>
        </div>
        <div className="stat-box">
                <h4>Atividade Máxima</h4>
                <p className="stat-value">{Math.max(...chartData.map(d => d.geigerCountsPerSecond)).toFixed(2)} Bq (Becquerel)</p>
        </div>
        <div className="stat-box">
                <h4>Dose Máxima</h4>
                <p className="stat-value">{Math.max(...chartData.map(d => d.geigerDose)).toFixed(4)} μSv (Micro Sieverts)</p>
        </div>
        </div>
    );
}
