import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export default function RevenueChart({ data }) {
    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--spacing-sm)',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <p style={{ margin: 0, marginBottom: '4px', fontWeight: 600 }}>
                        {payload[0].payload.date}
                    </p>
                    <p style={{ margin: 0, color: 'var(--color-primary-light)' }}>
                        Pendapatan: {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                    dataKey="date"
                    stroke="var(--color-text-secondary)"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="var(--color-text-secondary)"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => {
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                        return value;
                    }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    wrapperStyle={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}
                />
                <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Pendapatan"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
