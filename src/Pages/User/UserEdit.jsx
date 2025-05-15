import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateUser } from '../../Services/userApiService';

const UserEdit = () => {
  const { id } = useParams();
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

    if (formData.password && !validatePassword(formData.password)) {
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

  // Load user data to update form
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';

        const response = await fetch(`http://localhost:3000/api/user/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        });

        const responseReturn = await response.json();
        const userData = responseReturn.data;
        if (response.ok) {
          setFormData({
            username: userData.username || '',
            email: userData.email || '',
            mobile: userData.mobile || '',
            password: '',
            address: userData.address || '',
            gender: userData.gender || '',
            city: userData.city || '',
            state: userData.state || '',
            country: userData.country || '',
            pincode: userData.pincode || '',
            longitude: userData.longitude || '',
            latitude: userData.latitude || '',
            landmark: userData.landmark || '',
            social_type: userData.social_type || 'other',
            alternate_no: userData.alternate_no || '',
            image: null,
            aadhar_no: userData.aadhar_no || '',
            status: userData.status || 'active',
          });

          if (userData.image) {
            setImagePreview(userData.image);
          }
        } else {
          throw new Error(userData.message || 'Failed to fetch user data');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to load user data');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);


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
        // Only send password if it's being updated (not empty)
        if (key !== 'password' || formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      }
    }

    try {
      const result = await updateUser(id, formDataToSend);

      if (result.status === 1) {
        toast.success('User updated successfully!');
        setTimeout(() => navigate('/user'), 1000);
      } else {
        throw new Error(result.message || 'Failed to update user');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update user. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header common-flex justify-between items-center">
        <h4 className="card-title">Update User</h4>
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
            <label className="form-label">Password (leave blank to keep current)</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
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
            <label className="form-label">Aadhar Number</label>
            <input
              type="text"
              className={`form-control ${errors.aadhar_no ? 'is-invalid' : ''}`}
              name="aadhar_no"
              value={formData.aadhar_no}
              onChange={handleInputChange}
              maxLength="12"
              autoComplete="off"
            />
            {errors.aadhar_no && <div className="invalid-feedback">{errors.aadhar_no}</div>}
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

          {/* Status Field */}
          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
                  Updating...
                </>
              ) : 'Update User'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserEdit;