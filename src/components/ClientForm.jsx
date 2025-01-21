import React, { useState, useEffect } from 'react';
import { generateEmailSuggestions, generatePasswordSuggestions } from '../utils/formUtils';

const ClientsForm = () => {
    const [formData, setFormData] = useState({
        nombre_user: "",
        apellido_pat: "",
        apellido_mat: "",
        phone_user: "",
        email: "",
        password: "",
    });

    const [emailSuggestion, setEmailSuggestion] = useState("");
    const [passwordSuggestion, setPasswordSuggestion] = useState("");

    // Actualiza los valores del formulario a medida que el usuario escribe
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Genera sugerencias de correo y contraseña en tiempo real
    useEffect(() => {
        if (formData.nombre_user && formData.apellido_pat && formData.apellido_mat && formData.phone_user) {
            const email = generateEmailSuggestions(formData);
            const password = generatePasswordSuggestions(formData);
            setEmailSuggestion(email);
            setPasswordSuggestion(password);
        }
    }, [formData]);

    // Envía el formulario
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Usa las sugerencias si los campos están vacíos
        const finalFormData = {
            ...formData,
            email: formData.email || emailSuggestion,
            password: formData.password || passwordSuggestion,
        };

        try {
            // Llama a la API de Electron para registrar al cliente
            const response = await window.electronAPI.registerClient(finalFormData);
            
            if (response.success) {
                console.log('Cliente registrado con éxito', response.id);
            } else {
                console.error('Error al registrar cliente:', response.error);
            }
        } catch (error) {
            console.error('Error en el frontend:', error);
        }

        // Limpia el formulario tras el registro
        setFormData({
            nombre_user: "",
            apellido_pat: "",
            apellido_mat: "",
            phone_user: "",
            email: "",
            password: "",
        });
        setEmailSuggestion("");
        setPasswordSuggestion("");
    };

    return (
        <form onSubmit={handleFormSubmit} className='formClient'>
            <div className='formDivClients1'>
                <div className='divData'>
                    <label htmlFor="iNombre">Nombre:</label>
                    <input
                        type="text"
                        name="nombre_user"
                        id="iNombre"
                        value={formData.nombre_user}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='divData'>
                    <label htmlFor="iApellidoPat">Apellido Paterno:</label>
                    <input
                        type="text"
                        name="apellido_pat"
                        id="iApellidoPat"
                        value={formData.apellido_pat}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='divData'>
                    <label htmlFor="iApellidoMat">Apellido Materno:</label>
                    <input
                        type="text"
                        name="apellido_mat"
                        id="iApellidoMat"
                        value={formData.apellido_mat}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className='formDivClients2'>
                <div className='divData'>
                    <label htmlFor="iPhone">Teléfono:</label>
                    <input
                        type="text"
                        name="phone_user"
                        id="iPhone"
                        value={formData.phone_user}
                        onChange={handleChange}
                        pattern='[0-9]{10}'
                        required
                    />
                </div>

                <div className='divData'>
                    <label htmlFor="iEmail">Correo Electrónico:</label>
                    <input
                        type="email"
                        name="email"
                        id="iEmail"
                        value={formData.email || emailSuggestion}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='divData'>
                    <label htmlFor="iPassword">Contraseña:</label>
                    <input
                        type="text"
                        name="password"
                        id="iPassword"
                        value={formData.password || passwordSuggestion}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <button type="submit" className='btn-submit'>Agregar</button>
            <br />
        </form>
    );
};

export default ClientsForm;
