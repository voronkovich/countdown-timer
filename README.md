# Countdown Timer Custom Element

This project provides a simple custom HTML element `<countdown-timer>` that displays a countdown to a specified date.

## Usage

The `<countdown-timer>` element requires an `until` attribute specifying the target date in a format parseable by the JavaScript `Date` constructor (e.g., `YYYY-MM-DD`, `YYYY-MM-DDTHH:mm:ss`).

Inside the `<countdown-timer>` element, you can place specific elements to display different units of time remaining:

- `<countdown-years>`
- `<countdown-months>`
- `<countdown-weeks>`
- `<countdown-days>`
- `<countdown-hours>`
- `<countdown-minutes>`
- `<countdown-seconds>`

These unit elements will have their text content updated automatically with the corresponding time remaining.

You can also add the `pad-zeros` attribute to any of the unit elements to specify the minimum number of digits to display, padding with leading zeros if necessary.

## Example

```html
<countdown-timer until="2025-12-31T23:59:59">
    <div>
        <countdown-days></countdown-days> days
    </div>
    <div>
        <countdown-hours pad-zeros="2"></countdown-hours>:
        <countdown-minutes pad-zeros="2"></countdown-minutes>:
        <countdown-seconds pad-zeros="2"></countdown-seconds>
    </div>
</countdown-timer>
```

A more complete example can be found in `demo/index.html`.

## Building

The project uses [Bun](https://bun.sh/) for building. To build the minified JavaScript file (`build/countdown.min.js`), run:

```bash
bun build index.js --outfile build/countdown.min.js --minify
```

## Development

To run the tests, use:

```bash
bun test
```
