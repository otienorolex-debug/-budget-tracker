export function convertAmount(amount, fromCurrency, toCurrency, rates) {
  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  if (fromCurrency === toCurrency) {
    return amount;
  }

  const fromRate = rates?.[fromCurrency];
  const toRate = rates?.[toCurrency];

  if (!Number.isFinite(fromRate) || fromRate <= 0 || !Number.isFinite(toRate) || toRate <= 0) {
    return null;
  }

  return amount * (toRate / fromRate);
}

export function calculateTotal(expenses, rates, homeCurrency) {
  let total = 0;

  for (const expense of expenses) {
    const converted = convertAmount(expense.amount, expense.currency, homeCurrency, rates);

    if (converted === null) {
      return null;
    }

    total += converted;
  }

  return total;
}

export function filterExpenses(expenses, category) {
  if (category === "All") {
    return expenses;
  }

  return expenses.filter((expense) => expense.category === category);
}
