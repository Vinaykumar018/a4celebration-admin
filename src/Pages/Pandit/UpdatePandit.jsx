import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams, Link } from 'react-router-dom';

const IMGURL = "http://localhost:3000/uploads/panditImages/";

const UpdatePandit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    address: '',
    longitude: '',
    latitude: '',
    password: '',
    alternate_no: '',
    gender: '',
    city: '',
    state: '',
    fcm_tokken: '',
    social_type: 'other',
    image: null,
    aadhar_no: '',
    aadhar_image: null,
    dob: '',
    country: '',
    pincode: '',
    skills: '',
    account_type: '',
    pancard_no: '',
    degree: '',
    bank_ac_no: '',
    experience: '',
    ifsc_code: '',
    acc_holder_name: '',
    bank_name: '',
    bio: '',
    type: '',
    register_id: '',
    booking_status: '',
    status: 'active',
    otp: '',
    approved: true,
    otp_verified: true,
    created_at: '',
    update_at: '',
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';

  // Set initial form data
  useEffect(() => {
    const fetchPanditData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/pandit/get-pandit/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch pandit data');
        }
        
        const responseResult = await response.json();
        const data = responseResult.data;
        
        if (!data) {
          throw new Error('No pandit data found');
        }
        
        setFormData(data);
        if (data.image) {
          // Check if image is already a full URL or just a path
          const previewUrl = data.image.startsWith('http') ? 
            data.image : 
            `${IMGURL}${data.image}`;
          setImagePreview(previewUrl);
        }
        setFetchError(null);
      } catch (error) {
        console.error('Error:', error);
        setFetchError(error.message);
        toast.error(`Failed to load pandit data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPanditData();
  }, [id]);

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

  // Validate PAN card number
  const validatePanCard = (pan) => {
    if (!pan) return true; // optional field
    const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return re.test(pan.toUpperCase());
  };

  // Validate IFSC code
  const validateIFSC = (ifsc) => {
    if (!ifsc) return true; // optional field
    const re = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return re.test(ifsc.toUpperCase());
  };

  // Validate bank account number
  const validateAccountNumber = (account) => {
    if (!account) return true; // optional field
    const re = /^\d{9,18}$/;
    return re.test(account);
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

    if (formData.pancard_no && !validatePanCard(formData.pancard_no)) {
      newErrors.pancard_no = 'Please enter a valid PAN card number';
    }

    if (formData.bank_ac_no && !validateAccountNumber(formData.bank_ac_no)) {
      newErrors.bank_ac_no = 'Please enter a valid account number (9-18 digits)';
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
    if (name === 'password' || name === 'bank_ac_no') {
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

  const handleAadharFileChange = (e) => {
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
      
      setFormData(prev => ({ ...prev, aadhar_image: file }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    const formDataToSend = new FormData();
    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        // Skip empty fields except for required ones
        if (formData[key] !== '' || 
            ['username', 'email', 'mobile', 'password'].includes(key)) {
          formDataToSend.append(key, formData[key]);
        }
      }
    }

    try {
      const response = await fetch(`http://localhost:3000/api/pandit/update-pandit/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const data = await response.json();
      toast.success('Pandit updated successfully!');
      setTimeout(() => navigate('/pandit'), 1000);
    } catch (error) {
      toast.error(error.message || 'Failed to update pandit. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchError) {
    return (
      <div className="card">
        <div className="card-header">
          <h4>Error Loading Pandit Data</h4>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <p>{fetchError}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Try Again
            </button>
            <Link to="/pandit" className="btn btn-secondary ms-2">
              Back to Pandit List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header common-flex justify-between items-center">
        <h4>Update Pandit</h4>
        <Link to="/pandit" className='btn btn-info text-white'>Pandit List</Link>
      </div>
      <div className="card-body">
        <form 
          className="grid grid-cols-12 gap-3 needs-validation" 
          noValidate 
          onSubmit={handleFormSubmit}
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
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
            />
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

          {/* Professional Information Section */}
          <div className="col-span-12 mt-4">
            <h5 className="mb-3">Professional Information</h5>
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Skills</label>
            <input
              type="text"
              className="form-control"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="Separate skills with commas"
            />
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Experience (years)</label>
            <input
              type="number"
              className="form-control"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              min="0"
              max="50"
            />
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Degree</label>
            <input
              type="text"
              className="form-control"
              name="degree"
              value={formData.degree}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-12 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Bio</label>
            <textarea
              className="form-control"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          {/* Aadhar Information Section */}
          <div className="col-span-12 mt-4">
            <h5 className="mb-3">Aadhar Information</h5>
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Aadhar Number</label>
            <input
              type="text"
              className={`form-control ${errors.aadhar_no ? 'is-invalid' : ''}`}
              name="aadhar_no"
              value={formData.aadhar_no}
              onChange={handleInputChange}
              pattern="\d{12}"
              maxLength="12"
            />
            {errors.aadhar_no && <div className="invalid-feedback">{errors.aadhar_no}</div>}
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Aadhar Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleAadharFileChange}
            />
            <small className="text-muted">Max size: 2MB</small>
          </div>

          {/* Bank Information Section */}
          <div className="col-span-12 mt-4">
            <h5 className="mb-3">Bank Information</h5>
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Account Holder Name</label>
            <input
              type="text"
              className="form-control"
              name="acc_holder_name"
              value={formData.acc_holder_name}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Bank Account Number</label>
            <input
              type="text"
              className={`form-control ${errors.bank_ac_no ? 'is-invalid' : ''}`}
              name="bank_ac_no"
              value={formData.bank_ac_no}
              onChange={handleInputChange}
              autoComplete="off"
            />
            {errors.bank_ac_no && <div className="invalid-feedback">{errors.bank_ac_no}</div>}
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Bank Name</label>
            <input
              type="text"
              className="form-control"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">IFSC Code</label>
            <input
              type="text"
              className={`form-control ${errors.ifsc_code ? 'is-invalid' : ''}`}
              name="ifsc_code"
              value={formData.ifsc_code}
              onChange={handleInputChange}
              autoComplete="off"
            />
            {errors.ifsc_code && <div className="invalid-feedback">{errors.ifsc_code}</div>}
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Pancard Number</label>
            <input
              type="text"
              className={`form-control ${errors.pancard_no ? 'is-invalid' : ''}`}
              name="pancard_no"
              value={formData.pancard_no}
              onChange={handleInputChange}
              autoComplete="off"
            />
            {errors.pancard_no && <div className="invalid-feedback">{errors.pancard_no}</div>}
          </div>

          {/* Other Information Section */}
          <div className="col-span-12 mt-4">
            <h5 className="mb-3">Other Information</h5>
          </div>

          <div className="col-span-6 xl:col-span-6 sm:col-span-12">
            <label className="form-label">Social Type</label>
            <select
              className="form-select"
              name="social_type"
              value={formData.social_type}
              onChange={handleInputChange}
            >
              <option value="other">Other</option>
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
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
              ) : 'Update'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UpdatePandit;