import { useQuery } from "react-query";
import axios from "axios";

const fetchIntensity = async () => {
  const response = await axios.get("https://rsmmmapi.azurewebsites.net/Intensity");
  console.log(response);
  return response.data;
};

export const useIntensity = () => {
  return useQuery("intensity", fetchIntensity);
};