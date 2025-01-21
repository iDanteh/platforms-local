import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal.jsx';
import RegisterForm from '../components/RegisterForm.jsx';
import '../styles/RegisterAdmin_Style.css';
import { registerAdmin} from '../services/adminService.js';
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
function RegisterAdmin(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();
    const handleRegisterAdmin = async (formData) => {
        try {
            const response = await registerAdmin(formData);
            setModalMessage('Administrador registrado con éxito.');
        } catch (error) {
            setModalMessage('Error al registrar administrador');
        } finally {
            setIsModalOpen(true);
        }
    };
    return (
        <div className='div-register-admin'>
            <div className='div-head'>
                <IoArrowBackCircle className='back-icon' onClick={() => navigate('/')}></IoArrowBackCircle>
                <h1>Registrate</h1>
            </div>
            
            <br />
            <RegisterForm onSubmit={handleRegisterAdmin}/>
            <Modal isOpen={isModalOpen} message={modalMessage} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
export default RegisterAdmin;