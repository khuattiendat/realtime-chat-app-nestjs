import axios from "axios";
import {VITE_BASE_SERVER_URL} from '../utils/const.js'
import api from '../utils/Interceptor.js'

export const login = async (data) => {
    const response = await axios.post(`${VITE_BASE_SERVER_URL}/api/v1/auth/login`, data);
    return response.data;
}
export const register = async (data) => {
    const response = await axios.post(`${VITE_BASE_SERVER_URL}/api/v1/auth/register`, data);
    return response.data;
}
export const getProfileUser = async () => {
    const response = await api.get(`${VITE_BASE_SERVER_URL}/api/v1/auth/profile`);
    return response.data;

}
export const refreshToken = async (data) => {
    const response = await axios.post(`${VITE_BASE_SERVER_URL}/api/v1/auth/refresh`, data);
    return response.data;
}
export const changePassword = async (id, data) => {
    const response = await api.post(`${VITE_BASE_SERVER_URL}/api/v1/auth/change-password/${id}`, data);
    return response.data;
}