import { useState,useEffect } from "react";
import { createCategory } from "../../Services/category-api-service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCategories = () => {
  const [formData, setFormData] = useState({
    category_name: "",
    description: "",
    status: "1",
    slug_url: "",
    category_image: null,
  });

  // Generate slug from product name
    useEffect(() => {
      if (formData.category_name) {
        const generatedSlug = formData.category_name
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        
        setFormData(prev => ({
          ...prev,
          slug_url: generatedSlug
        }));
      }
    }, [formData.category_name]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, category_image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("category_name", formData.category_name);
    data.append("description", formData.description);
    data.append("status", formData.status);
    data.append("slug_url", formData.slug_url);
    data.append("category_image", formData.category_image);

    try {
      await createCategory(data);
      toast.success("Category created successfully!");
      setFormData({
        category_name: "",
        description: "",
        status: "1",
        slug_url: "",
        category_image: null,
      });
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

 

  return (
    <div className="mt-4 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg p-6">
        <h4 className="text-xl font-semibold text-center mb-6">Create New Category</h4>

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
                  Category Image <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    name="category_image"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                </div>
                {formData.category_image && (
  <div className="mt-2">
    <p className="text-sm text-green-600 mb-1">
      File selected: <strong>{formData.category_image.name}</strong>
    </p>
    <div className="w-full max-w-xs">
      <img 
        src={URL.createObjectURL(formData.category_image)} 
        alt="Category preview" 
        className="max-h-40 object-contain border rounded"
      />
    </div>
  </div>
)}
                <small className="text-xs text-gray-500">
                  Upload an image that represents this category (JPEG, PNG)
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
          Create Category
        </button>
        </div>
         
           
       
        </form>
        
      </div>
    </div>
  );
};

export default CreateCategories; 
