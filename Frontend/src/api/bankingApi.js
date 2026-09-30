import api from "./axiosConfig";

export const deposit = data => {

    return api.post(
        "/transaction/deposit",
        data
    );
};

export const withdraw = data => {

    return api.post(
        "/transaction/withdraw",
        data
    );
};

export const transfer = data => {

    return api.post(
        "/transaction/transfer",
        data
    );
};

export const getTransactionById = id => {

    return api.get(
        `/transaction/gettransactionbyid/${id}`
    );
};

export const getAllTransactions = () => {

    return api.get(
        "/transaction/getalltransactions"
    );
};

export const getAccountTransactions = accountId => {

    return api.get(
        `/transaction/accounttransactions/${accountId}`
    );
};

export const getTransactionsBetweenAccounts = (
    fromId,
    toId
) => {

    return api.get(
        `/transaction/gettransactionsbetweenaccounts/from/${fromId}/to/${toId}`
    );
};

export const reverseTransaction = id => {

    return api.put(
        `/transaction/reversetransactionbyid/${id}`
    );
};

export const getFlaggedTransactions = () => {

    return api.get(
        "/transaction/getflaggedtransactions"
    );
};