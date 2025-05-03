import React, { useState, useEffect } from "react";
import RichTextEditor from "react-rte";
import { useNavigate, useParams } from 'react-router-dom';
import { fetchActiveStoryCategories, fetchStoryById, updateStory, createStory } from "../../Services/storyApiService";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditStory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "",
    long_description: RichTextEditor.createEmptyValue(),
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    category: "",
    image: null,
    existingImage: "",
    isFeatured: false,
    imageChanged: false // New flag to track if image was changed
  });
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [storyLoading, setStoryLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoryResult = await fetchActiveStoryCategories();
        if (categoryResult.status === 1) {
          setCategories(categoryResult.data);
          setCategoryLoading(false);
        }

        // Fetch story data if in edit mode
        if (id) {
          const storyResult = await fetchStoryById(id);
          if (storyResult && storyResult.status === 1) {
            const story = storyResult.story;
            setFormData({
              title: story.title,
              description: story.description,
              long_description: RichTextEditor.createValueFromString(
                story.long_description || '', 
                'html'
              ),
              metaTitle: story.metaTitle,
              metaKeywords: story.metaKeywords,
              metaDescription: story.metaDescription,
              category: story.category?._id || story.category || "",
              existingImage: story.image,
              isFeatured: story.isFeatured || false,
              imageChanged: false // Initialize as false
            });
            if (story.image) {
              setImagePreview(
                story.image.startsWith('http') 
                  ? story.image 
                  : `${process.env.REACT_APP_API_URL}/${story.image}`
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setStoryLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, image: file, imageChanged: true }));
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null, imageChanged: true }));
    setImagePreview(null);
    // Clear the file input
    document.getElementById('image-upload').value = '';
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
    if (!formData.title || !formData.category || !formData.description) {
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
      
      // Only append image if it was changed
      if (formData.imageChanged && formData.image) {
        data.append('image', formData.image);
      }
      
      data.append('isFeatured', formData.isFeatured);

      const result = id ? await updateStory(id, data) : await createStory(data);
      
      if (result.status === 1) {
        toast.success(`Story ${id ? 'updated' : 'added'} successfully!`);
        setTimeout(() => navigate('/story'), 1000);
      } else {
        toast.error(result.message || `Failed to ${id ? 'update' : 'add'} story`);
      }
    } catch (error) {
      console.error(`Error ${id ? 'updating' : 'adding'} story:`, error);
      toast.error(error.response?.data?.message || `An error occurred while ${id ? 'updating' : 'adding'} the story`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (storyLoading || categoryLoading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading story data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h4>{id ? 'Update Story' : 'Add New Story'}</h4>
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
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
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
              id="image-upload"
              type="file"
              className="form-control"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {(imagePreview || formData.existingImage) && (
              <div className="mt-3 position-relative" style={{ width: 'fit-content' }}>
                <img
                  src={imagePreview || formData.existingImage}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{ maxHeight: '200px', maxWidth: '100%' }}
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                  onClick={handleRemoveImage}
                  style={{ zIndex: 1 }}
                >
                  ×
                </button>
                <p className="text-muted mt-2">
                  {id ? "Upload new image to replace existing one" : "Image preview"}
                </p>
              </div>
            )}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              ) : null}
              {isSubmitting ? (id ? 'Updating...' : 'Adding...') : (id ? 'Update Story' : 'Add Story')}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditStory;