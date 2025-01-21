import { useState, useEffect } from 'react';

const useSearchUsers = (searchQuery) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (searchQuery.trim() === '') {
                setSearchResults([]);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                // Enviamos la consulta al proceso principal para buscar usuarios
                const users = await window.electronAPI.searchUsers(searchQuery);
                if (users && users.length > 0) {
                    setSearchResults(users);
                } else {
                    setSearchResults([]); // Si no se encuentran usuarios, limpiar resultados
                }
            } catch (err) {
                setError('No se pudo obtener los usuarios.');
                console.error('Error fetching users:', err);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 500); // Temporizador para optimizar la búsqueda en tiempo real

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return { searchResults, isLoading, error };
};

export default useSearchUsers;
