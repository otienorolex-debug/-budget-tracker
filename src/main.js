import { fetchExchangeRates } from "./api.js";
import {
  addExpense,
  getState,
  removeExpense,
  setCategoryFilter,
  setHomeCurrency,
  setRateError,
  setRateLoading,
  setRates,
  subscribe,
} from "./state.js";
import { convertAmount } from "./utils.js";
import { render } from "./ui.js";

const expenseForm = document.querySelector("#spendings");
const homeCurrencySelect = document.querySelector("#home-currency");
const categoryFilter = document.querySelector("#category-filter");
const expensesList = document.querySelector("#expense-list");
const retryButton = document.querySelector("#retry-rates");
let latestRequest = 0;

subscribe(render);
setHomeCurrency(homeCurrencySelect.value);
setCategoryFilter(categoryFilter.value);

async function loadRates() {
  const requestId = ++latestRequest;
  setRateLoading();

  try {
    const { rates, updatedAt } = await fetchExchangeRates(getState().homeCurrency);

    if (requestId === latestRequest) {
      setRates(rates, updatedAt);
      return true;
    }
  } catch (error) {
    if (requestId === latestRequest) {
      setRateError(
        error instanceof Error ? error.message : "An unexpected error occurred.",
      );
    }
  }

  return false;
}

expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!expenseForm.reportValidity()) {
    return;
  }

  const formData = new FormData(expenseForm);
  const amount = Number(formData.get("amount"));
  const currency = String(formData.get("currency"));

  if (!Number.isFinite(amount) || amount <= 0) {
    return;
  }

  if (!Number.isFinite(getState().rates[currency])) {
    if (!(await loadRates())) {
      return;
    }
  }

  const state = getState();
  if (convertAmount(amount, currency, state.homeCurrency, state.rates) === null) {
    setRateError(`No ${currency} to ${state.homeCurrency} rate is available.`);
    return;
  }

  addExpense({
    id: globalThis.crypto.randomUUID(),
    description: String(formData.get("description")).trim(),
    amount,
    currency,
    category: String(formData.get("category")),
    createdAt: new Date().toISOString(),
  });
  expenseForm.reset();
  document.querySelector("#spending-description").focus();
});

homeCurrencySelect.addEventListener("change", () => {
  setHomeCurrency(homeCurrencySelect.value);
  loadRates();
});

categoryFilter.addEventListener("change", () => {
  setCategoryFilter(categoryFilter.value);
});

expensesList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-id]");

  if (button) {
    removeExpense(button.dataset.deleteId);
  }
});

retryButton.addEventListener("click", loadRates);

loadRates();
