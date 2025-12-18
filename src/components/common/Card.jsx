import React from 'react';

export default function Card({ children, className = '', hover = true, glass = false }) {
    const baseClass = glass ? 'card-glass' : 'card';
    const hoverClass = hover ? '' : 'hover:transform-none hover:shadow-md';

    return (
        <div className={`${baseClass} ${hoverClass} ${className}`}>
            {children}
        </div>
    );
}

export function StatCard({ icon, label, value, trend, color = 'primary' }) {
    const gradients = {
        primary: 'var(--gradient-primary)',
        secondary: 'var(--gradient-secondary)',
        success: 'var(--gradient-success)',
        accent: 'var(--gradient-accent)'
    };

    return (
        <div
            className="stat-card"
            style={{ background: gradients[color] }}
        >
            <div style={{ position: 'relative', zIndex: 1 }}>
                {icon && <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>{icon}</div>}
                <div style={{ fontSize: 'var(--font-size-xs)', opacity: 0.9, marginBottom: 'var(--spacing-xs)' }}>
                    {label}
                </div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>
                    {value}
                </div>
                {trend && (
                    <div style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)', opacity: 0.8 }}>
                        {trend}
                    </div>
                )}
            </div>
        </div>
    );
}
