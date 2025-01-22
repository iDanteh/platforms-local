import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal.jsx';
import ClientsForm from '../components/ClientForm.jsx'
import '../styles/Clients_Style.css';
import RegisterClient from '../components/RegisterClient.jsx';


function Clients() {
    const [isNavHidden, setIsNavHidden] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [clients, setClients] = useState([]);

    const handleToggleNav = (isHidden) => setIsNavHidden(isHidden);

    function loadClients() {
        try {
            //const clientesRegistrados = await fetchClients();
            window.electronAPI.getClients().then(response => {
                if (response.success)
                {
                    const clientesRegistrados = response.clients || [];
                    console.log('Datos de los clientes: ',clientesRegistrados);
                    setClients(clientesRegistrados);
                }
            }).catch(error => {
                console.error('Error al ejecutar viewClients:', error);
            });
        } catch (error) {
            console.error("Error al cargar los clientes:", error);
        }
    };

    useEffect(() => {
        console.log('useEffect:LoadClients');
        loadClients(); 
    }, []);

    const handleRegisterClient = async (formData) => {
        try {
            const response = await window.electronAPI.registerClient(formData);
            setModalMessage('Cliente registrado con éxito.');
            loadClients();
        } catch (error) {
            setModalMessage('Error al registrar cliente. Inténtalo de nuevo.');
        } finally {
            setIsModalOpen(true);
        }
    };

    const handleUpdateClient = async (updatedClient) =>{
        try {
            const response = await window.electronAPI.updateClient (updatedClient,updatedClient.id_User);
            setModalMessage('Cliente actualizado con éxito.');
            loadClients();
        } catch (error) {
            setModalMessage('Error al actualizar cliente');
        }finally{
            setIsModalOpen(true);
        }
    }

    const handleDeleteClient = async (delUser) =>{
        try {
            const response = await window.electronAPI.deleteClient(delUser);
            setModalMessage('Cliente eliminado con éxito.');
            loadClients();
        } catch (error) {
            setModalMessage('Error al eliminar cliente');
        }
    }

    return (
        <div className={`clients ${isNavHidden ? 'expanded' : ''}`}>
            <h1>Clientes</h1>
            <ClientsForm onSubmit={handleRegisterClient} />
            <div className="clients-list">
                {clients.length > 0 ? (
                    clients.map((client) => (
                        <RegisterClient key={client.id_User} client={client} onUpdateClient={handleUpdateClient} onDeleteClient={handleDeleteClient} loadClients={loadClients}/>
                    ))
                ) : (
                    <p>No hay clientes registrados.</p>
                )}
            </div>
            <Modal isOpen={isModalOpen} message={modalMessage} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

export default Clients;
