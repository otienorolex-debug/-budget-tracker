import { calculateTotal, convertAmount, filterExpenses } from "./utils.js";

const homeCurrencySelect = document.querySelector("#home-currency");
const categoryFilter = document.querySelector("#category-filter");
const expensesList = document.querySelector("#expense-list");
const expenseTemplate = document.querySelector("#expense-item-template");
const emptyState = document.querySelector("#expense-empty-state");
const totalOutput = document.querySelector("#expense-total");
const rateStatus = document.querySelector("#rate-status");
const retryButton = document.querySelector("#retry-rates");

function formatAmount(amount, currency) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "code",
  }).format(amount);
}

export function render(state) {
  homeCurrencySelect.value = state.homeCurrency;
  categoryFilter.value = state.categoryFilter;
  rateStatus.textContent = state.rateStatus;
  retryButton.hidden = !state.hasRateError;

  const visibleExpenses = filterExpenses(
    state.expenses,
    state.categoryFilter === "all" ? "All" : state.categoryFilter,
  );

  expensesList.replaceChildren();
  emptyState.hidden = visibleExpenses.length > 0;

  for (const expense of visibleExpenses) {
    const item = expenseTemplate.content.firstElementChild.cloneNode(true);
    const convertedAmount = convertAmount(
      expense.amount,
      expense.currency,
      state.homeCurrency,
      state.rates,
    );

    item.querySelector("[data-expense-description]").textContent = expense.description;
    item.querySelector("[data-expense-category]").textContent = expense.category;
    item.querySelector("[data-expense-original]").textContent = formatAmount(
      expense.amount,
      expense.currency,
    );
    item.querySelector("[data-expense-converted]").textContent =
      convertedAmount === null
        ? "Conversion unavailable"
        : `≈ ${formatAmount(convertedAmount, state.homeCurrency)}`;
    item.querySelector(".delete-expense").dataset.deleteId = expense.id;
    item.querySelector(".delete-expense").setAttribute(
      "aria-label",
      `Delete ${expense.description}`,
    );

    expensesList.append(item);
  }

  const total = calculateTotal(state.expenses, state.rates, state.homeCurrency);
  totalOutput.textContent =
    total === null ? `${state.homeCurrency} —` : formatAmount(total, state.homeCurrency);
}
