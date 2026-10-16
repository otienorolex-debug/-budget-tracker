# LedgerCo Budget Tracker

LedgerCo is a browser-based expense tracker. Add and categorize expenses, view their total in a selected home currency, and filter the expense list by category. Currency rates are fetched from the [ExchangeRate-API](https://www.exchangerate-api.com/).

## Features

- Record expenses with a description, amount, currency, and category.
- View expense totals and converted amounts in a home currency.
- Filter expenses by category and remove individual expenses.
- Retry loading exchange rates when a request fails.
- Run utility tests with Vitest.

## Requirements

- Node.js and npm
- An internet connection for exchange-rate requests

## Run locally

Install the development dependencies:

```sh
npm install
```

Serve the project directory using a local HTTP server. For example:

Then open <http://localhost:8000> in a browser. Serving the files over HTTP allows the browser to load the JavaScript modules correctly.

## Run tests

```sh
npm test
```

## Project structure

```text
.
├── index.html
├── login.html
├── register.html
├── style.css
├── src/
│   ├── api.js       # Exchange-rate API requests
│   ├── main.js      # App startup and event handling
│   ├── state.js     # Expense and application state
│   ├── ui.js        # Rendering and display
│   └── utils.js     # Currency and expense helpers
└── tests/
    └── utils.test.js
```
web link:https://otienorolex-debug.github.io/-budget-tracker/
Expense data is currently held in browser memory and is cleared when the page is reloaded.
