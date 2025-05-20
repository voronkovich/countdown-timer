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
        const distance = this.untilDate.getTime() - now;

        if (distance < 0) {
            this.stopTimer();
            // Optionally display "Expired" or similar
            this.updateChild('countdown-days', '0');
            this.updateChild('countdown-hours', '0');
            this.updateChild('countdown-minutes', '0');
            this.updateChild('countdown-seconds', '0');
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.updateChild('countdown-days', days.toString());
        this.updateChild('countdown-hours', hours.toString());
        this.updateChild('countdown-minutes', minutes.toString());
        this.updateChild('countdown-seconds', seconds.toString());
    }

    updateChild(tagName, value) {
        const child = this.querySelector(tagName);
        if (child) {
            child.textContent = value;
        }
    }
}

customElements.define('countdown-timer', CountdownTimer);
