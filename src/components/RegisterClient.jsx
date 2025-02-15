import React, {useState} from 'react';
import Modal from '../components/Modal.jsx';

function RegisterClient({ client,onUpdateClient, loadClients }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [informacionModal, setInfoModal] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editData, setEditData] = useState(false);
    const [editClient, setEditClient] = useState(client);

    const handleInfoClient = () => setInfoModal(true);
    const handleCloseInfoClient = () => {
        setInfoModal(false); setEditData(false);setEditClient(client)};


    const handleEdit = () => setEditData(true);

    const handleChange = (e) => {
        const {name,value} = e.target;
        setEditClient((prev) => ({...prev,[name]:value}));
    }

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await window.electronAPI.deleteClient(client.id_User);
            if (response.success) {
                setModalMessage('Cliente eliminado con éxito.');
                loadClients();
            } 
        } catch (error) {
            setModalMessage('error al eliminar cliente.');
        }
        setIsDeleteModalOpen(false);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

const handleUpdateClient = async () => {
    
    onUpdateClient(editClient);
    setEditData(false);
    setInfoModal(false);
    loadClients();
    //console.log('editClient:',editClient);
}
    return (
        <>
            <div className="client-item" onClick={handleInfoClient}>
                <span>{`${client.nombre_user} ${client.apellido_pat} ${client.apellido_mat}`}</span>
                <button className='btn-icon-trash'onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick();
                }}>
                    <img src="../src/assets/svg/bxs-trash-alt.svg"/>
                </button>
            </div>

            {informacionModal && (
                <div className="modal-info-client">
                    <div className="modal">
                        <h3>Información del Cliente</h3>
                        <br />
                        {editData ? (
                            <>
                                <input
                                    type="text"
                                    name="nombre_user"
                                    value={editClient.nombre_user}
                                    onChange={handleChange}
                                    placeholder="Nombre"
                                />
                                <input
                                    type="text"
                                    name="apellido_pat"
                                    value={editClient.apellido_pat}
                                    onChange={handleChange}
                                    placeholder="Apellido Paterno"
                                />
                                <input
                                    type="text"
                                    name="apellido_mat"
                                    value={editClient.apellido_mat}
                                    onChange={handleChange}
                                    placeholder="Apellido Materno"
                                />
                                <input
                                    type="text"
                                    name="phone_user"
                                    value={editClient.phone_user}
                                    onChange={handleChange}
                                    placeholder="Teléfono"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={editClient.email}
                                    onChange={handleChange}
                                    placeholder="Correo"
                                />
                                <button onClick={handleUpdateClient}>Actualizar</button>
                            </>
                        ) : (
                            <>
                                <p>
                                    <strong>Nombre:</strong>{' '}
                                    {`${client.nombre_user} ${client.apellido_pat} ${client.apellido_mat}`}
                                </p>
                                <p>
                                    <strong>Teléfono:</strong> {client.phone_user}
                                </p>
                                <p>
                                    <strong>Correo:</strong> {client.email}
                                </p>
                                <br />
                                <button onClick={handleEdit}>Editar</button>
                            </>
                        )}
                        <button onClick={handleCloseInfoClient}>Cerrar</button>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="modal-delete">
                    <div className="modal-del">
                        <p>¿Estás seguro de que deseas eliminar a {client.nombre_user}?</p>
                        <button onClick={handleConfirmDelete}>Sí</button>
                        <button onClick={handleCancelDelete}>No</button>
                    </div>
                </div>
            )}
            <Modal isOpen={isModalOpen} message={modalMessage} onClose={() => setIsModalOpen(false)} />

        </>
    );
}

export default RegisterClient;
