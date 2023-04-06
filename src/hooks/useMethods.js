import { useQuery } from "react-query";
import axios from "axios";

const fetchMethods = async () => {
  const response = await axios.get("https://rsmmmapi.azurewebsites.net/MoneyMakingMethod");
  return response.data;
};

export const useMethods = () => {
  return useQuery("methods", fetchMethods);
};