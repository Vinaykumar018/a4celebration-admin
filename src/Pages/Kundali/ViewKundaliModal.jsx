import React from 'react';

const ViewKundaliModal = ({ show, onClose, kundali }) => {
  if (!show || !kundali) return null;

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Kundali Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <h6>Basic Information</h6>
                <p><strong>Name:</strong> {kundali.name}</p>
                <p><strong>Gender:</strong> {kundali.gender}</p>
                <p><strong>Date of Birth:</strong> {kundali.dateOfBirth}</p>
                <p><strong>Time of Birth:</strong> {kundali.timeOfBirth}</p>
                <p><strong>Place of Birth:</strong> {kundali.placeOfBirth}</p>
              </div>
              <div className="col-md-6">
                <h6>Contact Information</h6>
                <p><strong>Contact Number:</strong> {kundali.contactNumber}</p>
                <p><strong>Email:</strong> {kundali.email}</p>
                <p><strong>Address:</strong> {kundali.address}</p>
                <p><strong>Language:</strong> {kundali.language}</p>
              </div>
            </div>

            <div className="mb-3">
              <h6>Description</h6>
              <p>{kundali.description || 'N/A'}</p>
            </div>

            <div className="mb-3">
              <h6>Status</h6>
              <span className={`badge rounded-pill px-3 py-1 ${
                kundali.status === 1 ? 'bg-success' : kundali.status === 0 ? 'bg-danger' : 'bg-warning'
              } text-white`}>
                {kundali.status === 1 ? 'Active' : kundali.status === 0 ? 'Cancelled' : 'Pending'}
              </span>
            </div>

            {kundali.transactionId && (
              <div className="mb-3">
                <h6>Transaction Details</h6>
                <p><strong>Status:</strong> {kundali.transactionStatus}</p>
                <p><strong>ID:</strong> {kundali.transactionId}</p>
                <p><strong>Amount:</strong> {kundali.transactionAmount}</p>
                <p><strong>Date:</strong> {kundali.transactionDate}</p>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-info text-white" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewKundaliModal;