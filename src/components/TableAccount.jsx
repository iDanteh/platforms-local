import React, { useEffect, useState } from 'react';
import useSearchSubs from '../utils/useSearchSubs'; 
import useSearchUsers from '../utils/useSearchUsers';

const TableAccount = ({ userName, userInfo }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [users, setUsers] = useState([]);
    const { searchResults: subsResults, isLoading: subsLoading, error: subsError } = useSearchSubs(userName);
    const { searchResults: usersResults, isLoading: usersLoading, error: usersError } = useSearchUsers(userInfo);

    useEffect(() => {
        if (Array.isArray(subsResults)) {
            setSubscriptions(subsResults);
        }
    }, [subsResults]);

    useEffect(() => {
        // Actualiza los resultados de usuarios
        if (Array.isArray(usersResults)) {
            setUsers(usersResults);
        }
    }, [usersResults]);

    const isLoading = subsLoading || usersLoading; 
    const error = subsError || usersError; 

    // Función para obtener la contraseña del usuario basada en el correo
    const getUserPasswordByEmail = (email) => {
        const user = users.find((user) => user.email === email);
        return user ? user.password : 'No disponible';
    };

    return (
        <div className="table-container">
            <h3>Detalles de {userName || '...'}</h3>
            {isLoading && <p>Cargando...</p>}
            {error && <p>{error}</p>}
            <table className="table-accounts">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Contraseña Correo</th>
                        <th>Plataforma</th>
                        <th>Perfil</th>
                        <th>Contraseña</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.length > 0 && (
                        subscriptions.map((sub) => {
                            const userPassword = getUserPasswordByEmail(sub.email);

                            return (
                                <tr key={sub.id_Subscription}>
                                    <td>{sub.name_user}</td>
                                    <td>{sub.email}</td>
                                    <td>{userPassword}</td>
                                    <td>{sub.platform || 'No disponible'}</td>
                                    <td>{sub.perfil || 'No disponible'}</td>
                                    <td>{sub.password || 'No disponible'}</td>
                                </tr>
                            );
                        })
                    )}
                    {subscriptions.length === 0 && users.length === 0 && (
                        <tr>
                            <td colSpan="10">No se encontraron registros.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableAccount;
