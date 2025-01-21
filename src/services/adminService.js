import axiosInstance from './axiosInstance';
export const registerAdmin = async (datos) => {
    try {
        const response = await axiosInstance.post("/admin/register", datos);
        return response.data;
    } catch (error) {
        console.error('Error al registrar admin:', error);
        throw error;
    }
}