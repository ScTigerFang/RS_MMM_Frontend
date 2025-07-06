import axios from "axios";
import { useMutation } from "react-query";

const createMethod = async (newMethod) => {
    // POST /MoneyMakingMethod
    const { data } = await axios.post(
        "https://rsmmmapi.azurewebsites.net/MoneyMakingMethod",
        newMethod
    );
    return data;
};

export const useCreateMethod = (options = {}) =>
    useMutation(createMethod, {
        ...options,
    });
