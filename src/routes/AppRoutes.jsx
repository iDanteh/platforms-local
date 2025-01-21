import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Clients from "../pages/Clients.jsx";     
import Suscripciones from '../pages/Suscripciones.jsx';
import RegisterAdmin from '../pages/RegisterAdmin.jsx';
import Account from '../pages/Account.jsx';

function Logout() {
    const { logout } = useAuth();

    React.useEffect(() => {
        logout();
    }, [logout]);

    return <Navigate to="/" replace />;
}

function AppRouter() {
    const { isAuthenticated } = useAuth();
    const [selectedPlatform, setSelectedPlatform] = useState('');

    return (
        <Routes>
            {isAuthenticated ? (
                <>
                    <Route path="/dashboard" element={<Dashboard setSelectedPlatform={setSelectedPlatform} />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/suscripciones" element={<Suscripciones selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform} />} />
                    <Route path="/cuentas" element={<Account />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </>
            ) : (
                <>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<RegisterAdmin />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </>
            )}
        </Routes>
    );
}

export default AppRouter;
