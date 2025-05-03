import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBhajanMandal, fetchCategories } from '../../Services/bhajanApiService';
import { useNavigate } from "react-router-dom";

const AddBhajanMandal = () => {
  const [formData, setFormData] = useState({
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    owner_password: "",
    bhajan_name: "",
    slug_url: '',
    bhajan_category: "",
    bhajan_image: null,
    bhajan_price: "",
    short_discription: "",
    bhajan_member: "",
    long_discription: "",
    exp_year: "",
    address: "",
    city: "",
    location: "",
    state: "",
    country: "",
    pin_code: "",
    area: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      slug_url: name === 'bhajan_name' ? generateSlug(value) : prev.slug_url,
    }));
  };

  const generateSlug = (value) => {
    return value.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, bhajan_image: file }));
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === "bhajan_image") {
        if (formData[key]) data.append(key, formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await createBhajanMandal(data);
      toast.success("Bhajan Mandal created successfully!");
      setTimeout(() => navigate("/bhajan-list"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create Bhajan Mandal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchCategories();
        if (result.status === 1) {
          setCategoryData(result.data);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Add New Bhajan Mandali</h4>
      </div>
      <div className="card-body">
        <form className="grid grid-cols-12 gap-3 needs-validation" noValidate onSubmit={handleSubmit}>

          {/* Owner Information */}
          <div className="col-span-6">
            <label className="form-label">Owner Name</label>
            <input type="text" className="form-control" name="owner_name" value={formData.owner_name} onChange={handleInputChange} placeholder="Enter owner name" required />
          </div>

          <div className="col-span-6">
            <label className="form-label">Owner Email</label>
            <input type="email" className="form-control" name="owner_email" value={formData.owner_email} onChange={handleInputChange} placeholder="Enter owner email" required />
          </div>

          <div className="col-span-6">
            <label className="form-label">Owner Phone</label>
            <input type="text" className="form-control" name="owner_phone" value={formData.owner_phone} onChange={handleInputChange} placeholder="Enter owner phone" required />
          </div>

          <div className="col-span-6">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="owner_password" value={formData.owner_password} onChange={handleInputChange} placeholder="Enter password" required />
          </div>

          {/* Mandali Info */}
          <div className="col-span-6">
            <label className="form-label">Mandali Name</label>
            <input type="text" className="form-control" name="bhajan_name" value={formData.bhajan_name} onChange={handleInputChange} placeholder="Enter mandali name" required />
          </div>

          <div className="col-span-6">
            <label className="form-label">Mandali Slug</label>
            <input type="text" className="form-control" name="slug_url" value={formData.slug_url} readOnly placeholder="Auto-generated slug" />
          </div>

          <div className="col-span-6">
            <label className="form-label">Category</label>
            <select className="form-select" name="bhajan_category" value={formData.bhajan_category} onChange={handleInputChange} required>
              <option value="" disabled>Select Category</option>
              {categoryData.map(category => (
                <option key={category._id} value={category._id}>{category.category}</option>
              ))}
            </select>
          </div>

          <div className="col-span-6">
            <label className="form-label">Price</label>
            <input type="number" className="form-control" name="bhajan_price" value={formData.bhajan_price} onChange={handleInputChange} placeholder="Enter price" required />
          </div>

          <div className="col-span-6">
            <label className="form-label">Total Members</label>
            <input type="number" className="form-control" name="bhajan_member" value={formData.bhajan_member} onChange={handleInputChange} placeholder="Enter total members" required />
          </div>

          <div className="col-span-6">
            <label className="form-label">Experience Year</label>
            <input type="text" className="form-control" name="exp_year" value={formData.exp_year} onChange={handleInputChange} placeholder="Enter experience year" required />
          </div>

          {/* Address Info */}
          <div className="col-span-12">
            <label className="form-label">Address</label>
            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter address" required />
          </div>

          <div className="col-span-4">
            <label className="form-label">City</label>
            <input type="text" className="form-control" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter city" required />
          </div>

          <div className="col-span-4">
            <label className="form-label">State</label>
            <input type="text" className="form-control" name="state" value={formData.state} onChange={handleInputChange} placeholder="Enter state" required />
          </div>

          <div className="col-span-4">
            <label className="form-label">Country</label>
            <input type="text" className="form-control" name="country" value={formData.country} onChange={handleInputChange} placeholder="Enter country" required />
          </div>

          <div className="col-span-4">
            <label className="form-label">Pin Code</label>
            <input type="text" className="form-control" name="pin_code" value={formData.pin_code} onChange={handleInputChange} placeholder="Enter pin code" required />
          </div>

          <div className="col-span-4">
            <label className="form-label">Area</label>
            <input type="text" className="form-control" name="area" value={formData.area} onChange={handleInputChange} placeholder="Enter area" required />
          </div>

          <div className="col-span-4">
            <label className="form-label">Location</label>
            <input type="text" className="form-control" name="location" value={formData.location} onChange={handleInputChange} placeholder="Enter location" required />
          </div>

          {/* Image Upload */}
          <div className="col-span-6">
            <label className="form-label">Mandali Photo</label>
            <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} required />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="img-thumbnail mt-2" style={{ maxHeight: '100px' }} />
            )}
          </div>

          {/* Descriptions */}
          <div className="col-span-12">
            <label className="form-label">Short Description</label>
            <textarea className="form-control" rows="3" name="short_discription" value={formData.short_discription} onChange={handleInputChange} placeholder="Enter short description" required />
          </div>

          <div className="col-span-12">
            <label className="form-label">Long Description</label>
            <textarea className="form-control" rows="5" name="long_discription" value={formData.long_discription} onChange={handleInputChange} placeholder="Enter long description" required />
          </div>

          {/* Submit */}
          <div className="col-span-12 flex justify-end">
            <button type="submit" className="btn btn-primary text-white" disabled={loading}>
              {loading ? 'Creating...' : 'Create Mandali'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddBhajanMandal;
