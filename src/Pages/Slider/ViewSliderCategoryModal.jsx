import React from "react";

const ViewSliderCategoryModal = ({ show, onClose, category }) => {
  if (!show || !category) return null;

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Category Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-4 fw-bold">Name:</div>
              <div className="col-md-8">{category.name}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4 fw-bold">Status:</div>
              <div className="col-md-8">
                <span className={`badge ${category.status ? 'bg-success' : 'bg-danger'}`}>
                  {category.status ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4 fw-bold">Image:</div>
              <div className="col-md-8">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="img-thumbnail" 
                    style={{ maxWidth: '200px' }}
                  />
                ) : (
                  'No image available'
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger text-white" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSliderCategoryModal;