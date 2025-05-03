import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaSpinner } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import { getCategories } from "../../Services/sliderApiService";

const MainSliderForm = ({ show, onClose, onSubmit, sliderToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({ 
    name: "", 
    image: null, 
    category: "" 
  });
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const result = await getCategories();
        if (result.status === 1) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategoryData();
  }, []);

  useEffect(() => {
    if (sliderToEdit) {
      setFormData({
        name: sliderToEdit.name || "",
        image: null,
        category: sliderToEdit.category || ""
      });
      setImagePreview(sliderToEdit.image || null);
    } else {
      setFormData({ name: "", image: null, category: "" });
      setImagePreview(null);
    }
  }, [sliderToEdit, show]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const form = new FormData();
      form.append("name", formData.name);
      if (formData.image) {
        form.append("image", formData.image);
      }
      form.append("category", formData.category);

      const success = await onSubmit(form);
      if (success) {
        onClose();
        onSuccess();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{sliderToEdit ? 'Edit Slider' : 'Add New Slider'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-control form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Slider Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!sliderToEdit}
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxWidth: '200px' }}
                    />
                  </div>
                )}
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
                    {sliderToEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  sliderToEdit ? 'Update' : 'Create'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MainSliderForm;