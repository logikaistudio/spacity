// Financial calculations utilities

/**
 * Calculate profit sharing amounts
 * @param {number} totalRevenue - Total revenue amount
 * @param {number} profitSharingPercent - Percentage for SPA (hotel gets the rest)
 * @returns {object} - { spaAmount, hotelAmount }
 */
export const calculateProfitSharing = (totalRevenue, profitSharingPercent) => {
    const spaAmount = (totalRevenue * profitSharingPercent) / 100;
    const hotelAmount = totalRevenue - spaAmount;

    return {
        spaAmount,
        hotelAmount,
        spaPercent: profitSharingPercent,
        hotelPercent: 100 - profitSharingPercent
    };
};

/**
 * Calculate therapist incentive based on service duration
 * @param {number} durationMinutes - Service duration in minutes
 * @param {number} hourlyRate - Therapist hourly incentive rate
 * @returns {number} - Incentive amount
 */
export const calculateTherapistIncentive = (durationMinutes, hourlyRate) => {
    const hours = durationMinutes / 60;
    return hours * hourlyRate;
};

/**
 * Calculate total revenue from bookings
 * @param {array} bookings - Array of booking objects
 * @param {array} services - Array of service objects
 * @returns {number} - Total revenue
 */
export const calculateTotalRevenue = (bookings, services) => {
    return bookings.reduce((total, booking) => {
        const service = services.find(s => s.id === booking.serviceId);
        return total + (service ? service.price : 0);
    }, 0);
};

/**
 * Calculate total therapist incentives for bookings
 * @param {array} bookings - Array of booking objects
 * @param {array} services - Array of service objects
 * @param {array} therapists - Array of therapist objects
 * @returns {number} - Total incentives
 */
export const calculateTotalIncentives = (bookings, services, therapists) => {
    return bookings.reduce((total, booking) => {
        const service = services.find(s => s.id === booking.serviceId);
        const therapist = therapists.find(t => t.id === booking.therapistId);

        if (service && therapist) {
            const incentive = calculateTherapistIncentive(
                service.durationMinutes,
                therapist.hourlyIncentive
            );
            return total + incentive;
        }

        return total;
    }, 0);
};

/**
 * Group bookings by therapist and calculate their total incentives
 * @param {array} bookings - Array of booking objects
 * @param {array} services - Array of service objects
 * @param {array} therapists - Array of therapist objects
 * @returns {array} - Array of therapist performance objects
 */
export const calculateTherapistPerformance = (bookings, services, therapists) => {
    const performance = {};

    bookings.forEach(booking => {
        const service = services.find(s => s.id === booking.serviceId);
        const therapist = therapists.find(t => t.id === booking.therapistId);

        if (service && therapist) {
            if (!performance[therapist.id]) {
                performance[therapist.id] = {
                    therapist,
                    bookingCount: 0,
                    totalMinutes: 0,
                    totalIncentive: 0
                };
            }

            const incentive = calculateTherapistIncentive(
                service.durationMinutes,
                therapist.hourlyIncentive
            );

            performance[therapist.id].bookingCount += 1;
            performance[therapist.id].totalMinutes += service.durationMinutes;
            performance[therapist.id].totalIncentive += incentive;
        }
    });

    return Object.values(performance);
};

/**
 * Calculate net profit (revenue - therapist incentives)
 * @param {number} revenue - Total revenue
 * @param {number} incentives - Total therapist incentives
 * @returns {number} - Net profit
 */
export const calculateNetProfit = (revenue, incentives) => {
    return revenue - incentives;
};
