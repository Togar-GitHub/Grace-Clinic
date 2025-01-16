import rmd from './ReviewDeleteModal.module.css';

function ReviewDeleteModal({ onClose, onConfirm }) {

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div 
      className={rmd.modalOverlay}
      onClick={handleOverlayClick}
    >
      <div className={rmd.modalContent}>
        <h1>Confirm Delete</h1>
        <h2>Are you sure you want to delete this Review?</h2>
        <div className={rmd.buttonContainer}>
          <button onClick={onConfirm} className={rmd.confirmButton}>Yes (Delete Review)</button>
          <button onClick={onClose} className={rmd.cancelButton}>No (Keep Review)</button>
        </div>
      </div>
    </div>
  );
}

export default ReviewDeleteModal;