import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../../Services/all-orders-api-service';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaHome, FaCreditCard, FaBox, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Orders = () => {
  const { orderID } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-orange-100 text-orange-800' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-600' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-400 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrders();
        const orders = response || [];
        const matchedOrder = orders.find(order => order.order_id === orderID);
        setOrderData(matchedOrder || null);
        if (matchedOrder) {
          setStatus(matchedOrder.orderDetails.order_status);
        }
      } catch (err) {
        console.log(err);
        setError(err?.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderID]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await updateOrderStatus(orderData._id, { status });
      setOrderData(prev => ({
        ...prev,
        orderDetails: {
          ...prev.orderDetails,
          order_status: status
        }
      }));
      toast.success("Status updated successfully!", { autoClose: 2000 });
    } catch (err) {
      toast.error("Failed to update status: " + (err.message || ""), { autoClose: 3000 });
      setError(err.message || 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen"><p className="text-red-500">{error}</p></div>;
  if (!orderData) return <div className="flex justify-center items-center h-screen"><p>No order found for ID: {orderID}</p></div>;

  const statusColors = {
    pending: 'bg-orange-100 text-orange-800',
    processing: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-300 text-green-900',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <ToastContainer position="top-right" autoClose={3000} />


      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Order Header */}
        <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Order Details</h1>
          <div className="flex items-center space-x-4">
            <span className="text-lg">#{orderData.order_id}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[orderData.orderDetails.order_status] || 'bg-gray-200'}`}>
              {orderData.orderDetails.order_status}
            </span>
          </div>
        </div>
        {/* Status Update Section */}
        <div className="p-4 border-t">
          <form onSubmit={handleStatusUpdate} className="flex items-end gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="status-select" className="text-sm font-medium text-gray-700">
                  Update Status
                </label>
               
              </div>
              <select
                id="status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              >
                {statusOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className={status === option.value ? option.color : ''}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="px-3 py-2 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 disabled:opacity-50"
              disabled={isSubmitting || status === orderData.orderDetails.order_status}
            >
              {isSubmitting ? '...' : 'Update'}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* User Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <FaUser className="text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold">Customer Information</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <FaUser className="text-gray-400 mr-2" />
                <span>{orderData.userDetails.username}</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-gray-400 mr-2" />
                <span>{orderData.userDetails.contactNumber}</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-2" />
                <span>{orderData.userDetails.email}</span>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <FaHome className="text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold">Delivery Address</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1" />
                <div>
                  <p>{orderData.addressDetails.home_address}</p>
                  <p>{orderData.addressDetails.street_address}</p>
                  <p>{orderData.addressDetails.city_address} - {orderData.addressDetails.pincode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <FaCreditCard className="text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold">Payment Information</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold">₹{orderData.paymentDetails.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-semibold">
                  {orderData.paymentDetails.paymentMethodType === 'cod' ? 'Cash on Delivery' : orderData.paymentDetails.paymentMethodType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${orderData.paymentDetails.transactionStatus === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                  {orderData.paymentDetails.transactionStatus}
                </span>
              </div>
            </div>
          </div>
        </div>



        {/* Order Details Section */}
        <div className="p-6 border-t">
          <div className="flex items-center mb-4">
            <FaBox className="text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold">Order Summary</h2>
          </div>

        <div className="mb-6">
  {orderData.orderDetails.products.map((product, index) => (
    <div key={index} className="mb-4 border-b pb-3 last:border-b-0">
      <div className="flex items-center space-x-4 mb-2">
        <FaBox className="text-gray-400" />
        <span className="font-medium">Product ID: {product.productId}</span>
      </div>
      
      {/* Product-specific date with fallback indicator */}
      <div className="flex items-center space-x-4 mb-2 ml-7">
        <FaCalendarAlt className="text-gray-400" />
        <span>
          {product.order_requested_date ? (
            <>Date: {product.order_requested_date}</>
          ) : (
            <span className="text-gray-500">
              Ordered Date: {orderData.orderDetails.order_requested_date}
              
            </span>
          )}
        </span>
      </div>
      
      {/* Product-specific time with fallback indicator */}
      <div className="flex items-center space-x-4 mb-2 ml-7">
        <FaClock className="text-gray-400" />
        <span>
          {product.order_requested_time ? (
            <>Time: {product.order_requested_time}</>
          ) : (
            <span className="text-gray-500">
              Ordered Time: {orderData.orderDetails.order_requested_time}
              <span className="ml-2 text-xs text-gray-400">(fallback)</span>
            </span>
          )}
        </span>
      </div>
    </div>
  ))}
  
  {/* Delivery notes */}
  <div className="bg-gray-50 p-3 rounded mt-4">
    <p className="text-gray-600">{orderData.deliveryNotes}</p>
  </div>
</div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Product</th>
                  <th className="py-2 px-4 text-left">Quantity</th>
                  <th className="py-2 px-4 text-left">Price</th>
                  <th className="py-2 px-4 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderData.productDetails.map((product, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4">
                      <div className="font-medium">{product.productName}</div>
                      <div className="text-sm text-gray-500">
                        {product.service_date} • {product.service_time}
                      </div>
                    </td>
                    <td className="py-3 px-4">{product.quantity}</td>
                    <td className="py-3 px-4">₹{product.amount}</td>
                    <td className="py-3 px-4">₹{product.amount * product.quantity}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <td className="py-3 px-4 font-semibold text-right" colSpan="3">Total</td>
                  <td className="py-3 px-4 font-semibold">₹{orderData.paymentDetails.totalAmount}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;