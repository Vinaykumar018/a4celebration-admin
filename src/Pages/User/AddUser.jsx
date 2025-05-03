import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../../Services/userApiService';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
    gender: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    longitude: '',
    latitude: '',
    landmark: '',
    social_type: 'other',
    alternate_no: '',
    image: null,
    aadhar_no: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Validate Indian mobile number
  const validateMobile = (mobile) => {
    const re = /^[6-9]\d{9}$/;
    return re.test(mobile);
  };

  // Validate password strength
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // Validate Aadhar number
  const validateAadhar = (aadhar) => {
    if (!aadhar) return true; // optional field
    const re = /^\d{12}$/;
    return re.test(aadhar);
  };

  // Validate pincode
  const validatePincode = (pincode) => {
    if (!pincode) return true; // optional field
    const re = /^\d{6}$/;
    return re.test(pincode);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!validateMobile(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.alternate_no && !validateMobile(formData.alternate_no)) {
      newErrors.alternate_no = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (formData.aadhar_no && !validateAadhar(formData.aadhar_no)) {
      newErrors.aadhar_no = 'Aadhar number must be 12 digits';
    }

    if (formData.pincode && !validatePincode(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent autocomplete for sensitive fields
    if (name === 'password' || name === 'aadhar_no') {
      e.target.autocomplete = 'new-password';
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    const formDataToSend = new FormData();
    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        if (formData[key] !== '' || 
            ['username', 'email', 'mobile', 'password'].includes(key)) {
          formDataToSend.append(key, formData[key]);
        }
      }
    }

    try {
      const result = await createUser(formDataToSend);

      if (result.status === 1) {
        toast.success('User created successfully!');
        setTimeout(() => navigate('/user'), 1000);
      } else {
        throw new Error(result.message || 'Failed to create user');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create user. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header common-flex justify-between items-center">
        <h4 className="card-title">Add New User</h4>
        <Link to="/user" className='btn btn-info text-white'>User List</Link>
      </div>
      <div className="card-body">
        <form 
          className="grid grid-cols-12 gap-3 needs-validation" 
          noValidate 
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {/* Basic Information Section */}
          <div className="col-span-12">
            <h5 className="mb-3">Basic Information</h5>
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Name*</label>
            <input
              type="text"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              autoComplete="name"
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Email*</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Mobile*</label>
            <input
              type="tel"
              className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              required
              pattern="[6-9]{1}[0-9]{9}"
              maxLength="10"
              autoComplete="tel"
            />
            {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Password*</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="8"
              autoComplete="new-password"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            <small className="text-muted">Minimum 8 characters</small>
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Alternate Mobile</label>
            <input
              type="tel"
              className={`form-control ${errors.alternate_no ? 'is-invalid' : ''}`}
              name="alternate_no"
              value={formData.alternate_no}
              onChange={handleInputChange}
              pattern="[6-9]{1}[0-9]{9}"
              maxLength="10"
              autoComplete="tel"
            />
            {errors.alternate_no && <div className="invalid-feedback">{errors.alternate_no}</div>}
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Profile Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="img-thumbnail mt-2"
                style={{ maxHeight: '100px' }}
              />
            )}
            <small className="text-muted">Max size: 2MB</small>
          </div>

          {/* Address Information Section */}
          <div className="col-span-12 mt-4">
            <h5 className="mb-3">Address Information</h5>
          </div>

          <div className="col-span-12">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              autoComplete="street-address"
            />
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              autoComplete="address-level2"
            />
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">State</label>
            <input
              type="text"
              className="form-control"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              autoComplete="address-level1"
            />
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Country</label>
            <input
              type="text"
              className="form-control"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              autoComplete="country"
            />
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Pincode</label>
            <input
              type="text"
              className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              pattern="\d{6}"
              maxLength="6"
              autoComplete="postal-code"
            />
            {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Longitude</label>
            <input
              type="text"
              className="form-control"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Latitude</label>
            <input
              type="text"
              className="form-control"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-12">
            <label className="form-label">Landmark</label>
            <input
              type="text"
              className="form-control"
              name="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
            />
          </div>
          {/* Submit Button */}
          <div className="col-span-12 flex justify-end mt-4">
            <button
              type="submit"
              className="btn btn-success text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating...
                </>
              ) : 'Create User'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddUser;