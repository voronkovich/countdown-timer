import { formatInterval, parseDate } from './utils.js';

export default class CountdownTimer extends HTMLElement {
    static define(prefix = 'countdown') {
        const tagName = `${prefix}-timer`;
        customElements.define(tagName, this);
    }

    static get observedAttributes() {
        return ['until'];
    }

    #prefix = 'countdown';
    #until = null;
    #timerInterval = null;

    constructor() {
        super();

        // Derive prefix by removing the '-timer' suffix from the element's tag name
        this.#prefix = this.tagName.toLowerCase().slice(0, -6);
    }

    connectedCallback() {
        if (!this.#until) {
            throw new Error(`${this.tagName.toLowerCase()} requires a valid "until" attribute.`);
        }

        this.#updateTimer();
        this.#startTimer();
    }

    disconnectedCallback() {
        this.#stopTimer();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'until') {
            this.#until = parseDate(newValue);

            if (this.#until) {
                this.#updateTimer();
                this.#startTimer();
            } else {
                this.#stopTimer();
                throw new Error(`${this.tagName.toLowerCase()} requires a valid "until" attribute.`);
            }
        }
    }

    #startTimer() {
        if (!this.#timerInterval) {
            this.#timerInterval = setInterval(() => this.#updateTimer(), 1000);
        }
    }

    #stopTimer() {
        if (this.#timerInterval) {
            clearInterval(this.#timerInterval);
            this.#timerInterval = null;
        }
    }

    #updateTimer() {
        const now = new Date();
        const units = this.#getUnits();

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
            this.#stopTimer();
        } else {
            timeRemaining = formatInterval(now, this.#until, units);
        }

        for (const unit of Object.keys(units)) {
            const el = units[unit];
            if (el) {
                const value = timeRemaining[unit];
                const pad = +el.getAttribute('pad-zeros');
                el.textContent = value.toString().padStart(pad, '0');
            }
        }
    }

    #getUnits() {
        return {
            years: this.querySelector(`${this.#prefix}-years`),
            months: this.querySelector(`${this.#prefix}-months`),
            weeks: this.querySelector(`${this.#prefix}-weeks`),
            days: this.querySelector(`${this.#prefix}-days`),
            hours: this.querySelector(`${this.#prefix}-hours`),
            minutes: this.querySelector(`${this.#prefix}-minutes`),
            seconds: this.querySelector(`${this.#prefix}-seconds`),
        };
    }
}
