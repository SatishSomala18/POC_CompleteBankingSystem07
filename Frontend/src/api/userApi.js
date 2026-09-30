import api from "./axiosConfig";

export const addUser = data => {

    return api.post(
        "/users/adduser",
        data
    );
};

export const updateUser = (
    id,
    data
) => {

    return api.put(
        `/users/updateuser/${id}`,
        data
    );
};

export const getUserById = id => {

    return api.get(
        `/users/getuserbyid/${id}`
    );
};

export const getAllUsers = () => {

    return api.get(
        "/users/getallusers"
    );
};

export const deleteUser = id => {

    return api.delete(
        `/users/deleteuserbyid/${id}`
    );
};

export const getUsersByRole = role => {

    return api.get(
        `/users/getusersbyrole/${role}`
    );
};

export const submitKyc = (
    id,
    data
) => {

    return api.put(
        `/users/submitkyc/${id}`,
        data
    );
};

export const approveKyc = id => {

    return api.put(
        `/users/approvekycbyid/${id}`
    );
};

export const rejectKyc = id => {

    return api.put(
        `/users/rejectkycbyid/${id}`
    );
};