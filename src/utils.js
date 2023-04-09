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
  