import api from "./axiosConfig";

export const getAllInvestments = () => {

    return api.get(
        "/investments/getallinvestments"
    );
};

export const getInvestmentById = id => {

    return api.get(
        `/investments/getinvestmentbyid/${id}`
    );
};

export const addInvestment = data => {

    return api.post(
        "/investments/addinvestment",
        data
    );
};

export const updateInvestment = (
    id,
    data
) => {

    return api.put(
        `/investments/updateinvestment/${id}`,
        data
    );
};

export const deleteInvestment = id => {

    return api.delete(
        `/investments/deleteinvestmentbyid/${id}`
    );
};

export const addUserInvestment = data => {

    return api.post(
        "/userinvestments/adduserinvestment",
        data
    );
};

export const getUserInvestments = userId => {

    return api.get(
        `/userinvestments/getuserinvestmentsbyuserid/${userId}`
    );
};

export const getUserInvestmentById = id => {

    return api.get(
        `/userinvestments/getuserinvestmentbyid/${id}`
    );
};

export const getAllUserInvestments = () => {

    return api.get(
        "/userinvestments/getalluserinvestments"
    );
};

export const updateUserInvestment = (
    id,
    data
) => {

    return api.put(
        `/userinvestments/updateuserinvestment/${id}`,
        data
    );
};

export const deleteUserInvestmentById = id => {

    return api.delete(
        `/userinvestments/deleteuserinvestmentbyid/${id}`
    );
};

export const deleteUserInvestmentByUserId = userId => {

    return api.delete(
        `/userinvestments/deleteuserinvestmentbyuserid/${userId}`
    );
};

export const deleteUserInvestmentByInvestmentId = investmentId => {

    return api.delete(
        `/userinvestments/deleteuserinvestmentbyinvestmentid/${investmentId}`
    );
};