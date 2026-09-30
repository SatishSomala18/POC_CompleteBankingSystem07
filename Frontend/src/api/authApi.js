import api from "./axiosConfig";

export const registerUser = data => {

    return api.post(
        "/auth/register",
        data
    );
};

export const loginUser = data => {

    return api.post(
        "/auth/login",
        data
    );
};

export const verifyOtp = data => {

    return api.post(
        "/auth/verify-otp",
        data
    );
};

export const refreshToken = data => {

    return api.post(
        "/auth/refresh-token",
        data
    );
};