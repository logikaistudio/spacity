// Formatting utilities for currency, dates, and numbers

/**
 * Format number as Indonesian Rupiah currency
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

/**
 * Format date to Indonesian locale
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'medium', 'long'
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const options = {
        short: { day: '2-digit', month: '2-digit', year: 'numeric' },
        medium: { day: 'numeric', month: 'long', year: 'numeric' },
        long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    };

    return new Intl.DateTimeFormat('id-ID', options[format]).format(dateObj);
};

/**
 * Format time from HH:MM to readable format
 * @param {string} time - Time in HH:MM format
 * @returns {string} - Formatted time string
 */
export const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes} WIB`;
};

/**
 * Format duration in minutes to hours and minutes
 * @param {number} minutes - Duration in minutes
 * @returns {string} - Formatted duration string
 */
export const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
        return `${mins} menit`;
    } else if (mins === 0) {
        return `${hours} jam`;
    } else {
        return `${hours} jam ${mins} menit`;
    }
};

/**
 * Format large numbers with K, M suffixes
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

/**
 * Get relative time (e.g., "2 jam lalu", "kemarin")
 * @param {string|Date} date - Date to compare
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now - dateObj;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;

    return formatDate(dateObj, 'short');
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} - Today's date
 */
export const getToday = () => {
    return new Date().toISOString().split('T')[0];
};

/**
 * Check if date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if date is today
 */
export const isToday = (date) => {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    return dateStr === getToday();
};

/**
 * Get day name in Indonesian
 * @param {string|Date} date - Date to get day name
 * @returns {string} - Day name in Indonesian
 */
export const getDayName = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dateObj.getDay()];
};
