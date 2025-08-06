# Countdown Timer

[![Tests](https://github.com/voronkovich/countdown-timer/actions/workflows/tests.yml/badge.svg)](https://github.com/voronkovich/countdown-timer/actions/workflows/tests.yml)

This project provides a simple custom HTML element `<countdown-timer>` that displays a countdown to a specified date.

Demo: https://voronkovich.github.io/countdown-timer/demo/

## Installation

Install the package via npm:

```bash
npm install @voronkovich/countdown-timer
```

And import the element like this:

```js
import '@voronkovich/countdown-timer';
```

This will register the custom element `<countdown-timer>` with the browser.

Also you can download the minified script directly from [dist/countdown.min.js](https://raw.githubusercontent.com/voronkovich/countdown-timer/refs/heads/main/dist/countdown.min.js) and include it in your HTML file:

```html
<script src="path/to/your/dist/countdown.min.js" async></script>
```

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

### Handling Completion

When the countdown reaches zero, the `<countdown-timer>` element will automatically add a `finished` attribute. You can use this attribute in CSS or JavaScript to apply styles or take actions when the countdown completes.

Additionally, individual unit elements (e.g., `<countdown-days>`, `<countdown-hours>`) will also receive the `finished` attribute when their specific time unit reaches zero.

For example, you can use CSS to change the appearance of the timer when it finishes:

```css
countdown-timer[finished] {
    opacity: 0.5;
}
```

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

A more complete example can be found in [demo/index.html](demo/index.html).

## Building

The project uses [Bun](https://bun.sh/) for building. To build the minified JavaScript file (`dist/countdown.min.js`), run:

```bash
bun run build
```

## Development

To run the tests, use:

```bash
bun test
```
