/**
 * Returns the currency symbol for the given currency code
 */
export const getCurrencySymbol = (currency = "USD"): string => {
  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    NPR: "रू",
  };

  return currencySymbols[currency] || "$";
};

/**
 * Formats a price with the appropriate currency symbol
 */
export const formatPrice = (price: number, currency = "USD"): string => {
  return `${getCurrencySymbol(currency)}${price.toFixed(2)}`;
};
