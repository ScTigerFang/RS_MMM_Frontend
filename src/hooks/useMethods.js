import { useQuery } from "react-query";
import axios from "axios";
import { apiBaseUrl } from "../config/api";

const fetchMethods = async () => {
  const response = await axios.get(`${apiBaseUrl}/MoneyMakingMethod`);
  return response.data;
};

export const useMethods = () => {
  return useQuery("methods", fetchMethods);
};
