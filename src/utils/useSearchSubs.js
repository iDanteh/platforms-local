import { useState, useEffect } from 'react';
import { fetchSubs } from './searchSubsUtil';

const useSearchSubs = (searchQuery) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }
    
            console.log('Realizando búsqueda con query:', searchQuery); // Depuración
            setIsLoading(true);
            setError(null);
            try {
                const users = await fetchSubs(searchQuery);
                setSearchResults(users);
            } catch (err) {
                setError('No se pudo obtener las suscripciones.');
                console.error('Error fetching users:', err);
            } finally {
                setIsLoading(false);
            }
        };
    
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 500);
    
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);    

    return { searchResults, isLoading, error };
};

export default useSearchSubs;