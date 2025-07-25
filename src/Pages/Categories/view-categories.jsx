import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoryById } from '../../redux/categoriesSlice';

const CategoryPreview = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
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
        category_image: currentCategory.category_image || null,
      });
    }
  }, [currentCategory]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8">
      <div className="inline-flex items-center px-4 py-2 bg-red-100 border border-red-400 text-red-700 rounded">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="mt-4 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h4 className="text-xl font-semibold text-center mb-6">Category Preview</h4>

        {/* First Row - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              value={formData.category_name}
              readOnly
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug URL
            </label>
            <input
              type="text"
              value={formData.slug_url}
              readOnly
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
        </div>

        {/* Second Row - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <input
              type="text"
              value={formData.status === "1" ? "Active" : "Inactive"}
              readOnly
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 capitalize"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Category Image
            </label>
            {formData.category_image && (
              <img
                src={`https://a4celebration.com/api/${formData.category_image}`}
                alt="Category Preview"
                className="mt-1 w-32 h-32 object-cover rounded border"
              />
            )}
          </div>
        </div>

        {/* Description (Full Width) */}
        <div className="mb-4 mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            readOnly
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
            rows="4"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default CategoryPreview;