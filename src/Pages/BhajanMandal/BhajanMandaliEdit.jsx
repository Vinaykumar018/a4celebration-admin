import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategories, fetchBhajanMandalById } from '../../Services/bhajanApiService';

const BhajanMandaliEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const IMGURL = 'https://a4celebration.com/api';
  const [formData, setFormData] = useState({
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    bhajan_name: "",
    slug_url: "",
    bhajan_category: "",
    bhajan_price: "",
    bhajan_member: "",
    bhajan_image: null,
    short_discription: "",
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
  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate phone number if the field is owner_phone
    if (name === "owner_phone") {
      if (!/^\d{10}$/.test(value) && value !== "") {
        setErrors({ ...errors, owner_phone: "Phone number must be 10 digits" });
      } else {
        const newErrors = { ...errors };
        delete newErrors.owner_phone;
        setErrors(newErrors);
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      slug_url: name === 'bhajan_name' ? generateSlug(value) : prevData.slug_url,
    }));
  };

  const generateSlug = (value) => {
    return value.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  // Handle image file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setFormData((prevData) => ({ ...prevData, bhajan_image: file }));
    } else {
      toast.error('Please select a valid image file');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

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
      const response = await fetch(`https://a4celebration.com/api/api/bhajanMandal/update-bhajan/${id}`, {
        method: "PUT",
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8',
        },
        body: data
      });

      const result = await response.json();
      if (result.status === 1) {
        toast.success("Bhajan Mandal updated successfully!");
        setTimeout(() => {
          navigate("/bhajan/mandali");
        }, 1000);
      } else {
        toast.error(result.message || "Error updating Bhajan Mandal");
      }
    } catch (error) {
      toast.error("Error updating Bhajan Mandal. Please try again.");
      console.error("Error updating Bhajan Mandal:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load categories and bhajan mandal data
  const loadData = async () => {
    try {
      setLoading(true);

      // Load categories
      const categoriesResult = await fetchCategories();
      if (categoriesResult.status === 1) {
        setCategoryData(categoriesResult.data);
      }

      // Load bhajan mandal data
      const bhajanResult = await fetchBhajanMandalById(id);
      if (bhajanResult.status === 1) {
        const bhajanMandal = bhajanResult.data;
        setFormData({
          owner_name: bhajanMandal.bhajan_owner.owner_name,
          owner_email: bhajanMandal.bhajan_owner.owner_email,
          owner_phone: bhajanMandal.bhajan_owner?.owner_phone,
          bhajan_name: bhajanMandal.bhajan_name,
          slug_url: bhajanMandal.slug_url,
          bhajan_category: bhajanMandal.bhajan_category,
          bhajan_price: bhajanMandal.bhajan_price,
          bhajan_member: bhajanMandal.bhajan_member,
          bhajan_image: bhajanMandal.bhajan_image,
          short_discription: bhajanMandal.short_discription,
          long_discription: bhajanMandal.long_discription,
          exp_year: bhajanMandal.exp_year,
          address: bhajanMandal.mandali_address?.address,
          city: bhajanMandal.mandali_address?.city,
          location: bhajanMandal.mandali_address?.location,
          state: bhajanMandal.mandali_address?.state,
          country: bhajanMandal.mandali_address?.country,
          pin_code: bhajanMandal.mandali_address?.pin_code,
          area: bhajanMandal.mandali_address?.area,
        });
        if (bhajanMandal.bhajan_image) {
          setImagePreview(bhajanMandal.bhajan_image);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error loading data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, [id]);
  console.log(formData);
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Edit Bhajan Mandali</h4>
      </div>
      <div className="card-body">
        <form className="grid grid-cols-12 gap-3 needs-validation" noValidate onSubmit={handleSubmit}>

          {/* Owner Information */}
          <div className="col-span-6">
            <label className="form-label">Owner Name</label>
            <input
              type="text"
              className="form-control"
              name="owner_name"
              value={formData.owner_name}
              onChange={handleInputChange}
              placeholder="Enter owner name"
              required
            />
          </div>

          <div className="col-span-6">
            <label className="form-label">Owner Email</label>
            <input
              type="email"
              className="form-control"
              name="owner_email"
              value={formData.owner_email}
              onChange={handleInputChange}
              placeholder="Enter owner email"
              required
            />
          </div>

          <div className="col-span-6">
            <label className="form-label">Owner Phone</label>
            <input
              type="text"
              className={`form-control ${errors.owner_phone ? 'is-invalid' : ''}`}
              name="owner_phone"
              value={formData.owner_phone}
              onChange={handleInputChange}
              placeholder="Enter owner phone"
              required
              maxLength="10"
            />
            {errors.owner_phone && <div className="invalid-feedback">{errors.owner_phone}</div>}
          </div>

          {/* Mandali Info */}
          <div className="col-span-6">
            <label className="form-label">Mandali Name</label>
            <input
              type="text"
              className="form-control"
              name="bhajan_name"
              value={formData.bhajan_name}
              onChange={handleInputChange}
              placeholder="Enter mandali name"
              required
            />
          </div>

          <div className="col-span-6">
            <label className="form-label">Mandali Slug</label>
            <input
              type="text"
              className="form-control"
              name="slug_url"
              value={formData.slug_url}
              readOnly
              placeholder="Auto-generated slug"
            />
          </div>

          <div className="col-span-6">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="bhajan_category"
              value={formData.bhajan_category}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select Category</option>
              {categoryData.map(category => (
                <option key={category._id} value={category._id}>{category.category}</option>
              ))}
            </select>
          </div>

          <div className="col-span-6">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              name="bhajan_price"
              value={formData.bhajan_price}
              onChange={handleInputChange}
              placeholder="Enter price"
              required
            />
          </div>

          <div className="col-span-6">
            <label className="form-label">Total Members</label>
            <input
              type="number"
              className="form-control"
              name="bhajan_member"
              value={formData.bhajan_member}
              onChange={handleInputChange}
              placeholder="Enter total members"
              required
            />
          </div>

          <div className="col-span-6">
            <label className="form-label">Experience Year</label>
            <input
              type="text"
              className="form-control"
              name="exp_year"
              value={formData.exp_year}
              onChange={handleInputChange}
              placeholder="Enter experience year"
              required
            />
          </div>

          {/* Address Info */}
          <div className="col-span-12">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter address"
              required
            />
          </div>

          <div className="col-span-4">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter city"
              required
            />
          </div>

          <div className="col-span-4">
            <label className="form-label">State</label>
            <input
              type="text"
              className="form-control"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Enter state"
              required
            />
          </div>

          <div className="col-span-4">
            <label className="form-label">Country</label>
            <input
              type="text"
              className="form-control"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter country"
              required
            />
          </div>

          <div className="col-span-4">
            <label className="form-label">Pin Code</label>
            <input
              type="text"
              className="form-control"
              name="pin_code"
              value={formData.pin_code}
              onChange={handleInputChange}
              placeholder="Enter pin code"
              required
            />
          </div>

          <div className="col-span-4">
            <label className="form-label">Area</label>
            <input
              type="text"
              className="form-control"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="Enter area"
              required
            />
          </div>

          <div className="col-span-4">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter location"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="col-span-6">
            <label className="form-label">Mandali Photo</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
            />
            {imagePreview && (
              <img src={IMGURL + imagePreview} alt="Preview" className="img-thumbnail mt-2" style={{ maxHeight: '100px' }} />
            )}
          </div>

          {/* Descriptions */}
          <div className="col-span-12">
            <label className="form-label">Short Description</label>
            <textarea
              className="form-control"
              rows="3"
              name="short_discription"
              value={formData.short_discription}
              onChange={handleInputChange}
              placeholder="Enter short description"
              required
            />
          </div>

          <div className="col-span-12">
            <label className="form-label">Long Description</label>
            <textarea
              className="form-control"
              rows="5"
              name="long_discription"
              value={formData.long_discription}
              onChange={handleInputChange}
              placeholder="Enter long description"
              required
            />
          </div>

          {/* Submit */}
          <div className="col-span-12 flex justify-end">
            <button
              type="submit"
              className="btn btn-success text-white"
              disabled={loading || Object.keys(errors).length > 0}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BhajanMandaliEdit;