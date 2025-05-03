import React from 'react';

const DeleteConfirmationModal = ({ item, onConfirm, onCancel, itemType = 'item' }) => {
  if (!item) return null;

  return (
    <div className="modal fade" id="deleteConfirmationModal" tabIndex="-1" role="dialog" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="deleteConfirmationModalLabel">Confirm Delete</h5>
            <button 
              className="btn-close py-0" 
              type="button" 
              onClick={onCancel}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this {itemType} <strong>{item.name}</strong>? This action cannot be undone.</p>
          </div>
          <div className="modal-footer">
            <button 
              className="btn btn-secondary" 
              type="button" 
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger" 
              type="button" 
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;