import axiosInstance from './axiosInstance';

export const registerClient = async (formData) => {
    try {
        const response = await axiosInstance.post("/users/register", formData);
        return response.data;
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        throw error;
    }
};

export const fetchClients = async () => {
    try {
        const response = await axiosInstance.get('/users');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        throw error;
    }
};


export const updateClient = async (idUser,updateData) => {
    try {
        const response = await axiosInstance.put(`users/${idUser}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar al cliente:', error);
        throw error;
    }
};


export const deleteClient = async (idUser) => {
    try {
        const response = await axiosInstance.delete(`users/${idUser}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar al cliente:', error);
        throw error;
    }
}