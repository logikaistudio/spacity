import React from 'react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
    const navItems = [
        { path: '/analytics', icon: '📊', label: 'Analitik' },
        { path: '/services', icon: '💆', label: 'Layanan' },
        { path: '/scheduling', icon: '📅', label: 'Jadwal' },
        { path: '/daily-recap', icon: '📈', label: 'Rekap' },
        { path: '/inventory', icon: '📦', label: 'Inventory' }
    ];

    return (
        <nav
            className="glass-strong"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: 'var(--bottom-nav-height)',
                zIndex: 100,
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '0 var(--spacing-sm)'
            }}
        >
            {navItems.map(item => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        isActive ? 'nav-item active' : 'nav-item'
                    }
                    style={({ isActive }) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 'var(--spacing-xs)',
                        textDecoration: 'none',
                        color: isActive ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
                        transition: 'all var(--transition-base)',
                        borderRadius: 'var(--radius-md)',
                        minWidth: '60px',
                        position: 'relative'
                    })}
                >
                    {({ isActive }) => (
                        <>
                            {isActive && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '40px',
                                    height: '3px',
                                    background: 'var(--gradient-primary)',
                                    borderRadius: '0 0 4px 4px'
                                }} />
                            )}
                            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                            <span style={{
                                fontSize: 'var(--font-size-xs)',
                                fontWeight: isActive ? 600 : 400
                            }}>
                                {item.label}
                            </span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
}
