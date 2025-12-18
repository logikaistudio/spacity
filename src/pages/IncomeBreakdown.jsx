import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/common/Card';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
    calculateTotalRevenue,
    calculateTotalIncentives,
    calculateProfitSharing,
    calculateNetProfit
} from '../utils/calculations';

export default function IncomeBreakdown() {
    const { branchBookings, services, therapists, selectedBranch } = useAppContext();
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(1); // First day of month
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    // Filter completed bookings by date range
    const filteredBookings = useMemo(() => {
        return branchBookings.filter(b =>
            b.status === 'completed' &&
            b.date >= startDate &&
            b.date <= endDate
        );
    }, [branchBookings, startDate, endDate]);

    // Calculate all metrics
    const breakdown = useMemo(() => {
        const totalRevenue = calculateTotalRevenue(filteredBookings, services);
        const totalIncentives = calculateTotalIncentives(filteredBookings, services, therapists);
        const netProfit = calculateNetProfit(totalRevenue, totalIncentives);
        const profitSharing = calculateProfitSharing(netProfit, selectedBranch?.profitSharingPercent || 30);

        return {
            totalRevenue,
            totalIncentives,
            netProfit,
            profitSharing,
            bookingCount: filteredBookings.length
        };
    }, [filteredBookings, services, therapists, selectedBranch]);

    return (
        <div className="container" style={{ padding: 'var(--spacing-lg) var(--spacing-md)' }}>
            {/* Header */}
            <div className="mb-lg">
                <h2 className="heading-2" style={{ marginBottom: 'var(--spacing-xs)' }}>
                    Breakdown Pendapatan
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    Analisis pendapatan, profit sharing, dan insentif terapis
                </p>
            </div>

            {/* Date Range Selector */}
            <Card glass className="mb-lg">
                <div className="grid md:grid-cols-2 gap-md">
                    <div>
                        <label className="label">Dari Tanggal</label>
                        <input
                            type="date"
                            className="input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="label">Sampai Tanggal</label>
                        <input
                            type="date"
                            className="input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
                <div style={{ marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Periode: {formatDate(startDate, 'medium')} - {formatDate(endDate, 'medium')}
                    ({breakdown.bookingCount} booking selesai)
                </div>
            </Card>

            {/* Revenue Summary */}
            <Card glass className="mb-lg">
                <h3 className="heading-3 mb-md">💰 Total Pendapatan (Nilai Jual)</h3>
                <div style={{
                    fontSize: 'var(--font-size-4xl)',
                    fontWeight: 800,
                    background: 'var(--gradient-success)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: 'var(--spacing-sm)'
                }}>
                    {formatCurrency(breakdown.totalRevenue)}
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    Total nilai jual dari semua layanan yang selesai
                </p>
            </Card>

            {/* Breakdown Details */}
            <div className="grid md:grid-cols-2 gap-lg mb-lg">
                {/* Therapist Incentives */}
                <Card glass>
                    <h3 className="heading-3 mb-md">👥 Insentif Terapis</h3>
                    <div style={{
                        fontSize: 'var(--font-size-3xl)',
                        fontWeight: 700,
                        color: 'var(--color-warning)',
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        {formatCurrency(breakdown.totalIncentives)}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        <p className="mb-sm">
                            Insentif dihitung berdasarkan durasi layanan dan tarif per jam terapis.
                        </p>
                        <div className="card" style={{
                            background: 'var(--color-bg-tertiary)',
                            padding: 'var(--spacing-sm)',
                            marginTop: 'var(--spacing-md)'
                        }}>
                            <strong>Contoh Perhitungan:</strong>
                            <ul style={{ marginTop: 'var(--spacing-xs)', paddingLeft: 'var(--spacing-lg)' }}>
                                <li>Layanan 60 menit = 1 jam</li>
                                <li>Tarif Rp 50.000/jam</li>
                                <li>Insentif = Rp 50.000</li>
                            </ul>
                        </div>
                    </div>
                </Card>

                {/* Net Profit */}
                <Card glass>
                    <h3 className="heading-3 mb-md">📊 Laba Bersih</h3>
                    <div style={{
                        fontSize: 'var(--font-size-3xl)',
                        fontWeight: 700,
                        color: 'var(--color-info)',
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        {formatCurrency(breakdown.netProfit)}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        <p>Pendapatan setelah dikurangi insentif terapis</p>
                        <div className="card" style={{
                            background: 'var(--color-bg-tertiary)',
                            padding: 'var(--spacing-sm)',
                            marginTop: 'var(--spacing-md)'
                        }}>
                            <div>Pendapatan: {formatCurrency(breakdown.totalRevenue)}</div>
                            <div>Insentif: -{formatCurrency(breakdown.totalIncentives)}</div>
                            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 'var(--spacing-xs)', paddingTop: 'var(--spacing-xs)', fontWeight: 600 }}>
                                Laba Bersih: {formatCurrency(breakdown.netProfit)}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Profit Sharing */}
            <Card glass>
                <h3 className="heading-3 mb-md">🤝 Pembagian Laba (Profit Sharing)</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-lg)' }}>
                    Kerjasama dengan: <strong>{selectedBranch?.hotelPartner}</strong>
                </p>

                <div className="grid md:grid-cols-2 gap-lg">
                    {/* SPA Share */}
                    <div className="card" style={{
                        background: 'var(--gradient-primary)',
                        border: 'none',
                        color: 'white'
                    }}>
                        <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9, marginBottom: 'var(--spacing-xs)' }}>
                            Bagian SPAcity ({breakdown.profitSharing.spaPercent}%)
                        </div>
                        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--spacing-sm)' }}>
                            {formatCurrency(breakdown.profitSharing.spaAmount)}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>
                            dari laba bersih {formatCurrency(breakdown.netProfit)}
                        </div>
                    </div>

                    {/* Hotel Share */}
                    <div className="card" style={{
                        background: 'var(--gradient-secondary)',
                        border: 'none',
                        color: 'white'
                    }}>
                        <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9, marginBottom: 'var(--spacing-xs)' }}>
                            Bagian Hotel ({breakdown.profitSharing.hotelPercent}%)
                        </div>
                        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--spacing-sm)' }}>
                            {formatCurrency(breakdown.profitSharing.hotelAmount)}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>
                            dari laba bersih {formatCurrency(breakdown.netProfit)}
                        </div>
                    </div>
                </div>

                {/* Formula Explanation */}
                <div className="card" style={{
                    background: 'var(--color-bg-tertiary)',
                    marginTop: 'var(--spacing-lg)',
                    padding: 'var(--spacing-md)'
                }}>
                    <strong style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                        📐 Formula Perhitungan:
                    </strong>
                    <ol style={{ paddingLeft: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>
                        <li>Total Pendapatan = Σ Harga Layanan</li>
                        <li>Total Insentif = Σ (Durasi Layanan ÷ 60) × Tarif per Jam Terapis</li>
                        <li>Laba Bersih = Total Pendapatan - Total Insentif</li>
                        <li>Bagian SPAcity = Laba Bersih × {breakdown.profitSharing.spaPercent}%</li>
                        <li>Bagian Hotel = Laba Bersih × {breakdown.profitSharing.hotelPercent}%</li>
                    </ol>
                </div>
            </Card>
        </div>
    );
}
