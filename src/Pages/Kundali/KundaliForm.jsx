import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const KundaliForm = ({ show, onClose, onSubmit, kundaliToEdit }) => {
  const [formData, setFormData] = useState({ 
    name: "",
    gender: "Male",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    contactNumber: "",
    email: "",
    address: "",
    description: "",
    language: "Hindi"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (kundaliToEdit) {
      setFormData({
        name: kundaliToEdit.name || "",
        gender: kundaliToEdit.gender || "Male",
        dateOfBirth: kundaliToEdit.dateOfBirth || "",
        timeOfBirth: kundaliToEdit.timeOfBirth || "",
        placeOfBirth: kundaliToEdit.placeOfBirth || "",
        contactNumber: kundaliToEdit.contactNumber || "",
        email: kundaliToEdit.email || "",
        address: kundaliToEdit.address || "",
        description: kundaliToEdit.description || "",
        language: kundaliToEdit.language || "Hindi"
      });
    } else {
      setFormData({
        name: "",
        gender: "Male",
        dateOfBirth: "",
        timeOfBirth: "",
        placeOfBirth: "",
        contactNumber: "",
        email: "",
        address: "",
        description: "",
        language: "Hindi"
      });
    }
  }, [kundaliToEdit, show]);

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

  if (!show) return null;

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{kundaliToEdit ? 'Edit Kundali' : 'Add New Kundali'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-control"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Time of Birth</label>
                  <input
                    type="time"
                    className="form-control"
                    name="timeOfBirth"
                    value={formData.timeOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Place of Birth</label>
                  <input
                    type="text"
                    className="form-control"
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
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
              </div>

              <div className="row">
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
                <div className="col-md-6 mb-3">
                  <label className="form-label">Language</label>
                  <select
                    className="form-control"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    required
                  >
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Gujarati">Gujarati</option>
                  </select>
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

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
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
                    {kundaliToEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  kundaliToEdit ? 'Update' : 'Create'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KundaliForm;