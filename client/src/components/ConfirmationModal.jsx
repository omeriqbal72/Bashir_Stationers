import React from 'react';
import '../css/confirmationModal.css'; // Import the CSS file for styling

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-modal-overlay">
            <div className="confirmation-modal">
                <h3>Confirm Deletion</h3>
                <p>Do you really want to delete this product?</p>
                <div className="confirmation-buttons">
                    <button onClick={onConfirm} className="confirm-button">Confirm</button>
                    <button onClick={onClose} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
