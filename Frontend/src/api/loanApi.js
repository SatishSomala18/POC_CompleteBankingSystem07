import api from "./axiosConfig";

export const applyLoan = data => {

    return api.post(
        "/loans/applyloan",
        data
    );
};

export const getLoanById = id => {

    return api.get(
        `/loans/getloanbyid/${id}`
    );
};

export const getLoansByUserId = userId => {

    return api.get(
        `/loans/getloansbyuserid/${userId}`
    );
};

export const getLoansByStatus = status => {

    return api.get(
        `/loans/getloansbystatus/${status}`
    );
};

export const getAllLoans = () => {

    return api.get(
        "/loans/getallloans"
    );
};

export const approveLoan = id => {

    return api.put(
        `/loans/approveloanbyid/${id}`
    );
};

export const rejectLoan = id => {

    return api.put(
        `/loans/rejectloanbyid/${id}`
    );
};

export const deleteLoan = id => {

    return api.delete(
        `/loans/deleteloanbyid/${id}`
    );
};

export const markEmiPaid = id => {

    return api.put(
        `/loans/markemipaid/${id}`
    );
};

export const checkDelinquency = id => {

    return api.get(
        `/loans/checkdelinquency/${id}`
    );
};