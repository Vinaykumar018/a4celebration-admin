import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    expiryDate: '',
    isActive: true,
    usageLimit: 1
  });
  const [applyCode, setApplyCode] = useState('');
  const [applyResult, setApplyResult] = useState(null);

  // Fetch all coupons on component mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/get/allcoupons`);
        setCoupons(response.data);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
    fetchCoupons();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCoupon({
      ...newCoupon,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/create/coupon`, newCoupon);
      setCoupons([...coupons, response.data]);
      setNewCoupon({
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        expiryDate: '',
        isActive: true,
        usageLimit: 1
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert(error.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/apply/coupon`, { code: applyCode });
      setApplyResult(response.data);
    } catch (error) {
      console.error('Error applying coupon:', error);
      setApplyResult({ valid: false, message: error.response?.data?.message || 'Invalid coupon' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Coupon Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Add New Coupon
        </button>
      </div>

      {/* Coupon Application Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Apply Coupon</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={applyCode}
            onChange={(e) => setApplyCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleApplyCoupon}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Apply
          </button>
        </div>
        {applyResult && (
          <div className={`mt-2 p-2 rounded-md ${applyResult.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {applyResult.message || (applyResult.valid ? 'Coupon applied successfully!' : 'Invalid coupon')}
            {applyResult.valid && (
              <div className="mt-1">
                Discount: {applyResult.discountValue}
                {applyResult.discountType === 'percentage' ? '%' : '$'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Coupons Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Code</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Discount Type</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Value</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Expiry Date</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Usage</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.map((coupon, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">{coupon.code}</td>
                <td className="py-3 px-4 text-gray-600 capitalize">{coupon.discountType}</td>
                <td className="py-3 px-4 text-gray-600">
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}%` 
                    : `₹${coupon.discountValue}`}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {coupon.usedCount}/{coupon.usageLimit}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold text-gray-800">Add New Coupon</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
             <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={newCoupon.code}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. SUMMER20"
                />
              </div>

              <div>
                <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type
                </label>
                <select
                  id="discountType"
                  name="discountType"
                  value={newCoupon.discountType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value {newCoupon.discountType === 'percentage' ? '(%)' : '($)'}
                </label>
                <input
                  type="number"
                  id="discountValue"
                  name="discountValue"
                  value={newCoupon.discountValue}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={newCoupon.expiryDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700 mb-1">
                  Usage Limit
                </label>
                <input
                  type="number"
                  id="usageLimit"
                  name="usageLimit"
                  value={newCoupon.usageLimit}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={newCoupon.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active Coupon
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;