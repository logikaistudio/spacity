import React from 'react';

export default function Button({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    icon,
    type = 'button',
    className = ''
}) {
    const variantClass = `btn-${variant}`;
    const sizeClass = size !== 'md' ? `btn-${size}` : '';

    return (
        <button
            type={type}
            className={`btn ${variantClass} ${sizeClass} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
}

export function IconButton({ icon, onClick, variant = 'secondary', disabled = false, className = '' }) {
    const variantClass = `btn-${variant}`;

    return (
        <button
            type="button"
            className={`btn btn-icon ${variantClass} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon}
        </button>
    );
}
