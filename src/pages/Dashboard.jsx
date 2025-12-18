import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { StatCard } from '../components/common/Card';
import Card from '../components/common/Card';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatTime, isToday } from '../utils/formatters';
import { calculateTotalRevenue, calculateTotalIncentives } from '../utils/calculations';

export default function Dashboard() {
    const { selectedBranch, branchBookings, services, therapists } = useAppContext();

    // Filter today's bookings
    const todayBookings = useMemo(() => {
        return branchBookings.filter(booking => isToday(booking.date));
    }, [branchBookings]);

    // Calculate stats
    const stats = useMemo(() => {
        const revenue = calculateTotalRevenue(todayBookings, services);
        const incentives = calculateTotalIncentives(todayBookings, services, therapists);
        const completedCount = todayBookings.filter(b => b.status === 'completed').length;

        return {
            totalBookings: todayBookings.length,
            revenue,
            completedBookings: completedCount,
            activeTherapists: new Set(todayBookings.map(b => b.therapistId)).size
        };
    }, [todayBookings, services, therapists]);

    return (
        <div className="container" style={{ padding: 'var(--spacing-lg) var(--spacing-md)' }}>
            {/* Page Title */}
            <div className="mb-lg">
                <h2 className="heading-2" style={{ marginBottom: 'var(--spacing-xs)' }}>
                    Dashboard
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    {selectedBranch?.name} - {selectedBranch?.location}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 mb-xl">
                <StatCard
                    icon="📅"
                    label="Booking Hari Ini"
                    value={stats.totalBookings}
                    color="primary"
                />
                <StatCard
                    icon="✅"
                    label="Selesai"
                    value={stats.completedBookings}
                    color="success"
                />
                <StatCard
                    icon="💰"
                    label="Pendapatan"
                    value={formatCurrency(stats.revenue).replace('Rp', 'Rp ')}
                    color="accent"
                />
                <StatCard
                    icon="👤"
                    label="Terapis Aktif"
                    value={stats.activeTherapists}
                    color="secondary"
                />
            </div>

            {/* Quick Actions */}
            <Card className="mb-lg" glass>
                <h3 className="heading-3 mb-md">Akses Cepat</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
                    <Link to="/scheduling" className="btn btn-primary">
                        <span>📅</span>
                        Jadwal Baru
                    </Link>
                    <Link to="/daily-recap" className="btn btn-secondary">
                        <span>📊</span>
                        Rekap Harian
                    </Link>
                    <Link to="/income-breakdown" className="btn btn-secondary">
                        <span>💵</span>
                        Breakdown
                    </Link>
                    <Link to="/services" className="btn btn-secondary">
                        <span>💆</span>
                        Kelola Layanan
                    </Link>
                    <Link to="/inventory" className="btn btn-secondary">
                        <span>📦</span>
                        Inventory
                    </Link>
                </div>
            </Card>

            {/* Recent Bookings */}
            <Card glass>
                <div className="flex items-center justify-between mb-md">
                    <h3 className="heading-3" style={{ margin: 0 }}>Booking Hari Ini</h3>
                    <Link to="/scheduling" className="btn btn-sm btn-outline">
                        Lihat Semua
                    </Link>
                </div>

                {todayBookings.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-xl)',
                        color: 'var(--color-text-muted)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📅</div>
                        <p>Belum ada booking untuk hari ini</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: 'var(--font-size-sm)' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ textAlign: 'left', padding: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>Jam</th>
                                    <th style={{ textAlign: 'left', padding: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>Customer</th>
                                    <th style={{ textAlign: 'left', padding: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>Layanan</th>
                                    <th style={{ textAlign: 'left', padding: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>Terapis</th>
                                    <th style={{ textAlign: 'left', padding: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todayBookings.map(booking => {
                                    const service = services.find(s => s.id === booking.serviceId);
                                    const therapist = therapists.find(t => t.id === booking.therapistId);
                                    return (
                                        <tr key={booking.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: 'var(--spacing-sm)' }}>
                                                <strong>{formatTime(booking.time)}</strong>
                                            </td>
                                            <td style={{ padding: 'var(--spacing-sm)' }}>{booking.customerName}</td>
                                            <td style={{ padding: 'var(--spacing-sm)' }}>{service?.name || '-'}</td>
                                            <td style={{ padding: 'var(--spacing-sm)' }}>{therapist?.name || '-'}</td>
                                            <td style={{ padding: 'var(--spacing-sm)' }}>
                                                <StatusBadge status={booking.status} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
