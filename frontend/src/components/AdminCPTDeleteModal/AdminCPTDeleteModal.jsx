import acd from './AdminCPTDeleteModal.module.css';

function AdminCPTDeleteModal({ onClose, onConfirm }) {

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div 
      className={acd.modalOverlay}
      onClick={handleOverlayClick}
    >
      <div className={acd.modalContent}>
        <h1>Confirm Delete</h1>
        <h2>Are you sure you want to delete this CPT Code?</h2>
        <div className={acd.buttonContainer}>
          <button onClick={onConfirm} className={acd.confirmButton}>Yes (Delete CPT Code)</button>
          <button onClick={onClose} className={acd.cancelButton}>No (Keep CPT Code)</button>
        </div>
      </div>
    </div>
  );
}

export default AdminCPTDeleteModal;