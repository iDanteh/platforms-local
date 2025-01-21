import axios from 'axios';

export const fetchSubs = async (searchQuery) => {
    if (searchQuery.trim() === '') {
        return [];
    }

    try {
        const response = await axios.get(`https://backplatforms-production.up.railway.app/api/v1/suscriptions/search?name_user=${searchQuery}`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.log('Error en fetchSubs:', error);
        return [];
    }
};
