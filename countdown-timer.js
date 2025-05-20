import { formatInterval } from './utils.js';

export class CountdownTimer extends HTMLElement {
    static define(prefix = 'countdown') {
        const tagName = `${prefix}-timer`;
        customElements.define(tagName, this);
    }

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
        this.updateTimer();
        this.stopTimer();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimer() {
        const now = new Date();
        const units = this.getUnits();

        let timeRemaining = {
            years: 0,
            months: 0,
            weeks: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };

        if (now >= this.untilDate) {
            this.stopTimer();
        } else {
            timeRemaining = formatInterval(now, this.untilDate, units);
        }

        for (const unit of Object.keys(units)) {
            if (units[unit]) {
                units[unit].textContent = timeRemaining[unit].toString();
            }
        }
    }

    getUnits() {
        // Derive prefix by removing the '-timer' suffix from the element's tag name
        const prefix = this.tagName.toLowerCase().slice(0, -6);

        return {
            years: this.querySelector(`${prefix}-years`),
            months: this.querySelector(`${prefix}-months`),
            weeks: this.querySelector(`${prefix}-weeks`),
            days: this.querySelector(`${prefix}-days`),
            hours: this.querySelector(`${prefix}-hours`),
            minutes: this.querySelector(`${prefix}-minutes`),
            seconds: this.querySelector(`${prefix}-seconds`),
        };
    }
}

CountdownTimer.define();
