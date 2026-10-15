const API_URL = "https://open.er-api.com/v6/latest";

export async function fetchExchangeRates(baseCurrency = "USD") {
  try {
    const response = await fetch(`${API_URL}/${baseCurrency}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.result !== "success") {
      throw new Error("API reported a failure");
    }

    return {
      rates: data.rates,
      updatedAt: data.time_last_update_utc,
    };
  } catch (error) {
    throw new Error(`Failed to fetch exchange rates for ${baseCurrency}: ${error.message}`);
  }
}