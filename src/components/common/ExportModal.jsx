import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

export default function ExportModal({
    isOpen,
    onClose,
    onExport,
    type = 'revenue', // 'revenue' or 'inventory'
    branches = []
}) {
    const [format, setFormat] = useState('pdf');
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(1);
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [selectedBranch, setSelectedBranch] = useState('all');
    const [includeDetails, setIncludeDetails] = useState(true);
    const [includeLowStockOnly, setIncludeLowStockOnly] = useState(false);
    const [includeValues, setIncludeValues] = useState(true);

    const handleExport = () => {
        const options = {
            format,
            startDate,
            endDate,
            branchId: selectedBranch,
            branchName: selectedBranch === 'all' ? 'Semua Cabang' : branches.find(b => b.id === selectedBranch)?.name,
            includeDetails,
            includeLowStockOnly,
            includeValues
        };

        onExport(options);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Export Laporan">
            <div className="grid gap-md">
                {/* Format Selection */}
                <div>
                    <label className="label">Format Export *</label>
                    <div className="flex gap-md">
                        <button
                            className={`btn ${format === 'pdf' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFormat('pdf')}
                            style={{ flex: 1 }}
                        >
                            📄 PDF
                        </button>
                        <button
                            className={`btn ${format === 'excel' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFormat('excel')}
                            style={{ flex: 1 }}
                        >
                            📊 Excel
                        </button>
                    </div>
                </div>

                {type === 'revenue' && (
                    <>
                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-md">
                            <div>
                                <label className="label">Dari Tanggal *</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="label">Sampai Tanggal *</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Branch Selection */}
                        {branches.length > 0 && (
                            <div>
                                <label className="label">Cabang</label>
                                <select
                                    className="select"
                                    value={selectedBranch}
                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                >
                                    <option value="all">Semua Cabang</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Options */}
                        <div>
                            <label className="label">Opsi Laporan</label>
                            <div className="flex items-center gap-sm" style={{ padding: 'var(--spacing-sm) 0' }}>
                                <input
                                    type="checkbox"
                                    id="includeDetails"
                                    checked={includeDetails}
                                    onChange={(e) => setIncludeDetails(e.target.checked)}
                                    style={{ width: '16px', height: '16px' }}
                                />
                                <label htmlFor="includeDetails" style={{ cursor: 'pointer', margin: 0, fontSize: 'var(--font-size-sm)' }}>
                                    Sertakan detail breakdown (per layanan & terapis)
                                </label>
                            </div>
                        </div>
                    </>
                )}

                {type === 'inventory' && (
                    <>
                        {/* Inventory Options */}
                        <div>
                            <label className="label">Opsi Laporan</label>

                            <div className="flex items-center gap-sm" style={{ padding: 'var(--spacing-sm) 0' }}>
                                <input
                                    type="checkbox"
                                    id="lowStockOnly"
                                    checked={includeLowStockOnly}
                                    onChange={(e) => setIncludeLowStockOnly(e.target.checked)}
                                    style={{ width: '16px', height: '16px' }}
                                />
                                <label htmlFor="lowStockOnly" style={{ cursor: 'pointer', margin: 0, fontSize: 'var(--font-size-sm)' }}>
                                    Hanya item dengan stok rendah
                                </label>
                            </div>

                            <div className="flex items-center gap-sm" style={{ padding: 'var(--spacing-sm) 0' }}>
                                <input
                                    type="checkbox"
                                    id="includeValues"
                                    checked={includeValues}
                                    onChange={(e) => setIncludeValues(e.target.checked)}
                                    style={{ width: '16px', height: '16px' }}
                                />
                                <label htmlFor="includeValues" style={{ cursor: 'pointer', margin: 0, fontSize: 'var(--font-size-sm)' }}>
                                    Sertakan harga dan nilai total
                                </label>
                            </div>
                        </div>
                    </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-md justify-end" style={{ marginTop: 'var(--spacing-md)' }}>
                    <Button variant="secondary" onClick={onClose}>
                        Batal
                    </Button>
                    <Button variant="success" onClick={handleExport}>
                        {format === 'pdf' ? '📥 Download PDF' : '📥 Download Excel'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
