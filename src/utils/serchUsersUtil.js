import axios from 'axios';

export const fetchUsers = async (searchQuery) => {
    if (searchQuery.trim() === '') {
        return [];
    }

    try {
        const response = await axios.get(`https://backplatforms-production.up.railway.app/api/v1/users/search?name=${searchQuery}`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        return [];
    }
};