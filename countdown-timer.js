import { formatInterval } from './utils.js';

export class CountdownTimer extends HTMLElement {
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
        const now = new Date();

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
            timeRemaining = formatInterval(now, this.untilDate, {
                years: !!this.querySelector('countdown-years'),
                months: !!this.querySelector('countdown-months'),
                weeks: !!this.querySelector('countdown-weeks'),
                days: !!this.querySelector('countdown-days'),
                hours: !!this.querySelector('countdown-hours'),
                minutes: !!this.querySelector('countdown-minutes'),
                seconds: !!this.querySelector('countdown-seconds')
            });
        }

        this.updateChild('countdown-years', timeRemaining.years?.toString());
        this.updateChild('countdown-months', timeRemaining.months?.toString());
        this.updateChild('countdown-weeks', timeRemaining.weeks?.toString());
        this.updateChild('countdown-days', timeRemaining.days?.toString());
        this.updateChild('countdown-hours', timeRemaining.hours?.toString());
        this.updateChild('countdown-minutes', timeRemaining.minutes?.toString());
        this.updateChild('countdown-seconds', timeRemaining.seconds?.toString());
    }

    updateChild(tagName, value) {
        const child = this.querySelector(tagName);
        if (child) {
            child.textContent = value;
        }
    }
}

customElements.define('countdown-timer', CountdownTimer);
