import axiosInstance from './axiosInstance.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export const authServiceLogin = async (email, password) =>{
    try {
        const response = await axiosInstance.post("/admin/login", {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
};

export const useSocket = () => {
    const [qrCode, setQrCode] = useState('');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        socket.on('qr', (qr) => {
            setQrCode(qr);
            setIsReady(false);
        });

        socket.on('ready', () => {
            setQrCode('');
            setIsReady(true);
        });

        return () => {
            socket.off('qr');
            socket.off('ready');
        };
    }, []);

    return { qrCode, isReady };
};