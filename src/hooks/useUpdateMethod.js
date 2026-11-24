import axios from "axios";
import { useMutation } from "react-query";
import { useOwnerAuth } from "../auth/OwnerAuthContext";
import { apiBaseUrl } from "../config/api";

export const useUpdateMethod = (options = {}) => {
  const { getRequestConfig, signOut } = useOwnerAuth();
  return useMutation(async ({ methodId, ...updates }) => {
    try {
      await axios.put(
        `${apiBaseUrl}/MoneyMakingMethod/${encodeURIComponent(methodId)}`,
        { methodId, ...updates },
        getRequestConfig(),
      );
    } catch (error) {
      if ([401, 403].includes(error.response?.status)) signOut();
      throw error;
    }
  }, options);
};
