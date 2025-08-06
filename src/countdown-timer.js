import { formatInterval, parseDate } from './utils.js';

export default class CountdownTimer extends HTMLElement {
    #until = null;
    #units = null;
    #timerInterval = null;

    static define(prefix = 'countdown') {
        const tagName = `${prefix}-timer`;
        customElements.define(tagName, this);
    }

    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.#until) {
            this.#until = parseDate(this.getAttribute('until'));

            if (!this.#until) {
                throw new Error(`${this.tagName.toLowerCase()} requires a valid "until" attribute.`);
            }
        }

        if (!this.#units) {
            this.#units = Object.create(null);
            // Derive prefix by removing the '-timer' suffix from the element's tag name
            const prefix = this.tagName.toLowerCase().slice(0, -6);

            for (const unit of ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds']) {
                const el = this.querySelector(`${prefix}-${unit}`);
                if (el) {
                    this.#units[unit] = {
                        el: el,
                        padZeros: +el.getAttribute('pad-zeros'),
                    };
                }
            }
        }

        this.#update();
        this.#startTimer();
    }

    disconnectedCallback() {
        this.#stopTimer();
    }

    #startTimer() {
        if (!this.#timerInterval) {
            this.#timerInterval = setInterval(() => this.#update(), 1000);
        }
    }

    #stopTimer() {
        if (this.#timerInterval) {
            clearInterval(this.#timerInterval);
            this.#timerInterval = null;
        }
    }

    #update() {
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

        if (now >= this.#until) {
            this.#finish();
        } else {
            timeRemaining = formatInterval(now, this.#until, this.#units);
        }

        this.#updateUnits(timeRemaining);
    }

    #updateUnits(timeRemaining) {
        let finished = true;

        for (const unit of Object.keys(this.#units)) {
            const { el, padZeros } = this.#units[unit];
            const newVal = timeRemaining[unit].toString().padStart(padZeros, '0');

            if (newVal != el.textContent) {
                el.textContent = newVal;
            }

            if (finished && timeRemaining[unit] === 0) {
                el.setAttribute('finished', '');
            } else {
                el.removeAttribute('finished');
                finished = false;
            }
        }
    }

    #finish() {
        this.#stopTimer();
        this.setAttribute('finished', '');
    }
}
