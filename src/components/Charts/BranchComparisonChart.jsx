import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export default function BranchComparisonChart({ data }) {
    const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

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
                        {payload[0].payload.branch}
                    </p>
                    <p style={{ margin: 0, color: 'var(--color-primary-light)' }}>
                        Pendapatan: {formatCurrency(payload[0].value)}
                    </p>
                    <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '12px', marginTop: '4px' }}>
                        Booking: {payload[0].payload.bookings}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                    dataKey="branch"
                    stroke="var(--color-text-secondary)"
                    style={{ fontSize: '11px' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
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
                <Bar
                    dataKey="revenue"
                    name="Pendapatan"
                    radius={[8, 8, 0, 0]}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
