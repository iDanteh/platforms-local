import React, { useState, useEffect } from 'react';
import { TiUser } from 'react-icons/ti';
import { TbPasswordUser } from 'react-icons/tb';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa el hook useAuth
import '../styles/Login_Style.css';

function Login() {
    const { login } = useAuth(); // Usa el hook para acceder a la función login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberEmail');
        const savedPassword = localStorage.getItem('rememberPassword');

        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setError('Por favor, llena todos los campos.');
            return;
        }

        try {
            const response = await window.electronAPI.login(email, password);

            if (response.success) {
                login(email, password); // Llama a la función login del contexto

                if (rememberMe) {
                    localStorage.setItem('rememberEmail', email);
                    localStorage.setItem('rememberPassword', password);
                } else {
                    localStorage.removeItem('rememberEmail');
                    localStorage.removeItem('rememberPassword');
                }

                navigate('/dashboard'); // Redirigir a /dashboard si el login es exitoso
            } else {
                setError(response.message);
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            setError('Error interno del servidor.');
        }
    };

    return (
        <div className='login-container'>
            <div className="form-section">
                <form onSubmit={handleLogin}>
                    <h1>Inicia sesión</h1>

                    {error && <p className="error-message">{error}</p>}

                    <div className='input-box'>
                        <label htmlFor="correo">Correo</label>
                        <input
                            type="email"
                            placeholder='ejemplo@gmail.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TiUser className='icon' />
                    </div>

                    <div className='input-box'>
                        <label htmlFor="contraseña">Contraseña</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='password123'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {showPassword ? (
                            <FaEyeSlash
                                className="icon"
                                onClick={() => setShowPassword(false)}
                            />
                        ) : (
                            <FaEye
                                className="icon"
                                onClick={() => setShowPassword(true)}
                            />
                        )}
                    </div>

                    <div className='check-box'>
                        <div className='checkbox-container'>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember">Recordar contraseña?</label>
                            <br />
                        </div>
                        <div className='register-link'>
                            <p>No te has registrado? <span onClick={() => navigate('/register')}>Registrarse</span></p>
                        </div>
                    </div>

                    <button type="submit">Iniciar sesión</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
