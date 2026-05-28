import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';
import { useState } from 'react';
import './informationCards.css';

//####################################################################################################################################
//####################################################################################################################################

export default function AtomicInfoCard(props)
{
    const cardTitle = props.cardTitle;
    const cardValue = props.cardValue;

    return (
        <div className="stat-box">
                <h4>{cardTitle}</h4>
                <p className="stat-value">{cardValue}</p>
        </div>
    );
}