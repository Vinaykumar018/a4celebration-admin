import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchCategories, createProduct } from "../../Services/productApiService";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "react-rte";

const ProductAdd = () => {
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [imagePreview, setImagePreview] = useState({ 
    featuredImage: null, 
    galleryImages: [] 
  });
  const [formData, setFormData] = useState({
    name: "",
    slug_url: "",
    category: "",
    price: "",
    sellingPrice: "",
    gst: "",
    local_delivery: "",
    featuredImage: null,
    stock: "",
    galleryImages: [],
    short_discription: "",
    long_discription: "",
    isFeatured: false,
    offer: "no_offer",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorValue, setEditorValue] = useState(
    RichTextEditor.createEmptyValue()
  );

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await fetchCategories();
      if (result.status === 1) {
        setCategoryData(result.data);
      } else {
        toast.error(result.message || "Failed to load categories");
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleInputChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      if (name === "featuredImage") {
        const file = files[0];
        if (file) {
          setFormData((prevData) => ({ ...prevData, featuredImage: file }));
          setImagePreview((prev) => ({ ...prev, featuredImage: URL.createObjectURL(file) }));
        }
      } else if (name === "galleryImages") {
        const filesArray = Array.from(files);
        if (filesArray.length > 0) {
          setFormData((prevData) => ({ ...prevData, galleryImages: filesArray }));
          setImagePreview((prev) => ({
            ...prev,
            galleryImages: filesArray.map((file) => URL.createObjectURL(file)),
          }));
        }
      }
    } else if (type === "checkbox") {
      setFormData((prevData) => ({ ...prevData, [name]: checked }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        ...(name === "name" && { slug_url: generateSlug(value) }),
      }));
    }
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
    setFormData((prevData) => ({
      ...prevData,
      long_discription: value.toString('html'),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!formData.name || !formData.category || !formData.price || !formData.featuredImage) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    const productData = new FormData();
  
    // Append all form data to FormData
    Object.keys(formData).forEach((key) => {
      if (key === "galleryImages") {
        formData[key].forEach((file) => productData.append("galleryImages", file));
      } else if (key === "isFeatured") {
        productData.append(key, formData[key] ? "true" : "false");
      } else if (key !== "imagePreview") {
        productData.append(key, formData[key]);
      }
    });
  
    try {
      const response = await createProduct(productData);
      console.log(response);
      if (response.success === true) {
        toast.success("Product added successfully!");
        setTimeout(() => navigate("/e-commerce/product"), 1000);
      } else {
        toast.error(response.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Add New Product</h4>
      </div>
      <div className="card-body">
        <form className="grid grid-cols-12 gap-3 needs-validation" noValidate onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter Product Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <div className="valid-feedback">Looks good!</div>
          </div>
          
          {/* Product Slug */}
          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Product Slug</label>
            <input
              type="text"
              className="form-control"
              placeholder="Slug Url"
              name="slug_url"
              value={formData.slug_url}
              readOnly
            />
          </div>

          {/* Category */}
          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Choose Category</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categoryData.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category_name}
                </option>
              ))}
            </select>
            <div className="invalid-feedback">Please select a category</div>
          </div>

          {/* Offer */}
          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Offer</label>
            <select
              className="form-select"
              name="offer"
              value={formData.offer}
              onChange={handleInputChange}
            >
              <option value="no_offer">No Offer</option>
              <option value="on_sale">On Sale</option>
              <option value="most_featured">Most Featured</option>
              <option value="discounted">Discounted</option>
            </select>
          </div>

          {/* Price */}
          <div className="col-span-3 xl:col-span-3 sm:col-span-6">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              placeholder="Enter Price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
            />
            <div className="invalid-feedback">Please provide a valid price</div>
          </div>

          {/* Sale Price */}
          <div className="col-span-3 xl:col-span-3 sm:col-span-6">
            <label className="form-label">Sale Price</label>
            <input
              type="number"
              className="form-control"
              name="sellingPrice"
              placeholder="Sale Price"
              value={formData.sellingPrice}
              onChange={handleInputChange}
              required
              min="0"
            />
            <div className="invalid-feedback">Please provide a valid sale price</div>
          </div>

          {/* GST */}
          <div className="col-span-3 xl:col-span-3 sm:col-span-6">
            <label className="form-label">GST (%)</label>
            <input
              type="number"
              className="form-control"
              name="gst"  
              placeholder="Enter GST"
              value={formData.gst}
              onChange={handleInputChange}
              required
              min="0"
              max="100"
            />
            <div className="invalid-feedback">Please provide valid GST</div>
          </div>

          {/* Shipping Charges */}
          <div className="col-span-3 xl:col-span-3 sm:col-span-6">
            <label className="form-label">Shipping Charges</label>
            <input
              type="number"
              className="form-control"
              name="local_delivery"
              placeholder="Delivery Charge"
              value={formData.local_delivery}
              onChange={handleInputChange}
              required
              min="0"
            />
            <div className="invalid-feedback">Please provide valid shipping charges</div>
          </div>

          {/* Stock */}
          <div className="col-span-3 xl:col-span-3 sm:col-span-6">
            <label className="form-label">Stock</label>
            <input
              type="number"
              className="form-control"
              name="stock"
              placeholder="Enter Stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              min="0"
            />
            <div className="invalid-feedback">Please provide valid stock quantity</div>
          </div>

          {/* Featured Image */}
          <div className="col-span-3 xl:col-span-3 sm:col-span-6">
            <label className="form-label">Featured Image</label>
            <input
              type="file"
              className="form-control"
              name="featuredImage"
              onChange={handleInputChange}
              accept="image/*"
              required
            />
            {imagePreview.featuredImage && (
              <img
                src={imagePreview.featuredImage || "/placeholder.svg"}
                alt="Featured Preview"
                className="img-thumbnail mt-2"
                style={{ maxHeight: '100px' }}
              />
            )}
            <div className="invalid-feedback">Please select a featured image</div>
          </div>

          {/* Gallery Images */}
          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Gallery Images</label>
            <input
              type="file"
              className="form-control"
              name="galleryImages"
              onChange={handleInputChange}
              accept="image/*"
              multiple
              required
            />
            <div className="mt-2 d-flex flex-wrap">
              {imagePreview.galleryImages.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`Gallery Preview ${index + 1}`}
                  className="img-thumbnail me-2 mb-2"
                  style={{ maxHeight: '100px' }}
                />
              ))}
            </div>
            <div className="invalid-feedback">Please select at least one gallery image</div>
          </div>

          {/* Short Description */}
          <div className="col-span-12">
            <label className="form-label">Short Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter Short Description"
              name="short_discription"
              value={formData.short_discription}
              onChange={handleInputChange}
              required
            />
            <div className="invalid-feedback">Please provide a short description</div>
          </div>
          <div className="col-span-12">
            <div className="form-check flex gap-2">
              <input
                className="form-check-input checkbox-primary"
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                id="isFeatured"
              />
              <label className="form-check-label mb-0 block" htmlFor="isFeatured">
                Is Featured Product
              </label>
            </div>
          </div>
          {/* Long Description - Rich Text Editor */}
          <div className="col-span-12">
            <label className="form-label">Long Description</label>
            <div  className="rich-text-editor-container">
              <RichTextEditor
                value={editorValue}
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

          {/* Submit Button */}
          <div className="col-span-12 flex justify-end">
            <button
              type="submit"
              className="btn btn-primary text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ProductAdd;