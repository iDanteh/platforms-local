import { useState, useEffect } from 'react';
import { fetchUsers } from './serchUsersUtil';

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
                const users = await fetchUsers(searchQuery);
                setSearchResults(users);
            } catch (err) {
                setError('No se pudo obtener los usuarios.');
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

export default useSearchUsers;