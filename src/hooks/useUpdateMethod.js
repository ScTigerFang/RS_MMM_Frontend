import axios from "axios";
import { useMutation } from "react-query";

const updateMethod = async ({ methodId, ...updates }) => {
    // PUT /MoneyMakingMethod/{id}
    await axios.put(
        `https://rsmmmapi.azurewebsites.net/MoneyMakingMethod/${methodId}`,
        { methodId, ...updates }
    );
    // you could return something here if you need it
};

export const useUpdateMethod = (options = {}) =>
    useMutation(updateMethod, { ...options });
