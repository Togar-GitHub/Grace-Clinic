import asd from './AdminServiceDeleteModal.module.css';

function AdminServiceDeleteModal({ onClose, onConfirm }) {

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div 
      className={asd.modalOverlay}
      onClick={handleOverlayClick}
    >
      <div className={asd.modalContent}>
        <h1>Confirm Delete</h1>
        <h2>Are you sure you want to delete this Service Record?</h2>
        <div className={asd.buttonContainer}>
          <button onClick={onConfirm} className={asd.confirmButton}>Yes (Delete Service)</button>
          <button onClick={onClose} className={asd.cancelButton}>No (Keep Service)</button>
        </div>
      </div>
    </div>
  );
}

export default AdminServiceDeleteModal;