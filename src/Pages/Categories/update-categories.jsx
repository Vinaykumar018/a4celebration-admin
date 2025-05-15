import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { fetchCategoryById, modifyCategory } from '../../redux/categoriesSlice'

const UpdateCategories = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const { currentCategory, loading, error } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    category_name: "",
    description: "",
    status: "1",
    slug_url: "",
    category_image: null,

  });

  // Fetch category data when component mounts or id changes
  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryById(id));
    }
  }, [dispatch, id]);

  // Update form data when currentCategory changes
  useEffect(() => {
    if (currentCategory) {
      setFormData({
        category_name: currentCategory.category_name || "",
        description: currentCategory.description || "",
        status: currentCategory.status?.toString() || "1",
        slug_url: currentCategory.slug_url || "",
        category_image: null, // Keep as null since we don't want to display existing image in file input
      });
    }
  }, [currentCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, category_image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("category_name", formData.category_name);
    data.append("description", formData.description);
    data.append("status", formData.status);
    data.append("slug_url", formData.slug_url);
    if (formData.category_image) {
      data.append("category_image", formData.category_image);
    }

    try {
      await dispatch(modifyCategory({ id, formData: data })).unwrap();
      toast.success("Category updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update category");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;





  return (
    <div className="mt-4 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg p-6">
        <h4 className="text-xl font-semibold text-center mb-6">Update Category</h4>

        <form onSubmit={handleSubmit}>
          {/* First Row - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Electronics, Clothing"
                required
              />
              <small className="text-xs text-gray-500">Enter a descriptive name for your category</small>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug URL <span className="text-gray-500">(optional)</span>
              </label>
              <input
                type="text"
                name="slug_url"
                value={formData.slug_url}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. electronics-gadgets"
                readOnly
              />
              <small className="text-xs text-gray-500">Will be auto-generated if empty</small>
            </div>
          </div>

          {/* Second Row - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
              <small className="text-xs text-gray-500">Active categories will be visible</small>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Category Image
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  name="category_image"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {formData.category_image ? (
                <div className="mt-1 text-xs text-green-600">

                  <img
                    src={imagePreview}
                    alt="New Preview"
                    className="mt-1 w-32 h-32 object-cover rounded border"
                  />
                </div>
              ) : currentCategory?.category_image && (
                <div className="mt-1 text-xs text-gray-600">

                  <img
                    src={`http://localhost:3000/${currentCategory.category_image}`}
                    alt="Current"
                    className="mt-1 w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}

              <small className="text-xs text-gray-500">
                Upload a new image to replace the existing one (JPEG, PNG)
              </small>
            </div>
          </div>

          {/* Description (Full Width) */}
          <div className="mb-4 mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Describe what this category includes..."
              required
            ></textarea>
            <small className="text-xs text-gray-500">Detailed description helps users understand the category</small>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button
              type="submit"
              className="btn btn-primary w-50 text-white"
              style={{
                fontSize: "14px",
                fontWeight: "500",
                transition: "transform 0.2s ease-in-out",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              Update Category
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default UpdateCategories;