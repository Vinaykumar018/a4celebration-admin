import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const KundaliMatchingForm = ({ show, onClose, onSubmit, matchingToEdit }) => {
  const [formData, setFormData] = useState({ 
    contactNumber: "",
    email: "",
    address: "",
    matchingDetails: {
      groomName: "",
      groomDOB: "",
      groomTimeOfBirth: "",
      groomPlaceOfBirth: "",
      brideName: "",
      brideDOB: "",
      brideTimeOfBirth: "",
      bridePlaceOfBirth: ""
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (matchingToEdit) {
      setFormData({
        contactNumber: matchingToEdit.contactNumber || "",
        email: matchingToEdit.email || "",
        address: matchingToEdit.address || "",
        matchingDetails: matchingToEdit.matchingDetails || {
          groomName: "",
          groomDOB: "",
          groomTimeOfBirth: "",
          groomPlaceOfBirth: "",
          brideName: "",
          brideDOB: "",
          brideTimeOfBirth: "",
          bridePlaceOfBirth: ""
        }
      });
    } else {
      setFormData({
        contactNumber: "",
        email: "",
        address: "",
        matchingDetails: {
          groomName: "",
          groomDOB: "",
          groomTimeOfBirth: "",
          groomPlaceOfBirth: "",
          brideName: "",
          brideDOB: "",
          brideTimeOfBirth: "",
          bridePlaceOfBirth: ""
        }
      });
    }
  }, [matchingToEdit, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await onSubmit(formData);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMatchingDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      matchingDetails: {
        ...prev.matchingDetails,
        [name]: value
      }
    }));
  };

  if (!show) return null;

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{matchingToEdit ? 'Edit Kundali Matching' : 'Add New Kundali Matching'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <h6 className="mb-3">Contact Information</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <hr className="my-4" />

              <h6 className="mb-3">Groom Details</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Groom Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="groomName"
                    value={formData.matchingDetails.groomName}
                    onChange={handleMatchingDetailsChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="groomDOB"
                    value={formData.matchingDetails.groomDOB}
                    onChange={handleMatchingDetailsChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Time of Birth</label>
                  <input
                    type="time"
                    className="form-control"
                    name="groomTimeOfBirth"
                    value={formData.matchingDetails.groomTimeOfBirth}
                    onChange={handleMatchingDetailsChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Place of Birth</label>
                  <input
                    type="text"
                    className="form-control"
                    name="groomPlaceOfBirth"
                    value={formData.matchingDetails.groomPlaceOfBirth}
                    onChange={handleMatchingDetailsChange}
                    required
                  />
                </div>
              </div>

              <hr className="my-4" />

              <h6 className="mb-3">Bride Details</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Bride Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="brideName"
                    value={formData.matchingDetails.brideName}
                    onChange={handleMatchingDetailsChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="brideDOB"
                    value={formData.matchingDetails.brideDOB}
                    onChange={handleMatchingDetailsChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Time of Birth</label>
                  <input
                    type="time"
                    className="form-control"
                    name="brideTimeOfBirth"
                    value={formData.matchingDetails.brideTimeOfBirth}
                    onChange={handleMatchingDetailsChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Place of Birth</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bridePlaceOfBirth"
                    value={formData.matchingDetails.bridePlaceOfBirth}
                    onChange={handleMatchingDetailsChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-danger text-white" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success text-white" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner-border spinner-border-sm me-1" />
                    {matchingToEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  matchingToEdit ? 'Update' : 'Create'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KundaliMatchingForm;