import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/common/Card';
import { StatCard } from '../components/common/Card';
import { formatCurrency, formatDate, getToday } from '../utils/formatters';
import Button from '../components/common/Button';
import ExportModal from '../components/common/ExportModal';
import { exportRevenueReport } from '../utils/exportPDF';
import { exportRevenueToExcel } from '../utils/exportExcel';
import {
    calculateTotalRevenue,
    calculateTotalIncentives,
    calculateTherapistPerformance,
    calculateProfitSharing
} from '../utils/calculations';

export default function DailyRecap() {
    const { branchBookings, services, therapists, selectedBranch } = useAppContext();
    const [selectedDate, setSelectedDate] = useState(getToday());
    const [showExportModal, setShowExportModal] = useState(false);

    // Filter bookings by date and completed status
    const dateBookings = useMemo(() => {
        return branchBookings.filter(b =>
            b.date === selectedDate && b.status === 'completed'
        );
    }, [branchBookings, selectedDate]);

    // Calculate metrics
    const metrics = useMemo(() => {
        const revenue = calculateTotalRevenue(dateBookings, services);
        const incentives = calculateTotalIncentives(dateBookings, services, therapists);
        const therapistPerf = calculateTherapistPerformance(dateBookings, services, therapists);

        return {
            totalBookings: dateBookings.length,
            revenue,
            incentives,
            netProfit: revenue - incentives,
            therapistPerformance: therapistPerf
        };
    }, [dateBookings, services, therapists]);

    // Group bookings by service
    const serviceBreakdown = useMemo(() => {
        const breakdown = {};
        dateBookings.forEach(booking => {
            const service = services.find(s => s.id === booking.serviceId);
            if (service) {
                if (!breakdown[service.id]) {
                    breakdown[service.id] = {
                        service,
                        count: 0,
                        revenue: 0
                    };
                }
                breakdown[service.id].count += 1;
                breakdown[service.id].revenue += service.price;
            }
        });
        return Object.values(breakdown).sort((a, b) => b.revenue - a.revenue);
    }, [dateBookings, services]);

    const handleExport = (options) => {
        const profitSharing = calculateProfitSharing(
            metrics.netProfit,
            selectedBranch?.profitSharingPercent || 30
        );

        const exportData = {
            ...metrics,
            profitSharing,
            serviceBreakdown,
            totalBookings: metrics.totalBookings,
            totalRevenue: metrics.revenue,
            totalIncentives: metrics.incentives
        };

        if (options.format === 'pdf') {
            exportRevenueReport(exportData, {
                startDate: selectedDate,
                endDate: selectedDate,
                branchName: selectedBranch?.name,
                includeDetails: options.includeDetails
            });
        } else {
            exportRevenueToExcel(exportData, {
                startDate: selectedDate,
                endDate: selectedDate,
                branchName: selectedBranch?.name,
                includeDetails: options.includeDetails
            });
        }
    };

    return (
        <div className="container" style={{ padding: 'var(--spacing-lg) var(--spacing-md)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-lg">
                <div>
                    <h2 className="heading-2" style={{ marginBottom: 'var(--spacing-xs)' }}>
                        Rekap Harian
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        Laporan kinerja harian cabang
                    </p>
                </div>
                <Button onClick={() => setShowExportModal(true)} variant="success">
                    📥 Export Laporan
                </Button>
            </div>

            {/* Date Selector */}
            <Card glass className="mb-lg">
                <label className="label">Pilih Tanggal</label>
                <input
                    type="date"
                    className="input"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 mb-xl">
                <StatCard
                    icon="📋"
                    label="Total Booking"
                    value={metrics.totalBookings}
                    color="primary"
                />
                <StatCard
                    icon="💰"
                    label="Pendapatan"
                    value={formatCurrency(metrics.revenue).replace('Rp', '')}
                    color="success"
                />
                <StatCard
                    icon="💸"
                    label="Insentif Terapis"
                    value={formatCurrency(metrics.incentives).replace('Rp', '')}
                    color="accent"
                />
                <StatCard
                    icon="📊"
                    label="Laba Bersih"
                    value={formatCurrency(metrics.netProfit).replace('Rp', '')}
                    color="secondary"
                />
            </div>

            {/* Service Breakdown */}
            <Card glass className="mb-lg">
                <h3 className="heading-3 mb-md">Breakdown per Layanan</h3>

                {serviceBreakdown.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-xl)',
                        color: 'var(--color-text-muted)'
                    }}>
                        <p>Tidak ada data untuk tanggal ini</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: 'var(--font-size-sm)' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ textAlign: 'left', padding: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>
                                        Layanan
                                    </th>
                                    <th style={{ textAlign: 'center', padding: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>
                                        Jumlah
                                    </th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>
                                        Pendapatan
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceBreakdown.map(({ service, count, revenue }) => (
                                    <tr key={service.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: 'var(--spacing-sm)' }}>
                                            {service.name}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-sm)', textAlign: 'center', fontWeight: 600 }}>
                                            {count}x
                                        </td>
                                        <td style={{ padding: 'var(--spacing-sm)', textAlign: 'right', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                                            {formatCurrency(revenue)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Therapist Performance */}
            <Card glass>
                <h3 className="heading-3 mb-md">Kinerja Terapis</h3>

                {metrics.therapistPerformance.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-xl)',
                        color: 'var(--color-text-muted)'
                    }}>
                        <p>Tidak ada data terapis untuk tanggal ini</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: 'var(--font-size-sm)' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ textAlign: 'left', padding: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>
                                        Terapis
                                    </th>
                                    <th style={{ textAlign: 'center', padding: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>
                                        Booking
                                    </th>
                                    <th style={{ textAlign: 'center', padding: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>
                                        Total Jam
                                    </th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>
                                        Insentif
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics.therapistPerformance.map(({ therapist, bookingCount, totalMinutes, totalIncentive }) => (
                                    <tr key={therapist.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: 'var(--spacing-sm)' }}>
                                            {therapist.name}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-sm)', textAlign: 'center', fontWeight: 600 }}>
                                            {bookingCount}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}>
                                            {(totalMinutes / 60).toFixed(1)} jam
                                        </td>
                                        <td style={{ padding: 'var(--spacing-sm)', textAlign: 'right', fontWeight: 700, color: 'var(--color-success)' }}>
                                            {formatCurrency(totalIncentive)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Export Modal */}
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                onExport={handleExport}
                type="revenue"
            />
        </div>
    );
}
