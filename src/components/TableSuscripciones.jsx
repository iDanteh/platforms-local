import React, { useEffect, useState } from 'react';
import { getSubscription, sendWhatsAppMessage, updateSubscription, calculateDaysRemaining, handleAutoReminder, useLocalStorage } from '../services/suscripcionService';
import { FaWhatsapp, FaEdit  } from 'react-icons/fa';
import Modal from '../components/Modal.jsx';
import ModalUpdate from '../components/ModalUpdateSub.jsx'
import '../styles/TableSuscripciones.css';

const TableSuscripciones = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [clickedRows, setClickedRows] = useLocalStorage('clickedRows', {});
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [modals, setModals] = useState({ isModalOpen: false, isUpdateModalOpen: false });

    const [updatedSubscription, setUpdatedSubscription] = useState(null);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await getSubscription();
                if (response && Array.isArray(response)) {
                    setSubscriptions(response);
                    response.forEach((sub) => {
                        const daysRemaining = parseInt(calculateDaysRemaining(sub.start_date, sub.finish_date));
                        if (!isNaN(daysRemaining) && daysRemaining > 0 && daysRemaining < 3) {
                            handleAutoReminder(sub, sendWhatsAppMessage);
                        }
                    });
                }
            } catch (error) {
                console.error('Error al obtener suscripciones:', error);
            }
        };
    
        fetchSubscriptions();
    }, []);    

    const handleIconClick = (subscription) => {
        setSelectedSubscription(subscription);
        setModals({ ...modals, isModalOpen: true });
    };

    const handleEditClick = (subscription) => {
        setUpdatedSubscription(subscription);
        setModals({ ...modals, isUpdateModalOpen: true });
    };

    const handleConfirmSendMessage = async () => {
        if (selectedSubscription) {
            const { id_Subscription, phone_user, name_user, start_date, finish_date, platform, perfil, password, state, email } = selectedSubscription;
            const phoneNumber = `521${phone_user}@c.us`;
            const message = `Hola ${name_user}, aquí tienes la información de tu suscripción:\n- Usuario: ${name_user}\n- Correo: ${email}\n- Plataforma: ${platform}\n- Perfil: ${perfil}\n- Contraseña: ${password}\n- Fecha de Inicio: ${new Date(start_date).toLocaleDateString()}\n- Fecha de Fin: ${new Date(finish_date).toLocaleDateString()}\n- Estado: ${state}`;

            try {
                await sendWhatsAppMessage({ to: phoneNumber, message });
                setClickedRows((prev) => {
                    const updatedRows = { ...prev, [id_Subscription]: true };
                    return updatedRows;
                });
            } catch (error) {
                console.error('Error al enviar el mensaje de WhatsApp:', error);
            } finally {
                setModals({ ...modals, isModalOpen: false });
                setSelectedSubscription(null);
            }
        }
    };

    const handleUpdateSubscription = async (updatedData) => {
        try {
            const response = await updateSubscription(updatedData);
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

            <Modal
                isOpen={modals.isModalOpen}
                title="Confirmar Envío"
                message="¿Deseas enviar un mensaje de WhatsApp a este usuario?"
                onClose={() => setModals({ ...modals, isModalOpen: false })}
                onConfirm={handleConfirmSendMessage}
                showConfirmButton={true}
                confirmText="Enviar"
            />

            <ModalUpdate
                isOpen={modals.isUpdateModalOpen}
                subscription={updatedSubscription}
                onClose={() => setModals({ ...modals, isUpdateModalOpen: false })}
                onUpdate={handleUpdateSubscription}
            />
        </div>
    );
};

export default TableSuscripciones;
