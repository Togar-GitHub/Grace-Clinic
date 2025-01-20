import ctd from './ChartingPageDeleteModal.module.css';

function ChartingPageDeleteModal({ onClose, onConfirm }) {

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div 
      className={ctd.modalOverlay}
      onClick={handleOverlayClick}
    >
      <div className={ctd.modalContent}>
        <h1>Confirm Delete</h1>
        <h2>Are you sure you want to delete this Chart?</h2>
        <div className={ctd.buttonContainer}>
          <button onClick={onConfirm} className={ctd.confirmButton}>Yes (Delete Chart)</button>
          <button onClick={onClose} className={ctd.cancelButton}>No (Keep Chart)</button>
        </div>
      </div>
    </div>
  );
}

export default ChartingPageDeleteModal;