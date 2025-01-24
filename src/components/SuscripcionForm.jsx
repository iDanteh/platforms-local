import React, { useEffect, useState } from 'react';
import { generateProfileSuggestion, generatePasswordSuggestion } from '../utils/formUtils'
import Modal from '../components/Modal.jsx';

const SuscripcionForm = ({ selectedPlatform, setSelectedPlatform, userInfo }) => {
    const [perfil, setPerfil] = useState('');
    const [password, setPassword] = useState('');
    const [finishDate, setFinishDate] = useState('');

    const [profileSuggestion, setProfileSuggestion] = useState('');
    const [passwordSuggestion, setPasswordSuggestion] = useState('');
    const [subscriptions, setSubscriptions] = useState([]);

    // Estado del modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [showConfirmButton, setShowConfirmButton] = useState(false);

    // Genera sugerencias de perfil y contraseña en tiempo real
    useEffect(() => {
        if (userInfo) {
            const profile = generateProfileSuggestion(userInfo);
            const pass = generatePasswordSuggestion(userInfo);
            setProfileSuggestion(profile);
            setPasswordSuggestion(pass);
        }
    }, [userInfo]);

    const handleChange = (e) => {
        const platformId = e.target.value;
        const platformName = e.target.options[e.target.selectedIndex].text;
    
        setSelectedPlatform({ id: platformId, name: platformName });
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que haya un usuario seleccionado
        if (!userInfo) {
            setModalTitle('Error');
            setModalMessage('Por favor, selecciona un usuario.');
            setShowConfirmButton(false);
            setModalIsOpen(true);
            return;
        }

        if (!selectedPlatform?.id) {
            setModalTitle('Error');
            setModalMessage('Por favor, selecciona una plataforma.');
            setShowConfirmButton(false);
            setModalIsOpen(true);
            return;
        }

        // Construir el objeto JSON con los datos del formulario
        const formData = {
            fk_user: userInfo.id_User,
            fk_Platform: selectedPlatform.id,
            perfil: perfil || profileSuggestion,
            password: password || passwordSuggestion,
            start_date: new Date().toISOString().split('T')[0],
            finish_date: finishDate,
            state: 'ACTIVO',
            phone_user: userInfo.phone_user,
            platform: selectedPlatform.name,
            name_user: userInfo.nombre_user,
            email: userInfo.email
        };
        console.log('Form data:', formData);

        // Llamar a la función del servicio para registrar la suscripción
        try {
            const response = await window.electronAPI.registerNewSubscription(formData);
            if (response?.error) {
                setModalTitle('Error');
                setModalMessage('Error al registrar la suscripción.');
                setShowConfirmButton(false);
            } else {
                setModalTitle('Éxito');
                setModalMessage('Suscripción registrada con éxito.');
                setShowConfirmButton(true);
            }
        
            setModalIsOpen(true);
        } catch (error) {
            console.log('Error al registrar la suscripción:', error);
        }
    };

    
    return (
        <div className='form-suscripcion'>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="Plataforma">Plataforma</label>
                    <select 
                        name="platforms" 
                        id="plat-select" 
                        value={selectedPlatform?.id || ''}
                        onChange={handleChange}>
                            <option value="">---Seleccionar plataforma---</option>
                            <option value="1">Netflix</option>
                            <option value="2">Office</option>
                            <option value="3">HBO</option>
                            <option value="4">Disney</option>
                            <option value="5">Norton</option>
                            <option value="6">Youtube</option>
                            <option value="7">Spotify</option>
                            <option value="8">Amazon Prime</option>
                            <option value="9">Crunchyroll</option>
                            <option value="10">Apple TV</option>
                            <option value="11">Claro</option>
                            <option value="12">Paramount+</option>
                            <option value="13">Star+</option>
                            <option value="14">Viki Rakuten</option>
                    </select>
                    <label htmlFor="Tiempo">Tiempo de suscripción</label>
                    <input
                        type="date"
                        name="tiempo"
                        id="tiempo-select"
                        value={finishDate}
                        onChange={(e) => setFinishDate(e.target.value)}
                    />

                    <label htmlFor="Perfil">Perfil</label>
                    <input
                        type="text"
                        name="perfil"
                        id="perfil-select"
                        value={perfil || profileSuggestion}
                        onChange={(e) => setPerfil(e.target.value)}
                    />

                    <label htmlFor="Contraseña">Contraseña</label>
                    <input
                        type="text"
                        name="contraseña"
                        id="contraseña-select"
                        value={password || passwordSuggestion}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">Registrar</button>
                </form>

                <Modal
                isOpen={modalIsOpen}
                title={modalTitle}
                message={modalMessage}
                onClose={() => setModalIsOpen(false)} // Cerrar modal
                onConfirm={() => setModalIsOpen(false)} // Confirmar (opcional)
                showConfirmButton={showConfirmButton} // Solo muestra el botón si es necesario
            />
            </div>
    );
};

export default SuscripcionForm;