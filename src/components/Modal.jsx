import React from 'react';
import '../styles/Modal_Style.css';

const Modal = ({ isOpen, title, message, onClose, onConfirm, showConfirmButton = false, confirmText = 'Confirmar', closeText = 'Cerrar', customFooter }) => {
    if (!isOpen) return null; // Si el modal no está abierto, no renderiza nada

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {title && <h2 className="modal-title">{title}</h2>}
                {message && <p className="modal-message">{message}</p>}
                <div className="modal-actions">
                    {customFooter ? (
                        customFooter
                    ) : (
                        <>
                            {showConfirmButton && (
                                <button className="modal-confirm" onClick={onConfirm}>
                                    {confirmText}
                                </button>
                            )}
                            <button className="modal-close" onClick={onClose}>
                                {closeText}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
