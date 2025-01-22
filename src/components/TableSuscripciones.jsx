import React, { useEffect, useState } from 'react';
import { calculateDaysRemaining, handleAutoReminder} from '../services/suscripcionService';
import { FaWhatsapp, FaEdit  } from 'react-icons/fa';
import Modal from '../components/Modal.jsx';
import ModalUpdate from '../components/ModalUpdateSub.jsx'
import '../styles/TableSuscripciones.css';

const TableSuscripciones = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [clickedRows, setClickedRows] = useState({});
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [modals, setModals] = useState({ isModalOpen: false, isUpdateModalOpen: false });

    const fetchSubscriptions = async () => {
        try {
            const response = await window.electronAPI.getAllSubscriptions();
            setSubscriptions(response);
        } catch (error) {
            console.error('Error al obtener suscripciones:', error);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    useEffect(() => {
        subscriptions.forEach((subscription) => {
            handleAutoReminder(subscription, window.electronAPI.sendWhatsappMessage);
        });
    }, [subscriptions]);

    const handleEditClick = (subscription) => {
        setSelectedSubscription(subscription);
        setModals({ ...modals, isUpdateModalOpen: true });
    };

    const handleUpdateSubscription = async (updatedData) => {
        try {
            const response = await window.electronAPI.updateSubscription(updatedData);
            if (response) {
                setSubscriptions((prev) =>
                    prev.map((sub) =>
                        sub.id_Subscription === updatedData.id_Subscription ? updatedData : sub
                    )
                );
                setModals({ ...modals, isUpdateModalOpen: false });
            }
        } catch (error) {
            console.error('Error al actualizar la suscripción:', error);
        }
    };
    /*Whatsapp */
    const handleIconClick = async (subscription) => {
        const phone = `521${subscription.phone_user.replace(/\D/g, '')}`; // Formatear número con el prefijo 521
        const message = `
            Hola ${subscription.name_user},
            Te compartimos los detalles de tu suscripción:
            - Plataforma: ${subscription.platform}
            - Perfil: ${subscription.perfil}
            - Contraseña: ${subscription.password}
            - Fecha Inicio: ${new Date(subscription.start_date).toLocaleDateString()}
            - Fecha Fin: ${new Date(subscription.finish_date).toLocaleDateString()}
            - Estado: ${subscription.state}
            - Días Restantes: ${calculateDaysRemaining(subscription.start_date, subscription.finish_date)}

            ¡Gracias por confiar en nosotros!`;

        try {
            // Enviar mensaje a través del API de Electron
            const response = await window.electronAPI.sendWhatsappMessage({ phoneNumber: phone, message: message });

            if (response.success) {
                console.log('Mensaje enviado correctamente')
            } else {
                console.log(response.message)
            }
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        } finally {
            setModals({ ...modals, isModalOpen: false });
            setSelectedSubscription(null);
        }
    };


    return (
        <div className="table-container">
            <table className="subscriptions-table">
                <thead>
                    <tr>
                        <th>Teléfono</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Plataforma</th>
                        <th>Perfil</th>
                        <th>Contraseña</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Estado</th>
                        <th>Días Restantes</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.length > 0 ? (
                        subscriptions.map((sub) => (
                            <tr key={sub.id_Subscription}>
                                <td>{sub.phone_user}</td>
                                <td>{sub.name_user}</td>
                                <td>{sub.email}</td>
                                <td>{sub.platform}</td>
                                <td>{sub.perfil}</td>
                                <td>{sub.password}</td>
                                <td>{new Date(sub.start_date).toLocaleDateString()}</td>
                                <td>{new Date(sub.finish_date).toLocaleDateString()}</td>
                                <td>{sub.state}</td>
                                <td>{calculateDaysRemaining(sub.start_date, sub.finish_date)}</td>
                                <td>
                                    <button
                                        className="icon-button"
                                        onClick={() => handleEditClick(sub)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                            className={`icon-button ${clickedRows[sub.id_Subscription] ? 'clicked' : ''}`}
                                            onClick={() => handleIconClick(sub)}
                                        >
                                            <FaWhatsapp />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">No hay suscripciones registradas.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <ModalUpdate
                isOpen={modals.isUpdateModalOpen}
                subscription={selectedSubscription}
                onClose={() => setModals({ ...modals, isUpdateModalOpen: false })}
                onUpdate={handleUpdateSubscription}
            />
        </div>
    );
};

export default TableSuscripciones;
