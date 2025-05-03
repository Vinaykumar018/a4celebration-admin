import React, { useState, useEffect } from "react";
import RichTextEditor from "react-rte";
import { useNavigate } from 'react-router-dom';
import { fetchActiveStoryCategories, createStory } from "../../Services/storyApiService";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddStory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "",
    long_description: RichTextEditor.createEmptyValue(),
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    category: "",
    image: null,
    isFeatured: false
  });
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const result = await fetchActiveStoryCategories();
        if (result.status === 1) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
        toast.error("Failed to load categories");
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFormData({ ...formData, image: file });
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, long_description: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.category || !formData.description || !formData.image) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('long_description', formData.long_description.toString('html'));
      data.append('metaTitle', formData.metaTitle);
      data.append('metaKeywords', formData.metaKeywords);
      data.append('metaDescription', formData.metaDescription);
      data.append('category', formData.category);
      if (formData.image) {
        data.append('image', formData.image);
      }
      data.append('isFeatured', formData.isFeatured);

      const result = await createStory(data);
      
      if (result.status === 1) {
        toast.success("Story added successfully!");
        setTimeout(() => navigate('/story'), 1000);
      } else {
        toast.error(result.message || "Failed to add story");
      }
    } catch (error) {
      console.error("Error adding story:", error);
      toast.error(error.response?.data?.message || "An error occurred while adding the story");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>Add Story</h4>
      </div>
      <div className="card-body">
        <form className="grid grid-cols-12 gap-3 needs-validation" noValidate onSubmit={handleSubmit}>
          {/* Story Title */}
          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Story Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              placeholder="Enter Story Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <div className="valid-feedback">Looks good!</div>
          </div>

          {/* Category */}
          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Story Category</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={categoryLoading}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            {categoryLoading && <div className="mt-2">Loading categories...</div>}
            <div className="invalid-feedback">Please select a category</div>
          </div>


          {/* Meta Title */}
          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Meta Title</label>
            <input
              type="text"
              className="form-control"
              name="metaTitle"
              placeholder="Enter Meta Title"
              value={formData.metaTitle}
              onChange={handleChange}
              required
            />
            <div className="valid-feedback">Looks good!</div>
          </div>

          {/* Meta Keywords */}
          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Meta Keywords</label>
            <input
              type="text"
              className="form-control"
              name="metaKeywords"
              placeholder="Enter Meta Keywords"
              value={formData.metaKeywords}
              onChange={handleChange}
              required
            />
            <div className="valid-feedback">Looks good!</div>
          </div>

          {/* Meta Description */}
          <div className="col-span-12">
            <label className="form-label">Meta Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter Meta Description"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">Please provide a meta description</div>
          </div>

          {/* Story Image */}
          <div className="col-span-12 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Story Image</label>
            <input
              type="file"
              className="form-control"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="img-thumbnail mt-2"
                style={{ maxHeight: '100px' }}
              />
            )}
            <div className="invalid-feedback">Please select an image</div>
          </div>

          
          {/* Short Description */}
          <div className="col-span-12">
            <label className="form-label">Short Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter Short Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">Please provide a short description</div>
          </div>

          {/* Long Description - Rich Text Editor */}
          <div className="col-span-12">
            <label className="form-label">Long Description</label>
            <div className="rich-text-editor-container">
              <RichTextEditor
                value={formData.long_description}
                onChange={handleEditorChange}
                className="h-full"
                style={{height:"400px"}}
                editorClassName="rich-text-editor h-full"
                toolbarClassName="rich-text-toolbar"
                placeholder="Enter Long Description"
              />
            </div>
            <div className="invalid-feedback">Please provide a long description</div>
          </div>

            {/* Is Featured Checkbox */}
            <div className="col-span-12">
            <div className="form-check flex gap-2">
              <input
                className="form-check-input checkbox-primary"
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                id="isFeatured"
              />
              <label className="form-check-label mb-0 block" htmlFor="isFeatured">
                Is Featured Story
              </label>
            </div>
          </div>
          {/* Submit Button */}
          <div className="col-span-12 flex justify-end">
            <button
              type="button"
              className="btn btn-danger text-white me-2"
              onClick={() => navigate('/story')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success text-white"
              disabled={isSubmitting || categoryLoading}
            >
              {isSubmitting ? "Adding Story..." : "Add Story"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddStory;