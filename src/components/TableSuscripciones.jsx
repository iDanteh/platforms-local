import React, { useEffect, useState } from 'react';
import { getSubscription, sendWhatsAppMessage, updateSubscription, calculateDaysRemaining, handleAutoReminder, useLocalStorage } from '../services/suscripcionService';
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
