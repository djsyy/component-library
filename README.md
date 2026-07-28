# Component Library

A React component library built with TypeScript, Vite, and Storybook.

## Components

- `Button` — Action button with primary, secondary, loading, and size variants.
- `TextInput` — Labeled text input with helper text and error support.
- `Checkbox` — Controlled checkbox with checked, unchecked, and indeterminate states.
- `Menu` — Triggered action menu with `MenuItem` and `MenuSeparator` helpers.
- `Select` — Labeled native select control with helper text and error support.

## Requirements

- Node.js 24
- npm

## Installation

```bash
npm install
npx playwright install chromium
```

The Playwright browser is required for Storybook component tests.

## Development

```bash
npm run dev
npm run storybook
```

Storybook is available at `http://localhost:6006`.

## Testing

```bash
npm test
npm run test-storybook
npm run a11y:check
```

`test-storybook` runs Storybook stories and their `play` functions in headless Chromium. `a11y:check` runs Axe checks for representative component states.

## Quality checks

```bash
npm run lint
npm run build
```

## Visual testing

Chromatic runs for pull requests and pushes to `main`. Configure the `CHROMATIC_PROJECT_TOKEN` repository secret before enabling the workflow.
