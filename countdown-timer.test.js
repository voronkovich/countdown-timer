// Import the web component
require('./countdown-timer.js');

describe('CountdownTimer', () => {
    let container;

    beforeEach(() => {
        // Set up a DOM element as a render target
        container = document.createElement('div');
        document.body.appendChild(container);

        // Use fake timers to control setInterval
        jest.useFakeTimers();

        // Spy on the mocked clearInterval provided by fake timers
        jest.spyOn(global, 'clearInterval');
    });

    afterEach(() => {
        // Restore the spy
        jest.restoreAllMocks();

        // Clean up DOM
        document.body.removeChild(container);
        container = null;

        // Restore real timers
        jest.useRealTimers();
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
        // 2 days, 3 hours, 4 minutes, 5 seconds
        const futureDate = new Date(Date.now() + 1000 * (60 * 60 * 24 * 2 + 60 * 60 * 3 + 60 * 4 + 5));
        const component = createComponent(futureDate.toISOString(), `
            <countdown-days></countdown-days>
            <countdown-hours></countdown-hours>
            <countdown-minutes></countdown-minutes>
            <countdown-seconds></countdown-seconds>
        `);

        jest.advanceTimersByTime(0);

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

        jest.advanceTimersByTime(0);

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
        jest.advanceTimersByTime(0);
        expect(component.querySelector('countdown-seconds').textContent).toBe('3');

        // After 1 second
        jest.advanceTimersByTime(1000);
        expect(component.querySelector('countdown-seconds').textContent).toBe('2');

        // After another second
        jest.advanceTimersByTime(1000);
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

        jest.advanceTimersByTime(0);

        expect(component.querySelector('countdown-days').textContent).toBe('0');
        expect(component.querySelector('countdown-hours').textContent).toBe('0');
        expect(component.querySelector('countdown-minutes').textContent).toBe('0');
        expect(component.querySelector('countdown-seconds').textContent).toBe('0');
    });

    test('should stop the timer when the element is disconnected', () => {
        // 5 seconds from now
        const futureDate = new Date(Date.now() + 5000);
        const component = createComponent(futureDate.toISOString(), `
            <countdown-seconds></countdown-seconds>
        `);

        // Advance timers to start the interval
        jest.advanceTimersByTime(1000);
        expect(component.querySelector('countdown-seconds').textContent).toBe('4');

        // Disconnect the element
        component.remove();

        // Advance timers further - the value should not change
        jest.advanceTimersByTime(2000);
        expect(component.querySelector('countdown-seconds').textContent).toBe('4');

        // Check that clearInterval was called
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    test('should log an error if "until" attribute is missing', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        const element = document.createElement('countdown-timer');
        container.appendChild(element); // Triggers connectedCallback

        expect(consoleSpy).toHaveBeenCalledWith('countdown-timer requires an "until" attribute.');

        consoleSpy.mockRestore();
    });
});
