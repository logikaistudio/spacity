import React from 'react';

export default function Badge({ children, variant = 'primary', className = '' }) {
    const variantClass = `badge-${variant}`;

    return (
        <span className={`badge ${variantClass} ${className}`}>
            {children}
        </span>
    );
}

export function StatusBadge({ status }) {
    const variants = {
        'completed': 'success',
        'confirmed': 'primary',
        'pending': 'warning',
        'cancelled': 'error',
        'low': 'warning',
        'normal': 'success',
        'critical': 'error'
    };

    const labels = {
        'completed': 'Selesai',
        'confirmed': 'Terkonfirmasi',
        'pending': 'Menunggu',
        'cancelled': 'Dibatalkan',
        'low': 'Stok Rendah',
        'normal': 'Normal',
        'critical': 'Kritis'
    };

    return (
        <Badge variant={variants[status] || 'primary'}>
            {labels[status] || status}
        </Badge>
    );
}
