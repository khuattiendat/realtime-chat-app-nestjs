import api from '../utils/Interceptor.js';

export const updateUser = async (userId, data) => {
    const res = await api.put(`/api/v1/users/update/${userId}`, data);
    return res.data;
}
export const getAllUsers = async () => {
    const res = await api.get('/api/v1/users/get-all');
    return res.data;
}