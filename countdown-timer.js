class CountdownTimer extends HTMLElement {
    constructor() {
        super();
        this.timerInterval = null;
        this.untilDate = null;
    }

    connectedCallback() {
        const until = this.getAttribute('until');
        if (until) {
            this.untilDate = new Date(until);
            this.startTimer();
        } else {
            console.error('countdown-timer requires an "until" attribute.');
        }
    }

    disconnectedCallback() {
        this.stopTimer();
    }

    startTimer() {
        this.updateTimer(); // Initial update
        this.stopTimer(); // Clear any existing interval
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimer() {
        const now = new Date().getTime();
        let totalMilliseconds = this.untilDate.getTime() - now;
        let totalSeconds = Math.floor(totalMilliseconds / 1000); // Work with seconds

        // Determine the required format based on child elements
        const format = {
            days: !!this.querySelector('countdown-days'),
            hours: !!this.querySelector('countdown-hours'),
            minutes: !!this.querySelector('countdown-minutes'),
            seconds: !!this.querySelector('countdown-seconds')
        };

        const timeRemaining = formatInterval(totalSeconds, format);

        // Update elements that are present
        this.updateChild('countdown-days', timeRemaining.days?.toString());
        this.updateChild('countdown-hours', timeRemaining.hours?.toString());
        this.updateChild('countdown-minutes', timeRemaining.minutes?.toString());
        this.updateChild('countdown-seconds', timeRemaining.seconds?.toString());

        // Stop timer if time is up (totalMilliseconds was originally < 0)
        if (totalMilliseconds < 0) {
            this.stopTimer();
        }
    }

    updateChild(tagName, value) {
        const child = this.querySelector(tagName);
        if (child) {
            child.textContent = value;
        }
    }
}

function formatInterval(totalSeconds, format) {
    if (totalSeconds < 0) {
        totalSeconds = 0;
    }

    let remainingSeconds = totalSeconds;
    const result = {};

    const secondsInDay = 60 * 60 * 24;
    const secondsInHour = 60 * 60;
    const secondsInMinute = 60;

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

customElements.define('countdown-timer', CountdownTimer);
