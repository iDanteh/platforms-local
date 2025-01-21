import { useState, useEffect } from 'react';

const useSearchSubs = (searchQuery) => {
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
                const subs = await window.electronAPI.searchSubs(searchQuery);
                if (subs && subs.length > 0) {
                    setSearchResults(subs);
                } else {
                    setSearchResults([]); // Si no se encuentran usuarios, limpiar resultados
                }
            } catch (err) {
                setError('No se pudo obtener los usuarios.');
                console.error('Error fetching subs:', err);
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

export default useSearchSubs;
