import axios from "axios";
import { useMutation } from "react-query";
import { useOwnerAuth } from "../auth/OwnerAuthContext";
import { apiBaseUrl } from "../config/api";

export const useCreateMethod = (options = {}) => {
  const { getRequestConfig, signOut } = useOwnerAuth();
  return useMutation(async (newMethod) => {
    try {
      const { data } = await axios.post(
        `${apiBaseUrl}/MoneyMakingMethod`,
        newMethod,
        getRequestConfig(),
      );
      return data;
    } catch (error) {
      if ([401, 403].includes(error.response?.status)) signOut();
      throw error;
    }
  }, options);
};
