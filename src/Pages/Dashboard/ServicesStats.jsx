import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiList, FiAlertCircle, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { getServiceOrdersData } from '../../Services/all-orders-api-service';

const COLORS = {
  primary: '#5D3A7F',
  secondary: '#8E6CA0',
  accent: '#B399D4',
  text: '#333333',
  textLight: '#5D3A7F',
  background: '#ffffff',
  cardBackground: '#f9f9f9',
  iconBg: '#F0E6F6',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c'
};

export const ServicesStats = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    todayBookings: [],
    latestOrders: [],
    orderStatus: {
      pending: 0,
      processing: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getServiceOrdersData();
       
        processOrderData(response);
      } catch (err) {
        console.error('Error fetching service orders:', err);
        setError(err.message || 'Failed to load service order data');
      } finally {
        setLoading(false);
      }
    };

    const processOrderData = (orders) => {
  if (!orders || !orders.length) return;

  const today = new Date().toISOString().split('T')[0];
  
  // Process today's requested service orders - now checking product-level dates
  const todayBookings = orders
    .flatMap(order => {
      // For each product in the order, create a booking entry if it's for today
      return order.orderDetails?.products
        ?.filter(product => product.order_requested_date === today)
        .map(product => ({
          service: order.productDetails?.find(p => p.productId === product.productId)?.productName || 'Service',
          status: getStatusLabel(product.order_status || order.orderDetails?.order_status),
          time: product.order_requested_time || order.orderDetails?.order_requested_time || '--:--',
          orderId: order.order_id,
          productId: product.productId
        }));
    })
    .filter(Boolean) // Remove any undefined entries
    .sort((a, b) => {
      const timeA = a.time || '00:00';
      const timeB = b.time || '00:00';
      return timeA.localeCompare(timeB);
    });

  // Process latest service orders - sorted by date/time (newest first) and take first 3
  const latestOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(`${a.orderDetails?.order_requested_date} ${a.orderDetails?.order_requested_time}`);
      const dateB = new Date(`${b.orderDetails?.order_requested_date} ${b.orderDetails?.order_requested_time}`);
      return dateB - dateA;
    })
    .slice(0, 3)
    .map(order => ({
      id: `#${order.order_id}`,
      amount: `₹${order.paymentDetails?.totalAmount || 0}`,
      customer: order.userDetails?.username || 'Customer',
      date: order.orderDetails?.order_requested_date,
      time: order.orderDetails?.order_requested_time
    }));

  // Count service order statuses
  const statusCounts = orders.reduce((acc, order) => {
    const status = order.orderDetails?.order_status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {
    pending: 0,
    processing: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  setStats({
    todayBookings,
    latestOrders,
    orderStatus: statusCounts
  });
};
    const getStatusLabel = (status) => {
      switch(status) {
        case 'processing': return 'Processing';
        case 'confirmed': return 'Confirmed';
        case 'shipped': return 'Shipped';
        case 'delivered': return 'Delivered';
        case 'cancelled': return 'Cancelled';
        default: return 'Pending';
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <FiLoader className="animate-spin mr-2" size={24} color={COLORS.primary} />
      <span className="text-lg" style={{ color: COLORS.primary }}>Loading Service Data...</span>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <FiAlertTriangle className="mr-2" size={24} color={COLORS.error} />
      <span className="text-lg" style={{ color: COLORS.error }}>{error}</span>
    </div>
  );

  return (
    <div className="mb-8 p-6 bg-white rounded-lg">
      <h1 className="text-xl font-semibold" style={{ color: COLORS.primary }}>Services Overview</h1>
      <p className="text-sm text-gray-500 mt-1">Current service metrics and status</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        {/* Today's Service Orders Column */}
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: COLORS.iconBg }}>
              <FiCalendar style={{ color: COLORS.primary }} size={18} />
            </div>
            <h2 className="font-medium" style={{ color: COLORS.primary }}>Today's Orders</h2>
          </div>

          <div className="space-y-3">
            {stats.todayBookings.length > 0 ? (
              stats.todayBookings.map((booking, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{booking.service}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      booking.status === 'Delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : booking.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : booking.status === 'Confirmed'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-500 text-xs flex items-center">
                      <FiClock className="mr-1" size={12} />
                      {booking.time}
                    </p>
                    <span className="text-xs text-gray-400">#{booking.orderId}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                No orders requested today
              </div>
            )}
          </div>
        </div>

        {/* Recent Service Orders Column */}
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: COLORS.iconBg }}>
              <FiList style={{ color: COLORS.primary }} size={18} />
            </div>
            <h2 className="font-medium" style={{ color: COLORS.primary }}>Recent Orders</h2>
          </div>

          <div className="space-y-3">
            {stats.latestOrders.map((order, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between">
                  <span className="font-medium text-sm">{order.id}</span>
                  <span className="font-medium text-sm" style={{ color: COLORS.primary }}>{order.amount}</span>
                </div>
                <p className="text-gray-500 text-xs mt-1">{order.customer}</p>
                <p className="text-gray-400 text-xs flex items-center mt-1">
                  <FiCalendar className="mr-1" size={10} />
                  {order.date} at {order.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Order Status Column */}
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: COLORS.iconBg }}>
              <FiAlertCircle style={{ color: COLORS.primary }} size={18} />
            </div>
            <h2 className="font-medium" style={{ color: COLORS.primary }}>Service Order Status</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="flex items-center text-sm">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Pending
              </span>
              <span className="font-medium" style={{ color: COLORS.primary }}>{stats.orderStatus.pending}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="flex items-center text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Processing
              </span>
              <span className="font-medium" style={{ color: COLORS.primary }}>{stats.orderStatus.processing}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="flex items-center text-sm">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Confirmed
              </span>
              <span className="font-medium" style={{ color: COLORS.primary }}>{stats.orderStatus.confirmed}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="flex items-center text-sm">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                Shipped
              </span>
              <span className="font-medium" style={{ color: COLORS.primary }}>{stats.orderStatus.shipped}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Delivered
              </span>
              <span className="font-medium" style={{ color: COLORS.primary }}>{stats.orderStatus.delivered}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="flex items-center text-sm">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Cancelled
              </span>
              <span className="font-medium" style={{ color: COLORS.primary }}>{stats.orderStatus.cancelled}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};