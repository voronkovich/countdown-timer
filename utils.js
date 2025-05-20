export function formatInterval(startDate, endDate, format) {
    const result = {};

    const totalMilliseconds = Math.abs(endDate.getTime() - startDate.getTime());

    const secondsInWeek = 60 * 60 * 24 * 7;
    const secondsInDay = 60 * 60 * 24;
    const secondsInHour = 60 * 60;
    const secondsInMinute = 60;

    let remainingSeconds = Math.floor(totalMilliseconds / 1000);

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
