import dam from './DeleteAppointmentModal.module.css';

function DeleteAppointmentModal({ onClose, onConfirm }) {

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div 
      className={dam.modalOverlay}
      onClick={handleOverlayClick}
    >
      <div className={dam.modalContent}>
        <h1>Confirm Delete</h1>
        <h2>Are you sure you want to delete this Appointment?</h2>
        <div className={dam.buttonContainer}>
          <button onClick={onConfirm} className={dam.confirmButton}>Yes (Delete Appointment)</button>
          <button onClick={onClose} className={dam.cancelButton}>No (Keep Appointment)</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAppointmentModal;