import axiosInstance from './axiosInstance.js';
import { useState } from 'react';

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
    const phoneNumber = `521${phone_user}`;

    const reminderKey = `reminderSent_${id_Subscription}`;
    const expiredKey = `expiredSent_${id_Subscription}`;

    const reminderSent = localStorage.getItem(reminderKey);
    const expiredSent = localStorage.getItem(expiredKey);

    // Verificar si la suscripción ha caducado
    const daysRemaining = calculateDaysRemaining(new Date(), finish_date);
    if (daysRemaining.includes('Vencida')) {
        if (!expiredSent) {
            // Si no se ha enviado el mensaje de caducidad, lo enviamos
            const message = `🚨✨ *Hola ${name_user}* , tu suscripción a *🎥${platform}* ha caducado.
            ⏳ *Fecha de caducidad*: *${new Date(finish_date).toLocaleDateString()}*
            💡 ¡Renueva y sigue disfrutando de tus servicios favoritos! 🎶💻
            ¡Gracias por ser parte de nuestra comunidad! 🌟🎥.`;

            try {
                await window.electronAPI.sendWhatsappMessage({ phoneNumber: phoneNumber, message: message });
                console.log('Mensaje de caducidad enviado a', name_user);
                localStorage.setItem(expiredKey, 'true');
            } catch (error) {
                console.error('Error al enviar el mensaje de caducidad de WhatsApp:', error);
            }
        } else {
            console.log(`El mensaje de caducidad ya fue enviado a ${name_user}`);
        }
        return;
    }

    if (parseInt(daysRemaining) <= 2) {
        if (reminderSent) {
            console.log(`Recordatorio ya enviado para ${name_user}`);
            return; 
        }

        const message = `🚨✨ *Hola ${name_user}* , te recordamos que tu suscripción de *🎥${platform}* está por finalizar 
        ⏳*Disfrútala hasta*: *${new Date(finish_date).toLocaleDateString()}* 
        💡 ¡Renueva y sigue disfrutando de tus servicios favoritos! 🎶💻
        ¡Gracias por ser parte de nuestra comunidad! 🌟🎥.`;

        try {
            await window.electronAPI.sendWhatsappMessage({ phoneNumber: phoneNumber, message: message });
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
