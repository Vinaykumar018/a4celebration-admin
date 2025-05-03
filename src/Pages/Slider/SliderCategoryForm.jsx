import React, { useState, useEffect } from "react";
import { createCategory, UpdateSliderCategory } from "../../Services/sliderApiCategoryService";
import { toast } from 'react-toastify';
import Loader from "../../Component/Loader";

const SliderCategoryForm = ({ show, onClose, categoryToEdit, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (categoryToEdit?.image) {
      setImagePreview(categoryToEdit.image);
    } else {
      setImagePreview(null);
    }
  }, [categoryToEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      if (categoryToEdit) {
        const result = await UpdateSliderCategory(categoryToEdit._id, formData);
        if (result.status === 1) {
          toast.success("Category updated successfully!");
          onSuccess();
          onClose();
        } else {
          toast.error(result.message || "Failed to update category");
        }
      } else {
        const result = await createCategory(formData);
        if (result.status === 1) {
          toast.success("Category created successfully!");
          onSuccess();
          onClose();
        } else {
          toast.error(result.message || "Category could not be created!");
        }
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
            <h5 className="modal-title">
              {categoryToEdit ? 'Edit Category' : 'Add New Category'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="name" 
                  defaultValue={categoryToEdit?.name || ''}
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Image</label>
                <input 
                  type="file" 
                  className="form-control" 
                  name="image" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <small>Preview:</small>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      width="100" 
                      className="d-block mt-1 img-thumbnail"
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger text-white" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success text-white" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      {categoryToEdit ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    categoryToEdit ? 'Update' : 'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderCategoryForm;