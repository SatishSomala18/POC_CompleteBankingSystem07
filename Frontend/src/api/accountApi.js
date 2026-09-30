import api from "./axiosConfig";

export const getAccountsByUserId = (
    userId
) => {

    return api.get(
        `/account/getaccountsbyuserid/${userId}`
    );

};

export const createAccount = (
    data
) => {

    return api.post(
        "/account/createaccount",
        data
    );

};

export const getAccountById = (
    id
) => {

    return api.get(
        `/account/getaccountbyid/${id}`
    );

};

export const freezeAccount = (
    id
) => {

    return api.put(
        `/account/freezeaccountbyid/${id}`
    );

};

export const unfreezeAccount = (
    id
) => {

    return api.put(
        `/account/unfreezeaccountbyid/${id}`
    );

};

export const closeAccount = (
    id
) => {

    return api.put(
        `/account/closeaccountbyid/${id}`
    );

};