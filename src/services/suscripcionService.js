import axiosInstance from './axiosInstance.js';
import { useState } from 'react';

// export const registerSubscription = async (formData) => {
//     try {
//         const response = await axiosInstance.post('/suscriptions', formData);
//         return response.data;
//     } catch (error) {
//         console.error('Error al registrar la suscripción:', error);
//         return { error: 'No se pudo registrar la suscripción. Inténtalo de nuevo más tarde.' };
//     }
// };

// export const getSubscription = async () => {
//     try {
//         const response = await axiosInstance.get('/suscriptions');
//         return response.data;
//     } catch (error) {
//         console.log(error);
//         return [];        
//     }
// };

// export const getSubscriptionNameUser = async (userId) => {
//     try {
//         const response = await axiosInstance.get('/suscriptions/search');
//         return response.data;
//     } catch (error) {
//         console.log(error);
//         return [];        
//     }
// };

// export const sendWhatsAppMessage = async ({ to, message }) => {
//     try {
//         const response = await axiosInstance.post('/send-message', { to, message });
//         return response.data;
//     } catch (error) {
//         console.error('Error al enviar mensaje de WhatsApp:', error);
//         throw error;
//     }
// };

// export const updateSubscription = async (id_Subscription, formData) => {
//     try {
//         // Verifica que el ID sea un número o una cadena válida
//         console.log('ID que se envía:', id_Subscription);

//         const response = await axiosInstance.put(`/suscriptions/${id_Subscription}`, formData);
//         return response.data;
//     } catch (error) {
//         console.error('Error al actualizar la suscripción:', error);
//         throw error;
//     }
// };

// utils.js
export const calculateDaysRemaining = (startDate, finishDate) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const end = new Date(finishDate).setHours(0, 0, 0, 0);

    if (end < today) return 'Vencida';

    const remainingTime = end - today;
    const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

    return `${remainingDays} días`;
};

export const handleAutoReminder = async (subscription, sendWhatsAppMessage) => {
    const { id_Subscription, phone_user, name_user, finish_date, platform } = subscription;
    const phoneNumber = `521${phone_user}@c.us`;

    const reminderKey = `reminderSent_${id_Subscription}`;
    const reminderSent = localStorage.getItem(reminderKey);

    if (reminderSent || calculateDaysRemaining(new Date(), finish_date).includes('Vencida')) {
        console.log(`Recordatorio ya enviado o suscripción vencida para ${name_user}`);
        return;
    }

    const daysRemaining = calculateDaysRemaining(new Date(), finish_date);
    if (parseInt(daysRemaining) < 3) {
        const message = `Hola ${name_user}, te recordamos que tu suscripción de ${platform} está por finalizar en menos de 3 días. Fecha de fin: ${new Date(finish_date).toLocaleDateString()}.`;

        try {
            await sendWhatsAppMessage({ to: phoneNumber, message });
            console.log('Recordatorio enviado a', name_user);
            localStorage.setItem(reminderKey, 'true');
        } catch (error) {
            console.error('Error al enviar el recordatorio de WhatsApp:', error);
        }
    }
};

// useLocalStorage.js
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from localStorage', error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage', error);
        }
    };

    return [storedValue, setValue];
};
