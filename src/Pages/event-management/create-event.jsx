import { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createEvent } from "../../Services/events-management-api-service";
import { fetchCategories } from '../../redux/categoriesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FaRupeeSign } from "react-icons/fa";
import RichTextEditor from "react-rte";

const CreateEvent = () => {
  const dispatch = useDispatch();
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);

  const [availableChildCategories, setAvailableChildCategories] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    name: "",
    slug_url: "",
    description: RichTextEditor.createEmptyValue(),
    category: "",
    category_name: "",
    price: "",
    food_type: "Both",
    pax: "",
    room: "",
    city: "",
    venue: "",
    featured_image: null,
    other_images: [],
    package_by: "",
    offer_ends_in: "",
    whatsapp: "",
    package_details: "",
    day_plans: {
      day1: "",
      day2: "",
      day2:"",
      day4:"",
      day5:"",
      summary:""
    },
    package_includes: {
      
      catering: false,
      decoration: false,
      dj: false,
      entry_theme: false
    },
    status: "active",
    child_categories: []
  });

  const handleEditorChange = (value, fieldName) => {
    setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
  };

  // Generate a unique product ID
  const generateProductId = useCallback(() => {
    const prefix = 'PROD-EVENT-';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}${randomNum}${timestamp}`;
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
    setFormData(prev => ({
      ...prev,
      product_id: generateProductId()
    }));
  }, [dispatch, generateProductId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name in formData.package_includes) {
      setFormData(prev => ({
        ...prev,
        package_includes: {
          ...prev.package_includes,
          [name]: checked
        }
      }));
    } else if (name.startsWith('day_plans.')) {
      const dayField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        day_plans: {
          ...prev.day_plans,
          [dayField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handle category selection from dropdown
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);

    if (selectedCategory) {
      const childCategories = selectedCategory.child_category
        ? Object.entries(selectedCategory.child_category).map(([id, child]) => ({
          id,
          name: child.name,
          image: child.image
        }))
        : [];

      setAvailableChildCategories(childCategories);

      setFormData(prev => ({
        ...prev,
        category: selectedCategory._id,
        category_name: selectedCategory.category_name,
        child_categories: []
      }));
    }
  };

  // Handle child category selection
  const handleChildCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedChildren = selectedOptions.map(option => ({
      id: option.value,
      name: option.label
    }));

    setFormData(prev => ({
      ...prev,
      child_categories: selectedChildren
    }));
  };

  // Generate slug from product name
  useEffect(() => {
    if (formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      setFormData(prev => ({
        ...prev,
        slug_url: generatedSlug
      }));
    }
  }, [formData.name]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "featured_image" && files[0]) {
      setFormData(prev => ({ ...prev, featured_image: files[0] }));
    } else if (name === "other_images" && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        other_images: [...prev.other_images, ...Array.from(files)],
      }));
    }
  };

  const removeOtherImage = (index) => {
    setFormData(prev => {
      const updatedImages = [...prev.other_images];
      const removedImage = updatedImages.splice(index, 1)[0];

      if (removedImage instanceof Blob) {
        URL.revokeObjectURL(URL.createObjectURL(removedImage));
      }

      return { ...prev, other_images: updatedImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // Convert RichTextEditor content to HTML string
      const descriptionHTML = formData.description.toString('html');

      // Append all form data
      data.append('product_id', formData.product_id);
      data.append('name', formData.name);
      data.append('slug_url', formData.slug_url);
      data.append('description', descriptionHTML);
      data.append('category', formData.category);
      data.append('category_name', formData.category_name);
      data.append('price', formData.price);
      data.append('food_type', formData.food_type);
      data.append('pax', formData.pax);
      data.append('room', formData.room);
      data.append('city', formData.city);
      data.append('venue', formData.venue);
      data.append('package_by', formData.package_by);
      data.append('offer_ends_in', formData.offer_ends_in);
      data.append('whatsapp', formData.whatsapp);
      data.append('package_details', formData.package_details);
      data.append('day_plans', JSON.stringify(formData.day_plans));
      data.append('package_includes', JSON.stringify(formData.package_includes));
      data.append('status', formData.status);

      // Handle child categories
      if (formData.child_categories.length > 0) {
        data.append('child_categories', JSON.stringify(formData.child_categories));
      }

      // Handle images
      if (formData.featured_image) {
        data.append('featured_image', formData.featured_image);
      }

      formData.other_images.forEach(file => {
        data.append('other_images', file);
      });

      await createEvent(data);
      toast.success("Event created successfully!");

      // Reset form
      setFormData({
        product_id: generateProductId(),
        name: "",
        slug_url: "",
        description: RichTextEditor.createEmptyValue(),
        category: "",
        category_name: "",
        price: "",
        food_type: "Both",
        pax: "",
        room: "",
        city: "",
        venue: "",
        featured_image: null,
        other_images: [],
        package_by: "",
        offer_ends_in: "",
        whatsapp: "",
        package_details: "",
        day_plans: {
          day1: "",
          day2: ""
        },
        package_includes: {
          venue: false,
          catering: false,
          decoration: false,
          dj: false,
          entry_theme: false
        },
        status: "active",
        child_categories: []
      });
      setAvailableChildCategories([]);
    } catch (error) {
      console.error("Creation error:", error);
      toast.error(error.message || "Failed to create Event");
    }
  };

  return (
    <div className="mt-4 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="bg-white shadow-md rounded-lg p-6">
        <h4 className="text-xl font-semibold text-center mb-6">Create New Event</h4>

        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="mb-4">
           
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                   placeholder="e.g. royal-wedding-kanpur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug URL
                </label>
                <input
                  type="text"
                  name="slug_url"
                  value={formData.slug_url}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  readOnly
                />
              </div>
            </div>

          
          </div>

          {/* Category Section */}
          <div className="mb-4">
            
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={categoriesLoading}
                >
                  <option value="">Select a category</option>
                  {categoriesLoading ? (
                    <option>Loading categories...</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.category_name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  name="category_name"
                  value={formData.category_name}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  readOnly
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Child Categories (Optional)
              </label>
              <select
                multiple
                size={Math.min(availableChildCategories.length, 4)}
                name="child_categories"
                value={formData.child_categories.map(child => child.id)}
                onChange={handleChildCategoryChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={!formData.category || availableChildCategories.length === 0}
              >
                {availableChildCategories.length > 0 ? (
                  availableChildCategories.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No child categories available</option>
                )}
              </select>
              {formData.child_categories.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Selected:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.child_categories.map((child, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {child.name}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              child_categories: prev.child_categories.filter(c => c.id !== child.id)
                            }));
                          }}
                          className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                        >
                          <span className="sr-only">Remove</span>
                          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Event Details Section */}
          <div className="mb-8">
          
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm"><FaRupeeSign /></span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Food Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="food_type"
                  value={formData.food_type}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Veg">Vegetarian</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pax (Number of Guests) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="pax"
                  value={formData.pax}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 200"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room Details <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 10 AC Rooms"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Goa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Venue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Grand Hyatt"
                
                />
              </div>
            </div>
          </div>

          {/* Package Information Section */}
          <div className="mb-8">
           
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Package By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="package_by"
                  value={formData.package_by}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Event Planners Inc"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Offer Ends In
                </label>
                <input
                  type="text"
                  name="offer_ends_in"
                  value={formData.offer_ends_in}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 5 days or 30 Sep"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp Contact
              </label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. +919876543210"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Package Details <span className="text-red-500">*</span>
              </label>
              <textarea
                name="package_details"
                value={formData.package_details}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Detailed description of what the package includes"
                required
              />
            </div>
            

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Day 1 Plan
                </label>
                <textarea
                  name="day_plans.day1"
                  value={formData.day_plans.day1}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Activities for day 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Day 2 Plan
                </label>
                <textarea
                  name="day_plans.day2"
                  value={formData.day_plans.day2}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Activities for day 2"
                />
              </div>
            </div>
              <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => handleEditorChange(value, "description")}
                editorStyle={{
                  minHeight: "120px",
                }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Includes
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.package_includes).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      name={key}
                      checked={value}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      id={`include-${key}`}
                    />
                    <label htmlFor={`include-${key}`} className="ml-2 block text-sm text-gray-700 capitalize">
                      {key.replace('_', ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="mb-8">
        
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Featured Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="featured_image"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
                required
              />
              {formData.featured_image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">
                    Selected: {formData.featured_image.name}
                  </p>
                  <div className="w-full max-w-xs">
                    <img
                      src={URL.createObjectURL(formData.featured_image)}
                      alt="Featured preview"
                      className="max-h-40 object-contain border rounded"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Additional Images (Optional)
              </label>
              <input
                type="file"
                name="other_images"
                onChange={handleFileChange}
                multiple
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
              />
              {formData.other_images.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected images ({formData.other_images.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {formData.other_images.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="border rounded p-1">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-contain"
                          />
                          <p className="text-xs text-gray-600 truncate mt-1">{file.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeOtherImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;