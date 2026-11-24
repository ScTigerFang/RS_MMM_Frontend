import { useQuery } from "react-query";
import axios from "axios";
import { apiBaseUrl } from "../config/api";

const fetchIntensity = async () => {
  const response = await axios.get(`${apiBaseUrl}/Intensity`);
  return response.data;
};

export const useIntensity = () => {
  return useQuery("intensity", fetchIntensity);
};
