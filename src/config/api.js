export const apiBaseUrl = (
  process.env.REACT_APP_API_URL || "https://rsmmmapi.azurewebsites.net"
).replace(/\/+$/, "");
