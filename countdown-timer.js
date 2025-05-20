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

        if (totalMilliseconds < 0) {
            this.stopTimer();
            // Display "Expired" or similar, and set all to 0
            this.updateChild('countdown-days', '0');
            this.updateChild('countdown-hours', '0');
            this.updateChild('countdown-minutes', '0');
            this.updateChild('countdown-seconds', '0');
            return;
        }

        let ms = totalMilliseconds;

        // Calculate base values
        let days = Math.floor(ms / (1000 * 60 * 60 * 24));
        ms %= (1000 * 60 * 60 * 24);

        let hours = Math.floor(ms / (1000 * 60 * 60));
        ms %= (1000 * 60 * 60);

        let minutes = Math.floor(ms / (1000 * 60));
        ms %= (1000 * 60);

        let seconds = Math.floor(ms / 1000);

        // Get elements
        const daysEl = this.querySelector('countdown-days');
        const hoursEl = this.querySelector('countdown-hours');
        const minutesEl = this.querySelector('countdown-minutes');
        const secondsEl = this.querySelector('countdown-seconds');

        // Propagate values if elements are missing
        // Start from the largest unit that might propagate (days)
        // and add its value to the next available smaller unit's variable.

        if (!daysEl) {
            // If days element is missing, add days (converted to hours) to hours
            hours += days * 24;
        }

        if (!hoursEl) {
            // If hours element is missing, add hours (converted to minutes) to minutes
            minutes += hours * 60;
        }

        if (!minutesEl) {
            // If minutes element is missing, add minutes (converted to seconds) to seconds
            seconds += minutes * 60;
        }

        // Update elements that are present
        if (daysEl) {
            daysEl.textContent = days.toString();
        }
        if (hoursEl) {
            hoursEl.textContent = hours.toString();
        }
        if (minutesEl) {
            minutesEl.textContent = minutes.toString();
        }
        if (secondsEl) {
            secondsEl.textContent = seconds.toString();
        }
    }

    updateChild(tagName, value) {
        const child = this.querySelector(tagName);
        if (child) {
            child.textContent = value;
        }
    }
}

customElements.define('countdown-timer', CountdownTimer);
