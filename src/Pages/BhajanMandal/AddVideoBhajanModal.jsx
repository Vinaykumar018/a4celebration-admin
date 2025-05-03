import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addVideo } from "../../Services/bhajanApiService";

const AddBhajanVideoModal = ({ id, onClose }) => {
  const [formData, setFormData] = useState({
    bhajan_mandal_id: id,
    video_url: "",
    title: "",
    date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await addVideo(formData);
           if (result.status === 1) {
             console.log('toast should run');
             toast.success('video added successfully!');
            
           } else {
             toast.error('video cannot be created!');
           }
      onClose();
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video. Please try again.");
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      tabIndex="-1"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Bhajan Video</h5>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={onClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
             
              <div className="form-group">
                <label>Video URL</label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="modal-footer mt-2">
                <button
                  type="button"
                  className="btn btn-danger text-white"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success text-white">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBhajanVideoModal;
