import sdm from './AdminStaffDeleteModal.module.css';

function AdminStaffDeleteModal({ onClose, onConfirm }) {

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div 
      className={sdm.modalOverlay}
      onClick={handleOverlayClick}
    >
      <div className={sdm.modalContent}>
        <h1>Confirm Delete</h1>
        <h2>Are you sure you want to delete this Staff Record?</h2>
        <div className={sdm.buttonContainer}>
          <button onClick={onConfirm} className={sdm.confirmButton}>Yes (Delete Staff)</button>
          <button onClick={onClose} className={sdm.cancelButton}>No (Keep Staff)</button>
        </div>
      </div>
    </div>
  );
}

export default AdminStaffDeleteModal;