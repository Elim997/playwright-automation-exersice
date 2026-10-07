# Playwright Automation Exercise

Playwright + Mocha automation for `https://test.netlify.app/`.

## What it does

1. Fills the Name, Email, Phone, Company and Website fields.
2. Changes "Number of Employees" from 1-10 to 51-500.
3. Takes a screenshot before submitting: `before-submit.png`.
4. Clicks "Request a call back".
5. Checks that the thank-you page was reached and prints the URL to the console.

## Setup

Requires Node 18+.

```bash
npm install
npx playwright install chromium
```

## Run

```bash
npm run test          # headless
npm run test:headed   # opens the browser so the flow can be watched
```

On success, this line is printed:

```text
Reached the thank you page. URL: ...
```

The screenshot is saved in the project root as `before-submit.png`.

## Notes

I used label-based selectors where possible, because they are easier to read and closer to how a user sees the form.

For the text fields, there is also a fallback to the input `name` attribute. This is useful if a label exists visually but is not connected correctly to the input in the HTML.

The target URL in `landing-form.test.js` (`SITE_URL`) is a placeholder from the original exercise. Replace it to run the test against another form.