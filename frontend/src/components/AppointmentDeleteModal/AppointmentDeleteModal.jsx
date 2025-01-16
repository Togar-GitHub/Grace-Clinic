import amd from './AppointmentDeleteModal.module.css';

function AppointmentDeleteModal({ onClose, onConfirm }) {

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div 
      className={amd.modalOverlay}
      onClick={handleOverlayClick}
    >
      <div className={amd.modalContent}>
        <h1>Confirm Delete</h1>
        <h2>Are you sure you want to delete this Appointment?</h2>
        <div className={amd.buttonContainer}>
          <button onClick={onConfirm} className={amd.confirmButton}>Yes (Delete Appointment)</button>
          <button onClick={onClose} className={amd.cancelButton}>No (Keep Appointment)</button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDeleteModal;