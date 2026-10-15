const state = {
  expenses: [],
  rates: {},
  updatedAt: null,
  homeCurrency: "KES",
  categoryFilter: "all",
  rateStatus: "Loading currency rates…",
  hasRateError: false,
};

const listeners = new Set();

function notify() {
  for (const listener of listeners) {
    listener(state);
  }
}

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addExpense(expense) {
  state.expenses.unshift(expense);
  notify();
}

export function removeExpense(id) {
  state.expenses = state.expenses.filter((expense) => expense.id !== id);
  notify();
}

export function setCategoryFilter(category) {
  state.categoryFilter = category;
  notify();
}

export function setHomeCurrency(currency) {
  state.homeCurrency = currency;
  state.rates = {};
  state.updatedAt = null;
  state.rateStatus = "Loading currency rates…";
  state.hasRateError = false;
  notify();
}

export function setRateLoading() {
  state.rateStatus = "Loading currency rates…";
  state.hasRateError = false;
  notify();
}

export function setRates(rates, updatedAt) {
  state.rates = rates;
  state.updatedAt = updatedAt;
  state.rateStatus = "Exchange rates are up to date.";
  state.hasRateError = false;
  notify();
}

export function setRateError(message) {
  state.rateStatus = message;
  state.hasRateError = true;
  notify();
}
