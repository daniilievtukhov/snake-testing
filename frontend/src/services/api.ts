import axios from "axios";

const BASE_URL = "http://localhost:8080/api/";

export const getUsers = () => {
    return axios.get(`${BASE_URL}user`);
};
export const getOneUser = (id: number) => {
    return axios.get(`${BASE_URL}user/${id}`);
};
export const createUser = (username: string) => {
    return axios.post(`${BASE_URL}user`, { username });
};

export const updateUserScore = (id: number, score: number) => {
    return axios.put(`${BASE_URL}user`, { id, score });
};
