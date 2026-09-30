import api from "./axiosConfig";

export const addCreditProfile = data => {

    return api.post(
        "/creditprofiles/addprofile",
        data
    );
};

export const updateCreditProfile = (
    id,
    data
) => {

    return api.put(
        `/creditprofiles/updateprofile/${id}`,
        data
    );
};

export const getCreditProfileById = id => {

    return api.get(
        `/creditprofiles/getprofilebyid/${id}`
    );
};

export const getCreditProfileByUserId = userId => {

    return api.get(
        `/creditprofiles/getprofilebyuserid/${userId}`
    );
};

export const getAllCreditProfiles = () => {

    return api.get(
        "/creditprofiles/getallprofiles"
    );
};

export const deleteCreditProfile = id => {

    return api.delete(
        `/creditprofiles/deleteprofilebyid/${id}`
    );
};