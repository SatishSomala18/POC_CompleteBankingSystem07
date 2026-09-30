import api from "./axiosConfig";

export const addUserSecurity = data => {

    return api.post(
        "/usersecurity/addusersecurity",
        data
    );
};

export const updateUserSecurity = (
    id,
    data
) => {

    return api.put(
        `/usersecurity/updateusersecurity/${id}`,
        data
    );
};

export const getUserSecurityById = id => {

    return api.get(
        `/usersecurity/getusersecuritybyid/${id}`
    );
};

export const getUserSecurityByUserId = userId => {

    return api.get(
        `/usersecurity/getusersecuritybyuserid/${userId}`
    );
};

export const getAllUserSecurities = () => {

    return api.get(
        "/usersecurity/getallusersecurities"
    );
};

export const deleteUserSecurity = id => {

    return api.delete(
        `/usersecurity/deleteusersecuritybyid/${id}`
    );
};