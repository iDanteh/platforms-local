import React, { useState, useEffect } from 'react';
import { updateSubscription } from '../services/suscripcionService';

const ModalUpdateSub = ({ isOpen, subscription, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        phone_user: '',
        name_user: '',
        platform: 'Netflix',
        perfil: '',
        password: '',
        start_date: '',
        finish_date: '',
        state: 'ACTIVO'  // Valor por defecto
    });

    useEffect(() => {
        if (subscription) {
            console.log('ID de la suscripción:', subscription.id_Subscription);
            setFormData({
                phone_user: subscription.phone_user,
                name_user: subscription.name_user,
                platform: subscription.platform || 'Netflix',
                perfil: subscription.perfil,
                password: subscription.password,
                start_date: subscription.start_date,
                finish_date: subscription.finish_date,
                state: subscription.state || 'ACTIVO'
            });
        }
    }, [subscription]);    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        console.log('handleSubmit ejecutado', subscription);

        if (!subscription?.id_Subscription) {
            console.error('ID de suscripción no válido:', subscription);
            setIsSubmitting(false);
            return;
        }

        try {
            console.log('Datos de la suscripción a actualizar:', formData);
            const updatedData = await updateSubscription(subscription.id_Subscription.toString(), formData);
            onUpdate(updatedData);
            onClose();
        } catch (error) {
            console.error('Error al actualizar la suscripción:', error);
        } finally {
            setIsSubmitting(false);
        }
    };   

    if (!isOpen) return null;

    return (
        <div className="modal_update_sub">
            <div className="modal_update">
                <h2>Actualizar Suscripción</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Teléfono:
                        <input
                            type="text"
                            name="phone_user"
                            value={formData.phone_user}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Usuario:
                        <input
                            type="text"
                            name="name_user"
                            value={formData.name_user}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Plataforma:
                        <select
                            name="platform"
                            value={formData.platform}
                            onChange={handleChange}
                        >
                            <option value="">---Seleccionar plataforma---</option>
                            <option value="Netflix">Netflix</option>
                            <option value="Office">Office</option>
                            <option value="HBO">HBO</option>
                            <option value="Disney">Disney</option>
                            <option value="Norton">Norton</option>
                            <option value="Youtube">Youtube</option>
                            <option value="Spotify">Spotify</option>
                            <option value="Amazon Prime">Amazon Prime</option>
                            <option value="Crunchyroll">Crunchyroll</option>
                            <option value="Apple TV">Apple TV</option>
                            <option value="Claro">Claro</option>
                            <option value="Paramount">Paramount+</option>
                            <option value="Star+">Star+</option>
                        </select>
                    </label>
                    <label>
                        Perfil:
                        <input
                            type="text"
                            name="perfil"
                            value={formData.perfil}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Contraseña:
                        <input
                            type="text"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Fecha de Inicio:
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Fecha de Fin:
                        <input
                            type="date"
                            name="finish_date"
                            value={formData.finish_date}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Estado:
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                        >
                            <option value="ACTIVO">ACTIVO</option>
                            <option value="INACTIVO">INACTIVO</option>
                            <option value="CANCELADO">CANCELADO</option>
                        </select>
                    </label>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Actualizando...' : 'Actualizar'}
                    </button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default ModalUpdateSub;
