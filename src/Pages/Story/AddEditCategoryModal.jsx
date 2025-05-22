import React, { useState, useEffect } from "react";
import { createStoryCategory, updateStoryCategory } from "../../Services/storyApiService";
import { toast } from 'react-toastify';
import Loader from "../../Component/Loader";

const AddEditCategoryModal = ({ show, onClose, categoryToEdit, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    language: 'english',
    image: null
  });

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        title: categoryToEdit.title || '',
        metaTitle: categoryToEdit.metaTitle || '',
        metaKeywords: categoryToEdit.metaKeywords || '',
        metaDescription: categoryToEdit.metaDescription || '',
        language: categoryToEdit.language || 'english',
        image: null
      });

      if (categoryToEdit.image) {
        const imagePath = categoryToEdit.image.startsWith("http")
          ? categoryToEdit.image
          : `https://a4celebration.com/api${categoryToEdit.image}`;
        setImagePreview(imagePath);
      }
    } else {
      setFormData({
        title: '',
        metaTitle: '',
        metaKeywords: '',
        metaDescription: '',
        language: 'english',
        image: null
      });
      setImagePreview(null);
    }
  }, [categoryToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    } else {
      setImagePreview(null);
      setFormData(prev => ({
        ...prev,
        image: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('metaTitle', formData.metaTitle);
      formDataObj.append('metaKeywords', formData.metaKeywords);
      formDataObj.append('metaDescription', formData.metaDescription);
      formDataObj.append('language', formData.language);

      // Only append image if it's a File object
      if (formData.image instanceof File) {
        formDataObj.append('image', formData.image);
      }

      // For debugging - log FormData entries
      for (let [key, value] of formDataObj.entries()) {
        console.log(key, value);
      }

      let result;
      if (categoryToEdit) {
        result = await updateStoryCategory(categoryToEdit._id, formDataObj);
      } else {
        result = await createStoryCategory(formDataObj);
      }

      if (result.status === 1) {
        toast.success(`Category ${categoryToEdit ? 'updated' : 'created'} successfully!`);
        onSuccess();
        onClose();
      } else {
        toast.error(result.message || `Failed to ${categoryToEdit ? 'update' : 'create'} category`);
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
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Language</label>
                <select
                  className="form-control"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  required
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="sanskrit">Sanskrit</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Meta Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Meta Keywords</label>
                <input
                  type="text"
                  className="form-control"
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Meta Description</label>
                <textarea
                  className="form-control"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
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
                  {loading ? 'Processing...' : (categoryToEdit ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditCategoryModal;