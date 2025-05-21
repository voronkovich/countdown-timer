/**
 * Calculates the time interval between two dates and formats it based on the specified units.
 * Note: Uses approximate values for months (30 days) and years (365 days).
 *
 * @param {Date} startDate - The starting date.
 * @param {Date} endDate - The ending date.
 * @param {object} format - An object specifying which units to include (e.g., { years: true, days: true }).
 * @param {boolean} [format.years] - Include years in the result.
 * @param {boolean} [format.months] - Include months in the result (approximate).
 * @param {boolean} [format.weeks] - Include weeks in the result.
 * @param {boolean} [format.days] - Include days in the result.
 * @param {boolean} [format.hours] - Include hours in the result.
 * @param {boolean} [format.minutes] - Include minutes in the result.
 * @param {boolean} [format.seconds] - Include seconds in the result.
 * @returns {object} An object containing the calculated interval components.
 */
export function formatInterval(startDate, endDate, format) {
    const result = {};

    const totalMilliseconds = Math.abs(endDate.getTime() - startDate.getTime());

    // Approximate seconds in a year (using 365 days for simplicity)
    const secondsInYear = 60 * 60 * 24 * 365;
    // Approximate seconds in a month (using 30 days for simplicity)
    const secondsInMonth = 60 * 60 * 24 * 30;
    const secondsInWeek = 60 * 60 * 24 * 7;
    const secondsInDay = 60 * 60 * 24;
    const secondsInHour = 60 * 60;
    const secondsInMinute = 60;

    let remainingSeconds = Math.floor(totalMilliseconds / 1000);

    if (format.years) {
        result.years = Math.floor(remainingSeconds / secondsInYear);
        remainingSeconds %= secondsInYear;
    }

    if (format.months) {
        result.months = Math.floor(remainingSeconds / secondsInMonth);
        remainingSeconds %= secondsInMonth;
    }

    if (format.weeks) {
        result.weeks = Math.floor(remainingSeconds / secondsInWeek);
        remainingSeconds %= secondsInWeek;
    }

    if (format.days) {
        result.days = Math.floor(remainingSeconds / secondsInDay);
        remainingSeconds %= secondsInDay;
    }

    if (format.hours) {
        result.hours = Math.floor(remainingSeconds / secondsInHour);
        remainingSeconds %= secondsInHour;
    }

    if (format.minutes) {
        result.minutes = Math.floor(remainingSeconds / secondsInMinute);
        remainingSeconds %= secondsInMinute;
    }

    if (format.seconds) {
        result.seconds = remainingSeconds;
    }

    return result;
}

/**
 * Parses a date string into a Date object.
 *
 * @param {string} dateStr - The date string to parse.
 * @returns {Date|null} A Date object if parsing is successful, otherwise null.
 */
export function parseDate(dateStr) {
    if (!dateStr) {
        return null;
    }

    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        return date;
    }

    return null;
}
