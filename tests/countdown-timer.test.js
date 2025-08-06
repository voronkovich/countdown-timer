import CountdownTimer from '../src/countdown-timer.js';
import { install } from "@sinonjs/fake-timers";

describe('CountdownTimer', () => {
    let container;
    const clock = install();
    CountdownTimer.define();

    beforeEach(() => {
        // Set up a DOM element as a render target
        container = document.createElement('div');
        document.body.appendChild(container);

        jest.spyOn(global, 'clearInterval');

        clock.reset();
    });

    afterEach(() => {
        // Clean up DOM
        document.body.removeChild(container);
        container = null;

        jest.restoreAllMocks();
    });

    afterAll(() => {
        clock.uninstall();
    });

    // Helper function to create and append the component
    const createComponent = (untilDate, innerHTML = '') => {
        const element = document.createElement('countdown-timer');
        element.setAttribute('until', untilDate);
        element.innerHTML = innerHTML;
        container.appendChild(element);
        return element;
    };

    test('should render and display initial countdown with all tags', () => {
        // 1 week, 2 days, 3 hours, 4 minutes, 5 seconds
        const futureDate = new Date(Date.now() + 1000 * (60 * 60 * 24 * 7 * 1 + 60 * 60 * 24 * 2 + 60 * 60 * 3 + 60 * 4 + 5));
        const component = createComponent(futureDate.toISOString(), `
            <countdown-weeks></countdown-weeks>
            <countdown-days></countdown-days>
            <countdown-hours></countdown-hours>
            <countdown-minutes></countdown-minutes>
            <countdown-seconds></countdown-seconds>
        `);

        clock.tick(0);

        expect(component.querySelector('countdown-weeks').textContent).toBe('1');
        expect(component.querySelector('countdown-days').textContent).toBe('2');
        expect(component.querySelector('countdown-hours').textContent).toBe('3');
        expect(component.querySelector('countdown-minutes').textContent).toBe('4');
        expect(component.querySelector('countdown-seconds').textContent).toBe('5');
    });

    test('should handle omitted tags and propagate values', () => {
        // 2 days, 3 hours, 4 minutes, 5 seconds
        const futureDate = new Date(Date.now() + 1000 * (60 * 60 * 24 * 2 + 60 * 60 * 3 + 60 * 4 + 5));
        const component = createComponent(futureDate.toISOString(), `
            <countdown-minutes></countdown-minutes>
            <countdown-seconds></countdown-seconds>
        `);

        clock.tick(0);

        // Expect days and hours to be added to minutes
        // 2 days + 3 hours + 4 minutes
        const expectedMinutes = (2 * 24 * 60) + (3 * 60) + 4;
        expect(component.querySelector('countdown-minutes').textContent).toBe(expectedMinutes.toString());
        expect(component.querySelector('countdown-seconds').textContent).toBe('5');
    });

    test('should update countdown every second', () => {
        // 3 seconds from now
        const futureDate = new Date(Date.now() + 3000);
        const component = createComponent(futureDate.toISOString(), `
            <countdown-seconds></countdown-seconds>
        `);

        // Initial state
        clock.tick(0);
        expect(component.querySelector('countdown-seconds').textContent).toBe('3');

        // After 1 second
        clock.tick(1000);
        expect(component.querySelector('countdown-seconds').textContent).toBe('2');

        // After another second
        clock.tick(1000);
        expect(component.querySelector('countdown-seconds').textContent).toBe('1');
    });

    test('should display zeros when the until date is in the past', () => {
        // 10 seconds ago
        const pastDate = new Date(Date.now() - 10000);
        const component = createComponent(pastDate.toISOString(), `
            <countdown-days></countdown-days>
            <countdown-hours></countdown-hours>
            <countdown-minutes></countdown-minutes>
            <countdown-seconds></countdown-seconds>
        `);

        clock.tick(0);

        expect(component.querySelector('countdown-days').textContent).toBe('0');
        expect(component.querySelector('countdown-hours').textContent).toBe('0');
        expect(component.querySelector('countdown-minutes').textContent).toBe('0');
        expect(component.querySelector('countdown-seconds').textContent).toBe('0');
    });

    test('should add "finished" attribute to the main component when countdown is complete', () => {
        // 1 second from now
        const futureDate = new Date(Date.now() + 1000);
        const component = createComponent(futureDate.toISOString(), `
            <countdown-seconds></countdown-seconds>
        `);

        clock.tick(0);
        expect(component.hasAttribute('finished')).toBe(false);

        clock.tick(1000);
        expect(component.hasAttribute('finished')).toBe(true);

        clock.tick(1000); // Tick past the future date
        expect(component.hasAttribute('finished')).toBe(true);
    });

    test('should add "finished" attribute to individual units when their value reaches zero', () => {
        // 1 day, 2 hours, 3 minutes, 4 seconds from now
        const futureDate = new Date(Date.now() + 1000 * (60 * 60 * 24 * 1 + 60 * 60 * 2 + 60 * 3 + 4));
        const component = createComponent(futureDate.toISOString(), `
            <countdown-days></countdown-days>
            <countdown-hours></countdown-hours>
            <countdown-minutes></countdown-minutes>
            <countdown-seconds></countdown-seconds>
        `);

        clock.tick(0);
        expect(component.querySelector('countdown-days').hasAttribute('finished')).toBe(false);
        expect(component.querySelector('countdown-hours').hasAttribute('finished')).toBe(false);
        expect(component.querySelector('countdown-minutes').hasAttribute('finished')).toBe(false);
        expect(component.querySelector('countdown-seconds').hasAttribute('finished')).toBe(false);

        // Advance time to make days zero
        clock.tick(1000 * 3 * 60 * 60); // 3 hours
        expect(component.querySelector('countdown-days').textContent).toBe('0');
        expect(component.querySelector('countdown-days').hasAttribute('finished')).toBe(true);
        expect(component.querySelector('countdown-hours').hasAttribute('finished')).toBe(false);

        // Advance time to make hours zero
        clock.tick(1000 * (22 * 60 * 60 + 30 * 60)); // 22 hours 30 minutes
        expect(component.querySelector('countdown-hours').textContent).toBe('0');
        expect(component.querySelector('countdown-hours').hasAttribute('finished')).toBe(true);
        expect(component.querySelector('countdown-minutes').hasAttribute('finished')).toBe(false); // Hours should not be finished yet

        // Advance time to make minutes zero
        clock.tick(1000 * 33 * 60); // 33 minutes
        expect(component.querySelector('countdown-minutes').textContent).toBe('0');
        expect(component.querySelector('countdown-minutes').hasAttribute('finished')).toBe(true);
        expect(component.querySelector('countdown-seconds').hasAttribute('finished')).toBe(false); // Minutes should not be finished yet

        // Advance time to make seconds zero
        clock.tick(1000 * 5); // 5 minutes
        expect(component.querySelector('countdown-seconds').textContent).toBe('0');
        expect(component.querySelector('countdown-seconds').hasAttribute('finished')).toBe(true);
    });

    test('should stop the timer when the element is disconnected', () => {
        // 5 seconds from now
        const futureDate = new Date(Date.now() + 5000);
        const component = createComponent(futureDate.toISOString(), `
            <countdown-seconds></countdown-seconds>
        `);

        // Initial state
        clock.tick(0);
        expect(component.querySelector('countdown-seconds').textContent).toBe('5');

        // Disconnect the element
        component.remove();

        // Advance timers further - the value should not change
        clock.tick(2000);
        expect(component.querySelector('countdown-seconds').textContent).toBe('5');

        // Check that clearInterval was called
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    test('should throw an error if "until" attribute is missing', () => {
        const element = document.createElement('countdown-timer');
        // Appending the element triggers connectedCallback
        expect(() => container.appendChild(element)).toThrow('countdown-timer requires a valid "until" attribute.');
    });

    test('should pad zeros when pad-zeros attribute is present', () => {
        const futureDate = new Date(Date.now() + 5000);
        const component = createComponent(futureDate.toISOString(), `
            <countdown-seconds pad-zeros="2"></countdown-seconds>
        `);

        clock.tick(0);

        // At 5 seconds
        expect(component.querySelector('countdown-seconds').textContent).toBe('05');

        // Advance 1 second
        clock.tick(1000);
        expect(component.querySelector('countdown-seconds').textContent).toBe('04');
    });
});
