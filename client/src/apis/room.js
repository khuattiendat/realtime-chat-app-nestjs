import api from "../utils/Interceptor.js";

export const createOrGetPrivateRoom = async (data) => {
    const response = await api.post("/api/v1/rooms/private-message", data);
    return response.data;
}
export const getMessagesByRoomId = async (roomId) => {
    const response = await api.get(`/api/v1/rooms/get-messages/${roomId}`);
    return response.data;
}
export const createRoom = async (data) => {
    const response = await api.post("/api/v1/rooms/create", data);
    return response.data;
}
export const getAllRooms = async () => {
    const response = await api.get("/api/v1/rooms/get-all");
    return response.data;
}
export const getMessagesByGroupId = async (roomId) => {
    const response = await api.get(`/api/v1/rooms/get-messages/${roomId}`);
    return response.data;
}