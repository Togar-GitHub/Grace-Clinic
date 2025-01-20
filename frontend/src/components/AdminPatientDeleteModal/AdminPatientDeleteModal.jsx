import pdm from './AdminPatientDeleteModal.module.css';

function AdminPatientDeleteModal({ onClose, onConfirm }) {

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div 
      className={pdm.modalOverlay}
      onClick={handleOverlayClick}
    >
      <div className={pdm.modalContent}>
        <h1>Confirm Delete</h1>
        <h2>Are you sure you want to delete this Staff Record?</h2>
        <div className={pdm.buttonContainer}>
          <button onClick={onConfirm} className={pdm.confirmButton}>Yes (Delete Staff)</button>
          <button onClick={onClose} className={pdm.cancelButton}>No (Keep Staff)</button>
        </div>
      </div>
    </div>
  );
}

export default AdminPatientDeleteModal;