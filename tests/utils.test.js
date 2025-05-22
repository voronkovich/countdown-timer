import { formatInterval } from '../src/utils.js';

describe('formatInterval', () => {
    it('should return zero for all units when start and end dates are the same', () => {
        const startDate = new Date('2023-01-01T12:00:00Z');
        const endDate = new Date('2023-01-01T12:00:00Z');

        const result = formatInterval(startDate, endDate, {
            weeks: true,
            days: true,
            hours: true,
            minutes: true,
            seconds: true,
        });

        expect(result).toEqual({
            weeks: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        });
    });

    it('should correctly format a time interval with all units', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const endDate = new Date('2025-03-10T15:30:45Z');

        const result = formatInterval(startDate, endDate, {
            years: true,
            weeks: true,
            days: true,
            hours: true,
            minutes: true,
            seconds: true,
        });

        expect(result).toEqual({
            years: 2,
            weeks: 9,
            days: 6,
            hours: 15,
            minutes: 30,
            seconds: 45,
        });
    });

    it('should correctly format a time interval requesting only specific units', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const endDate = new Date('2023-01-01T02:05:10Z');

        const result = formatInterval(startDate, endDate, {
            hours: true,
            minutes: true,
        });

        expect(result).toEqual({
            hours: 2,
            minutes: 5,
        });
        expect(result.weeks).toBeUndefined();
        expect(result.days).toBeUndefined();
        expect(result.seconds).toBeUndefined();
        expect(result.years).toBeUndefined();
        expect(result.months).toBeUndefined();
    });

    it('should correctly calculate years only', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const endDate = new Date('2025-01-01T00:00:00Z'); // Exactly 2 years

        const result = formatInterval(startDate, endDate, { years: true });

        expect(result).toEqual({ years: 2 });
        expect(result.months).toBeUndefined();
        expect(result.weeks).toBeUndefined();
        expect(result.days).toBeUndefined();
        expect(result.hours).toBeUndefined();
        expect(result.minutes).toBeUndefined();
        expect(result.seconds).toBeUndefined();
    });

    it('should correctly calculate months only (30 days per month)', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const endDate = new Date('2023-03-02T00:00:00Z');

        const result = formatInterval(startDate, endDate, { months: true });

        expect(result).toEqual({ months: 2 });
        expect(result.years).toBeUndefined();
        expect(result.weeks).toBeUndefined();
        expect(result.days).toBeUndefined();
        expect(result.hours).toBeUndefined();
        expect(result.minutes).toBeUndefined();
        expect(result.seconds).toBeUndefined();
    });

    it('should correctly calculate months and days', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const endDate = new Date('2023-03-10T00:00:00Z');

        const result = formatInterval(startDate, endDate, {
            months: true,
            days: true,
        });

        expect(result).toEqual({
            months: 2,
            days: 8,
        });
        expect(result.years).toBeUndefined();
        expect(result.weeks).toBeUndefined();
        expect(result.hours).toBeUndefined();
        expect(result.minutes).toBeUndefined();
        expect(result.seconds).toBeUndefined();
    });

    it('should correctly calculate years, months, and days', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const endDate = new Date('2025-05-15T00:00:00Z');

        const result = formatInterval(startDate, endDate, {
            years: true,
            months: true,
            days: true,
        });

        expect(result).toEqual({
            years: 2,
            months: 4,
            days: 15,
        });
        expect(result.weeks).toBeUndefined();
        expect(result.hours).toBeUndefined();
        expect(result.minutes).toBeUndefined();
        expect(result.seconds).toBeUndefined();
    });


    it('should handle start date after end date (absolute difference)', () => {
        const startDate = new Date('2023-01-02T00:00:00Z');
        const endDate = new Date('2023-01-01T00:00:00Z');

        const result = formatInterval(startDate, endDate, { days: true });

        expect(result).toEqual({ days: 1 });
    });

    it('should correctly calculate seconds', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const endDate = new Date('2023-01-01T00:00:59Z');

        const result = formatInterval(startDate, endDate, { seconds: true });
        expect(result).toEqual({ seconds: 59 });
    });

    it('should correctly calculate minutes and seconds', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const endDate = new Date('2023-01-01T00:05:30Z');

        const result = formatInterval(startDate, endDate, {
            minutes: true,
            seconds: true,
        });

        expect(result).toEqual({
            minutes: 5,
            seconds: 30,
        });
    });

    it('should correctly calculate hours, minutes, and seconds', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const endDate = new Date('2023-01-01T03:45:15Z');

        const result = formatInterval(startDate, endDate, {
            hours: true,
            minutes: true,
            seconds: true,
        });

        expect(result).toEqual({
            hours: 3,
            minutes: 45,
            seconds: 15,
        });
    });

    it('should correctly calculate days, hours, minutes, and seconds', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const endDate = new Date('2023-01-05T10:20:30Z');

        const result = formatInterval(startDate, endDate, {
            days: true,
            hours: true,
            minutes: true,
            seconds: true,
        });

        expect(result).toEqual({
            days: 4,
            hours: 10,
            minutes: 20,
            seconds: 30,
        });
    });

    it('should correctly calculate weeks, days, hours, minutes, and seconds', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const endDate = new Date('2023-01-15T18:00:00Z');

        const result = formatInterval(startDate, endDate, {
            weeks: true,
            days: true,
            hours: true,
            minutes: true,
            seconds: true,
        });

        expect(result).toEqual({
            weeks: 2,
            days: 0,
            hours: 18,
            minutes: 0,
            seconds: 0,
        });
    });

    it('should handle intervals just under a full unit', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const endDate = new Date('2023-01-01T00:59:59Z'); // Just under an hour

        const result = formatInterval(startDate, endDate, {
            hours: true,
            minutes: true,
            seconds: true,
        });

        expect(result).toEqual({
            hours: 0,
            minutes: 59,
            seconds: 59,
        });
    });

    it('should handle intervals exactly one unit', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const endDate = new Date('2023-01-01T01:00:00Z'); // Exactly one hour

        const result = formatInterval(startDate, endDate, {
            hours: true,
            minutes: true,
            seconds: true,
        });

        expect(result).toEqual({
            hours: 1,
            minutes: 0,
            seconds: 0,
        });
    });
});
