// src/utils.js
export const formatHourlyProfit = (profit) => {
  const formatNumber = (number) => {
    const parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  if (profit >= 1000000) {
    return `${formatNumber((profit / 1000000).toFixed(3))}m`;
  } else {
    return `${formatNumber((profit / 1000).toFixed(3))}k`;
  }
};

export function parseProfitInput(input) {
  const normalized = input.trim().toUpperCase();
  if (normalized.endsWith("M")) {
    return Math.round(parseFloat(normalized.slice(0, -1)) * 1_000_000);
  }
  if (normalized.endsWith("K")) {
    return Math.round(parseFloat(normalized.slice(0, -1)) * 1_000);
  }
  return Number(normalized) || 0;
}