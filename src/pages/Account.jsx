import React, { useState } from 'react';
import '../styles/Account_Style.css';
import TableAccount from '../components/TableAccount.jsx';
import useSearchSubs from '../utils/useSearchSubs.js';
import useSearchUsers from '../utils/useSearchUsers.js'; // Importamos el hook useSearchUsers
import { MdPersonSearch } from "react-icons/md";

function Account() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    
    // Usamos ambos hooks: uno para buscar subs y otro para buscar usuarios
    const { searchResults: subsResults, isLoading: subsLoading } = useSearchSubs(searchQuery);
    const { searchResults: usersResults, isLoading: usersLoading } = useSearchUsers(searchQuery);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSearchQuery(''); 
        console.log('ciente seleccionado',user);
    };

    // Combinamos los resultados de subs y usuarios
    const allSearchResults = [...subsResults, ...usersResults];

    return (
        <div className='div-account'>
            <h1>Cuentas</h1>
            <div className='search-container'>
                <input
                    type='text'
                    placeholder='Buscar...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <MdPersonSearch />
                <br />
            </div>

            <div>
                {allSearchResults.length > 0 && (
                    <ul className='search-results'>
                        {allSearchResults.map(user => (
                            <li key={user.id_User || user.id_Subscription} onClick={() => handleSelectUser(user)}>
                                {user.name_user}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedUser ? (
                <TableAccount userName={selectedUser.name_user} userInfo={selectedUser.name_user} />
            ) : (
                <p>Selecciona un usuario...</p>
            )}
        </div>
    );
}

export default Account;
