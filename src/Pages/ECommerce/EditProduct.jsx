import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchCategories, updateProduct, fetchProductById } from "../../Services/productApiService";
import { useParams, useNavigate } from "react-router-dom";
import RichTextEditor from "react-rte";

const EditProduct = () => {
  const { id } = useParams();
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
    long_discription: RichTextEditor.createEmptyValue(),
    isFeatured: false,
    offer: "no_offer",
  });
  const [existingFeaturedImage, setExistingFeaturedImage] = useState(null);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    loadProductData();
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

  const loadProductData = async () => {
    try {
      setProductLoading(true);
      const response = await fetchProductById(id);
      if (response.success) {
        const product = response.data;
        setFormData({
          name: product.name || "",
          slug_url: product.slug || "",
          category: product.category || "",
          price: product.price || "",
          sellingPrice: product.sellingPrice || "",
          gst: product.gst || "",
          local_delivery: product.local_delivery || "",
          featuredImage: product.featuredImage || null,
          stock: product.stock || "",
          galleryImages: product.galleryImages || [],
          short_discription: product.short_discription || "",
          long_discription: product.long_discription
            ? RichTextEditor.createValueFromString(product.long_discription, "html")
            : RichTextEditor.createEmptyValue(),
          isFeatured: product.isFeatured || false,
          offer: product.offer || "no_offer",
        });

        setExistingFeaturedImage(product.featuredImage);
        setExistingGalleryImages(product.galleryImages || []);

        if (product.featuredImage) {
          setImagePreview((prev) => ({
            ...prev,
            featuredImage: `http://localhost:3000/uploads/${product.featuredImage}`,
          }));
        }
        if (product.galleryImages && product.galleryImages.length > 0) {
          setImagePreview((prev) => ({
            ...prev,
            galleryImages: product.galleryImages.map(
              (image) => `http://localhost:3000/uploads/${image}`
            ),
          }));
        }
      } else {
        toast.error(response.message || "Failed to load product data");
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("An error occurred while loading the product");
    } finally {
      setProductLoading(false);
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
    setFormData((prevData) => ({
      ...prevData,
      long_discription: value,
    }));
  };

  const removeGalleryImage = (index) => {
    const updatedGallery = [...formData.galleryImages];
    updatedGallery.splice(index, 1);
    setFormData({ ...formData, galleryImages: updatedGallery });

    const updatedPreviews = [...imagePreview.galleryImages];
    updatedPreviews.splice(index, 1);
    setImagePreview({ ...imagePreview, galleryImages: updatedPreviews });
  };

  const removeExistingGalleryImage = (index) => {
    const updatedGallery = [...existingGalleryImages];
    updatedGallery.splice(index, 1);
    setExistingGalleryImages(updatedGallery);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.category || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    const productData = new FormData();

    // Append all form data to FormData
    productData.append("name", formData.name);
    productData.append("slug_url", formData.slug_url);
    productData.append("category", formData.category);
    productData.append("price", formData.price);
    productData.append("sellingPrice", formData.sellingPrice);
    productData.append("gst", formData.gst);
    productData.append("local_delivery", formData.local_delivery);
    productData.append("stock", formData.stock);
    productData.append("short_discription", formData.short_discription);
    productData.append("long_discription", formData.long_discription.toString("html"));
    productData.append("isFeatured", formData.isFeatured);
    productData.append("offer", formData.offer);

    // Handle featured image
    if (formData.featuredImage instanceof File) {
      productData.append("featuredImage", formData.featuredImage);
    } else if (existingFeaturedImage) {
      productData.append("featuredImage", existingFeaturedImage);
    }

    // Handle gallery images
    // First add existing images that weren't removed
    existingGalleryImages.forEach((image) => {
      productData.append("existingGalleryImages", image);
    });

    // Then add new gallery images
    if (formData.galleryImages.length > 0) {
      formData.galleryImages.forEach((file) => {
        if (file instanceof File) {
          productData.append("galleryImages", file);
        }
      });
    }

    try {
      const response = await updateProduct(id, productData);
      if (response.success) {
        toast.success("Product updated successfully!");
        setTimeout(() => navigate("/e-commerce/product"), 1000);
      } else {
        toast.error(response.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (productLoading) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 mb-0">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Edit Product</h4>
      </div>
      <div className="card-body">
        <form className="needs-validation" noValidate onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-3">
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
          </div>

          <div className="grid grid-cols-12 gap-3 needs-validation">
            {/* Featured Image */}
            <div className="col-span-6 xl:col-span-6 sm:col-span-6">
              <label className="form-label">Featured Image</label>
              <input
                type="file"
                className="form-control"
                name="featuredImage"
                onChange={handleInputChange}
                accept="image/*"
              />
              {imagePreview.featuredImage ? (
                <img
                  src={imagePreview.featuredImage}
                  alt="Featured Preview"
                  className="img-thumbnail mt-2"
                  style={{ maxHeight: '100px' }}
                />
              ) : existingFeaturedImage ? (
                <img
                  src={`http://localhost:3000/uploads/${existingFeaturedImage}`}
                  alt="Existing Featured"
                  className="img-thumbnail mt-2"
                  style={{ maxHeight: '100px' }}
                />
              ) : null}
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
              />
              <div className="mt-2 common-flex flex-wrap">
                {imagePreview.galleryImages.map((image, index) => (
                  <div key={`new-${index}`} className="position-relative me-2 mb-2">
                    <img
                      src={image}
                      alt={`Gallery Preview ${index + 1}`}
                      className="img-thumbnail"
                      style={{ maxHeight: '100px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger p-0 position-absolute top-0 end-0 translate-middle"
                      style={{ width: "20px", height: "20px" }}
                      onClick={() => removeGalleryImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {existingGalleryImages.map((image, index) => (
                  <div key={`existing-${index}`} className="position-relative me-2 mb-2">
                    <img
                      src={`http://localhost:3000/uploads/${image}`}
                      alt={`Existing Gallery ${index + 1}`}
                      className="img-thumbnail"
                      style={{ maxHeight: '100px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger p-0 position-absolute top-0 end-0 translate-middle"
                      style={{ width: "20px", height: "20px" }}
                      onClick={() => removeExistingGalleryImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
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

            {/* Is Featured Checkbox */}
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
              <div className="rich-text-editor-container">
                <RichTextEditor
                  value={formData.long_discription}
                  onChange={handleEditorChange}
                  className="h-full"
                  style={{ maxHeight: "400px" }}
                  editorClassName="rich-text-editor h-full"
                  toolbarClassName="rich-text-toolbar"
                  placeholder="Enter Long Description"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-span-12 flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-danger text-white"
                onClick={() => navigate('/e-commerce/product')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating Product..." : "Update Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditProduct;