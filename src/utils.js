const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;
const SECONDS_IN_MONTH = 60 * 60 * 24 * 30;
const SECONDS_IN_WEEK = 60 * 60 * 24 * 7;
const SECONDS_IN_DAY = 60 * 60 * 24;
const SECONDS_IN_HOUR = 60 * 60;
const SECONDS_IN_MINUTE = 60;

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

    let remainingSeconds = Math.floor(totalMilliseconds / 1000);

    if (format.years) {
        result.years = Math.floor(remainingSeconds / SECONDS_IN_YEAR);
        remainingSeconds %= SECONDS_IN_YEAR;
    }

    if (format.months) {
        result.months = Math.floor(remainingSeconds / SECONDS_IN_MONTH);
        remainingSeconds %= SECONDS_IN_MONTH;
    }

    if (format.weeks) {
        result.weeks = Math.floor(remainingSeconds / SECONDS_IN_WEEK);
        remainingSeconds %= SECONDS_IN_WEEK;
    }

    if (format.days) {
        result.days = Math.floor(remainingSeconds / SECONDS_IN_DAY);
        remainingSeconds %= SECONDS_IN_DAY;
    }

    if (format.hours) {
        result.hours = Math.floor(remainingSeconds / SECONDS_IN_HOUR);
        remainingSeconds %= SECONDS_IN_HOUR;
    }

    if (format.minutes) {
        result.minutes = Math.floor(remainingSeconds / SECONDS_IN_MINUTE);
        remainingSeconds %= SECONDS_IN_MINUTE;
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
