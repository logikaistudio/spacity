import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatTime, formatDate, formatDuration, getToday } from '../utils/formatters';
import { exportReceipt } from '../utils/exportPDF';

export default function Scheduling() {
    const { branchBookings, services, therapists, selectedBranch, addBooking, updateBooking, deleteBooking } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(getToday());
    const [formData, setFormData] = useState({
        serviceId: '',
        therapistId: '',
        customerName: '',
        date: getToday(),
        time: '09:00',
        status: 'confirmed',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addBooking(formData);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            serviceId: '',
            therapistId: '',
            customerName: '',
            date: getToday(),
            time: '09:00',
            status: 'confirmed',
            notes: ''
        });
        setShowModal(false);
    };

    const handleStatusChange = (bookingId, newStatus) => {
        updateBooking(bookingId, { status: newStatus });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus booking ini?')) {
            deleteBooking(id);
        }
    };

    const handlePrintReceipt = (booking) => {
        const service = services.find(s => s.id === booking.serviceId);
        const therapist = therapists.find(t => t.id === booking.therapistId);
        if (service && therapist && selectedBranch) {
            exportReceipt(booking, service, therapist, selectedBranch);
        }
    };

    // Filter bookings by selected date
    const dateBookings = branchBookings
        .filter(b => b.date === selectedDate)
        .sort((a, b) => a.time.localeCompare(b.time));

    // Generate time slots
    const timeSlots = [];
    for (let hour = 9; hour <= 20; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    return (
        <div className="container" style={{ padding: 'var(--spacing-lg) var(--spacing-md)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-lg">
                <div>
                    <h2 className="heading-2" style={{ marginBottom: 'var(--spacing-xs)' }}>
                        Jadwal & Booking
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        Kelola jadwal layanan dan booking pelanggan
                    </p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    + Booking Baru
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

            {/* Bookings List */}
            <Card glass>
                <h3 className="heading-3 mb-md">
                    Booking untuk {formatDate(selectedDate, 'medium')}
                </h3>

                {dateBookings.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-xl)',
                        color: 'var(--color-text-muted)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📅</div>
                        <p>Tidak ada booking untuk tanggal ini</p>
                    </div>
                ) : (
                    <div className="grid gap-md">
                        {dateBookings.map(booking => {
                            const service = services.find(s => s.id === booking.serviceId);
                            const therapist = therapists.find(t => t.id === booking.therapistId);

                            return (
                                <div
                                    key={booking.id}
                                    className="card"
                                    style={{ borderLeft: `4px solid var(--color-${booking.status === 'completed' ? 'success' : 'primary'})` }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div style={{ flex: 1 }}>
                                            <div className="flex items-center gap-md mb-sm">
                                                <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>
                                                    {formatTime(booking.time)}
                                                </span>
                                                <StatusBadge status={booking.status} />
                                            </div>

                                            <h4 style={{
                                                fontSize: 'var(--font-size-lg)',
                                                fontWeight: 600,
                                                marginBottom: 'var(--spacing-xs)'
                                            }}>
                                                {booking.customerName}
                                            </h4>

                                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                <div className="mb-xs">
                                                    <strong>Layanan:</strong> {service?.name || '-'}
                                                    {service && ` (${formatDuration(service.durationMinutes)})`}
                                                </div>
                                                <div className="mb-xs">
                                                    <strong>Terapis:</strong> {therapist?.name || '-'}
                                                </div>
                                                {service && (
                                                    <div className="mb-xs">
                                                        <strong>Harga:</strong> <span style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>
                                                            {formatCurrency(service.price)}
                                                        </span>
                                                    </div>
                                                )}
                                                {booking.notes && (
                                                    <div style={{ marginTop: 'var(--spacing-sm)', fontStyle: 'italic' }}>
                                                        "{booking.notes}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-sm">
                                            {booking.status === 'completed' && (
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handlePrintReceipt(booking)}
                                                >
                                                    🖨️ Cetak
                                                </Button>
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleStatusChange(booking.id, 'completed')}
                                                >
                                                    Selesai
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(booking.id)}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            {/* Add Booking Modal */}
            <Modal
                isOpen={showModal}
                onClose={resetForm}
                title="Booking Baru"
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-md">
                        <div>
                            <label className="label">Nama Customer *</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                required
                                placeholder="Nama lengkap customer"
                            />
                        </div>

                        <div>
                            <label className="label">Layanan *</label>
                            <select
                                className="select"
                                value={formData.serviceId}
                                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                required
                            >
                                <option value="">-- Pilih Layanan --</option>
                                {services.map(service => (
                                    <option key={service.id} value={service.id}>
                                        {service.name} - {formatCurrency(service.price)} ({formatDuration(service.durationMinutes)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Terapis *</label>
                            <select
                                className="select"
                                value={formData.therapistId}
                                onChange={(e) => setFormData({ ...formData, therapistId: e.target.value })}
                                required
                            >
                                <option value="">-- Pilih Terapis --</option>
                                {therapists.map(therapist => (
                                    <option key={therapist.id} value={therapist.id}>
                                        {therapist.name} ({therapist.specialization})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-md">
                            <div>
                                <label className="label">Tanggal *</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Jam *</label>
                                <select
                                    className="select"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                >
                                    {timeSlots.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="label">Catatan</label>
                            <textarea
                                className="input"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows="2"
                                placeholder="Catatan tambahan..."
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div className="flex gap-md justify-end">
                            <Button type="button" variant="secondary" onClick={resetForm}>
                                Batal
                            </Button>
                            <Button type="submit" variant="success">
                                Simpan Booking
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
