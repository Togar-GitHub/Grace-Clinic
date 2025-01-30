import ald from './AppointmentListDeleteModal.module.css';

function AppointmentListDeleteModal({ onClose, onConfirm }) {

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div 
      className={ald.modalOverlay}
      onClick={handleOverlayClick}
    >
      <div className={ald.modalContent}>
        <h1>Confirm Delete</h1>
        <h2>Are you sure you want to delete this Appointment?</h2>
        <div className={ald.buttonContainer}>
          <button onClick={onConfirm} className={ald.confirmButton}>Yes (Delete Appointment)</button>
          <button onClick={onClose} className={ald.cancelButton}>No (Keep Appointment)</button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentListDeleteModal;