import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';
import { useState } from 'react';
import './GeigerCountsGraph.css';

export default function GeigerCountsGraph({ missionData }) {
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
    }));

    return (
        <div className="graph-container">
            <div className="graph-header">
                <h2>Geiger Counter Analysis</h2>
                <div className="chart-type-selector">
                    <button 
                        className={`chart-btn ${activeChart === 'line' ? 'active' : ''}`}
                        onClick={() => setActiveChart('line')}
                    >
                        📈 Line Chart
                    </button>
                    <button 
                        className={`chart-btn ${activeChart === 'bar' ? 'active' : ''}`}
                        onClick={() => setActiveChart('bar')}
                    >
                        📊 Bar Chart
                    </button>
                    <button 
                        className={`chart-btn ${activeChart === 'combined' ? 'active' : ''}`}
                        onClick={() => setActiveChart('combined')}
                    >
                        🔀 Combined View
                    </button>
                </div>
            </div>

            {activeChart === 'line' && (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                        <XAxis 
                            dataKey="index" 
                            tick={{ fill: '#9f9f9f', fontSize: 12 }}
                            label={{ value: 'Record Index', position: 'insideBottomRight', offset: -5, fill: '#9f9f9f' }}
                        />
                        <YAxis 
                            yAxisId="left"
                            tick={{ fill: '#9f9f9f', fontSize: 12 }}
                            label={{ value: 'Total Counts', angle: -90, position: 'insideLeft', fill: '#9f9f9f' }}
                        />
                        <YAxis 
                            yAxisId="right"
                            orientation="right"
                            tick={{ fill: '#9f9f9f', fontSize: 12 }}
                            label={{ value: 'Counts/Second', angle: 90, position: 'insideRight', fill: '#9f9f9f' }}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #e45c1d', borderRadius: '4px' }}
                            labelStyle={{ color: '#f5f5f5' }}
                            formatter={(value) => value.toFixed(2)}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="totalGeigerCounts" 
                            stroke="#e45c1d" 
                            dot={false}
                            strokeWidth={2}
                            name="Total Counts"
                        />
                        <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="geigerCountsPerSecond" 
                            stroke="#4a90e2" 
                            dot={false}
                            strokeWidth={2}
                            name="Counts/Second"
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}

            {activeChart === 'bar' && (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                        <XAxis 
                            dataKey="index"
                            tick={{ fill: '#9f9f9f', fontSize: 12 }}
                            label={{ value: 'Record Index', position: 'insideBottomRight', offset: -5, fill: '#9f9f9f' }}
                        />
                        <YAxis 
                            tick={{ fill: '#9f9f9f', fontSize: 12 }}
                            label={{ value: 'Geiger Counts', angle: -90, position: 'insideLeft', fill: '#9f9f9f' }}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #e45c1d', borderRadius: '4px' }}
                            labelStyle={{ color: '#f5f5f5' }}
                            formatter={(value) => value.toFixed(2)}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar 
                            dataKey="totalGeigerCounts" 
                            fill="#e45c1d"
                            name="Total Counts"
                        />
                        <Bar 
                            dataKey="geigerCountsPerSecond" 
                            fill="#4a90e2"
                            name="Counts/Second"
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}

            {activeChart === 'combined' && (
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                        <XAxis 
                            dataKey="index"
                            tick={{ fill: '#9f9f9f', fontSize: 12 }}
                            label={{ value: 'Record Index', position: 'insideBottomRight', offset: -5, fill: '#9f9f9f' }}
                        />
                        <YAxis 
                            yAxisId="left"
                            tick={{ fill: '#9f9f9f', fontSize: 12 }}
                            label={{ value: 'Total Counts', angle: -90, position: 'insideLeft', fill: '#9f9f9f' }}
                        />
                        <YAxis 
                            yAxisId="right"
                            orientation="right"
                            tick={{ fill: '#9f9f9f', fontSize: 12 }}
                            label={{ value: 'Dose (μSv)', angle: 90, position: 'insideRight', fill: '#9f9f9f' }}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #e45c1d', borderRadius: '4px' }}
                            labelStyle={{ color: '#f5f5f5' }}
                            formatter={(value) => value.toFixed(4)}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar 
                            yAxisId="left"
                            dataKey="totalGeigerCounts" 
                            fill="#e45c1d"
                            name="Total Counts"
                        />
                        <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="geigerDose" 
                            stroke="#ff7f50"
                            strokeWidth={2}
                            dot={false}
                            name="Radiation Dose"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            )}

            <div className="graph-stats">
                <div className="stat-box">
                    <h4>Peak Count</h4>
                    <p className="stat-value">{Math.max(...chartData.map(d => d.totalGeigerCounts)).toFixed(0)}</p>
                </div>
                <div className="stat-box">
                    <h4>Average Count</h4>
                    <p className="stat-value">{(chartData.reduce((sum, d) => sum + d.totalGeigerCounts, 0) / chartData.length).toFixed(2)}</p>
                </div>
                <div className="stat-box">
                    <h4>Peak Activity</h4>
                    <p className="stat-value">{Math.max(...chartData.map(d => d.geigerCountsPerSecond)).toFixed(2)} cps</p>
                </div>
                <div className="stat-box">
                    <h4>Max Dose</h4>
                    <p className="stat-value">{Math.max(...chartData.map(d => d.geigerDose)).toFixed(4)} μSv</p>
                </div>
            </div>
        </div>
    );
}
