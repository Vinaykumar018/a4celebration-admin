import React from 'react';

const ViewKundaliMatchingModal = ({ show, onClose, matching }) => {
  if (!show || !matching) return null;

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Kundali Matching Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <h6>Contact Information</h6>
                <p><strong>Contact Number:</strong> {matching.contactNumber}</p>
                <p><strong>Email:</strong> {matching.email}</p>
                <p><strong>Address:</strong> {matching.address}</p>
              </div>
              <div className="col-md-6">
                <h6>Status</h6>
                <span className={`badge rounded-pill px-3 py-1 ${
                  matching.status === 1 ? 'bg-success' : 'bg-warning'
                } text-white`}>
                  {matching.status === 1 ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <h6>Groom Details</h6>
                <p><strong>Name:</strong> {matching.matchingDetails?.groomName || 'N/A'}</p>
                <p><strong>Date of Birth:</strong> {matching.matchingDetails?.groomDOB || 'N/A'}</p>
                <p><strong>Time of Birth:</strong> {matching.matchingDetails?.groomTimeOfBirth || 'N/A'}</p>
                <p><strong>Place of Birth:</strong> {matching.matchingDetails?.groomPlaceOfBirth || 'N/A'}</p>
              </div>
              <div className="col-md-6">
                <h6>Bride Details</h6>
                <p><strong>Name:</strong> {matching.matchingDetails?.brideName || 'N/A'}</p>
                <p><strong>Date of Birth:</strong> {matching.matchingDetails?.brideDOB || 'N/A'}</p>
                <p><strong>Time of Birth:</strong> {matching.matchingDetails?.brideTimeOfBirth || 'N/A'}</p>
                <p><strong>Place of Birth:</strong> {matching.matchingDetails?.bridePlaceOfBirth || 'N/A'}</p>
              </div>
            </div>
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

export default ViewKundaliMatchingModal;