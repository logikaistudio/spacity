import * as XLSX from 'xlsx';
import { formatCurrency, formatDate, formatDuration } from './formatters';

/**
 * Export revenue data to Excel
 */
export const exportRevenueToExcel = (data, options = {}) => {
    const {
        startDate,
        endDate,
        branchName = 'Semua Cabang',
        includeDetails = true
    } = options;

    const workbook = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
        ['SPAcity - Laporan Pendapatan'],
        [''],
        ['Periode', `${formatDate(startDate, 'medium')} - ${formatDate(endDate, 'medium')}`],
        ['Cabang', branchName],
        ['Tanggal Cetak', formatDate(new Date(), 'long')],
        [''],
        ['RINGKASAN'],
        ['Total Booking', data.totalBookings],
        ['Total Pendapatan', data.totalRevenue],
        ['Total Insentif Terapis', data.totalIncentives],
        ['Laba Bersih', data.netProfit],
        [''],
        ['PEMBAGIAN LABA'],
        [`Bagian SPA (${data.profitSharing.spaPercent}%)`, data.profitSharing.spaAmount],
        [`Bagian Hotel (${data.profitSharing.hotelPercent}%)`, data.profitSharing.hotelAmount],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    // Set column widths
    summarySheet['!cols'] = [{ wch: 30 }, { wch: 20 }];

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan');

    // Service breakdown sheet
    if (includeDetails && data.serviceBreakdown && data.serviceBreakdown.length > 0) {
        const serviceData = [
            ['Breakdown per Layanan'],
            [''],
            ['Layanan', 'Jumlah', 'Pendapatan']
        ];

        data.serviceBreakdown.forEach(item => {
            serviceData.push([
                item.service.name,
                item.count,
                item.revenue
            ]);
        });

        // Total row
        const totalRevenue = data.serviceBreakdown.reduce((sum, item) => sum + item.revenue, 0);
        const totalCount = data.serviceBreakdown.reduce((sum, item) => sum + item.count, 0);
        serviceData.push(['']);
        serviceData.push(['TOTAL', totalCount, totalRevenue]);

        const serviceSheet = XLSX.utils.aoa_to_sheet(serviceData);
        serviceSheet['!cols'] = [{ wch: 35 }, { wch: 15 }, { wch: 20 }];

        XLSX.utils.book_append_sheet(workbook, serviceSheet, 'Per Layanan');
    }

    // Therapist performance sheet
    if (includeDetails && data.therapistPerformance && data.therapistPerformance.length > 0) {
        const therapistData = [
            ['Kinerja Terapis'],
            [''],
            ['Terapis', 'Booking', 'Total Jam', 'Insentif']
        ];

        data.therapistPerformance.forEach(item => {
            therapistData.push([
                item.therapist.name,
                item.bookingCount,
                (item.totalMinutes / 60).toFixed(1),
                item.totalIncentive
            ]);
        });

        // Total row
        const totalIncentives = data.therapistPerformance.reduce((sum, item) => sum + item.totalIncentive, 0);
        const totalBookings = data.therapistPerformance.reduce((sum, item) => sum + item.bookingCount, 0);
        const totalHours = data.therapistPerformance.reduce((sum, item) => sum + item.totalMinutes, 0) / 60;

        therapistData.push(['']);
        therapistData.push(['TOTAL', totalBookings, totalHours.toFixed(1), totalIncentives]);

        const therapistSheet = XLSX.utils.aoa_to_sheet(therapistData);
        therapistSheet['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];

        XLSX.utils.book_append_sheet(workbook, therapistSheet, 'Kinerja Terapis');
    }

    // Save file
    const filename = `laporan_pendapatan_${startDate}_${endDate}.xlsx`;
    XLSX.writeFile(workbook, filename);
};

/**
 * Export inventory to Excel
 */
export const exportInventoryToExcel = (inventory, options = {}) => {
    const {
        includeLowStockOnly = false,
        includeValues = true
    } = options;

    const workbook = XLSX.utils.book_new();

    // Filter if needed
    let items = includeLowStockOnly
        ? inventory.filter(item => item.currentStock < item.minStock)
        : inventory;

    // Group by category
    const grouped = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    // Summary sheet
    const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.pricePerUnit), 0);
    const lowStockCount = items.filter(item => item.currentStock < item.minStock).length;

    const summaryData = [
        ['SPAcity - Laporan Inventory'],
        [''],
        ['Tanggal', formatDate(new Date(), 'long')],
        [''],
        ['RINGKASAN'],
        ['Total Item', items.length],
        ['Item Stok Rendah', lowStockCount],
    ];

    if (includeValues) {
        summaryData.push(['Total Nilai Inventory', totalValue]);
    }

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 30 }, { wch: 20 }];

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan');

    // Detail sheet with all items
    const headers = includeValues
        ? ['Kategori', 'Item', 'Stok Saat Ini', 'Unit', 'Min. Stok', 'Status', 'Harga/Unit', 'Total Nilai']
        : ['Kategori', 'Item', 'Stok Saat Ini', 'Unit', 'Min. Stok', 'Status'];

    const detailData = [['Daftar Inventory'], [''], headers];

    Object.entries(grouped).forEach(([category, categoryItems]) => {
        categoryItems.forEach(item => {
            const status = item.currentStock < item.minStock ? 'Stok Rendah' : 'Normal';
            const row = [
                category,
                item.name,
                item.currentStock,
                item.unit,
                item.minStock,
                status
            ];

            if (includeValues) {
                row.push(item.pricePerUnit);
                row.push(item.currentStock * item.pricePerUnit);
            }

            detailData.push(row);
        });
    });

    // Add total row if values included
    if (includeValues) {
        detailData.push(['']);
        detailData.push(['', '', '', '', '', 'TOTAL', '', totalValue]);
    }

    const detailSheet = XLSX.utils.aoa_to_sheet(detailData);

    const colWidths = includeValues
        ? [{ wch: 20 }, { wch: 35 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }]
        : [{ wch: 20 }, { wch: 35 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }];

    detailSheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, detailSheet, 'Detail');

    // Category sheets (one per category)
    Object.entries(grouped).forEach(([category, categoryItems]) => {
        const categoryData = [
            [category],
            [''],
            includeValues
                ? ['Item', 'Stok', 'Unit', 'Min. Stok', 'Status', 'Harga/Unit', 'Total Nilai']
                : ['Item', 'Stok', 'Unit', 'Min. Stok', 'Status']
        ];

        categoryItems.forEach(item => {
            const status = item.currentStock < item.minStock ? 'Stok Rendah' : 'Normal';
            const row = [
                item.name,
                item.currentStock,
                item.unit,
                item.minStock,
                status
            ];

            if (includeValues) {
                row.push(item.pricePerUnit);
                row.push(item.currentStock * item.pricePerUnit);
            }

            categoryData.push(row);
        });

        // Category total
        if (includeValues) {
            const categoryTotal = categoryItems.reduce((sum, item) =>
                sum + (item.currentStock * item.pricePerUnit), 0
            );
            categoryData.push(['']);
            categoryData.push(['TOTAL', '', '', '', '', '', categoryTotal]);
        }

        const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
        categorySheet['!cols'] = colWidths.slice(1); // Remove category column

        // Truncate sheet name to 31 chars (Excel limit)
        const sheetName = category.length > 31 ? category.substring(0, 31) : category;
        XLSX.utils.book_append_sheet(workbook, categorySheet, sheetName);
    });

    // Save file
    const filename = `laporan_inventory_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, filename);
};
