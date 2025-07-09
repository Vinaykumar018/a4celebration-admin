import React from 'react';
import {
  FiShoppingCart,
  FiUsers,
  FiTrendingUp,
  FiDollarSign
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { getOrders } from '../../Services/all-orders-api-service';
import { getAllUsers } from '../../Services/all-users-api-service';

export const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both orders and users in parallel
        const [ordersResponse, usersResponse] = await Promise.all([
          getOrders(),
          getAllUsers()
        ]);
        console.log(usersResponse)

        calculateStats(ordersResponse, usersResponse);
      } catch (err) {
        console.log(err);
        setError(err?.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    const calculateStats = (orders, users) => {
      if (!orders || !orders.length) return;

      const today = new Date().toISOString().split('T')[0];

      // Calculate revenue from valid orders only
      const validRevenueOrders = orders.filter(order => {
        const payment = order.paymentDetails || {};
        const orderStatus = order.orderDetails?.order_status || '';

        return (
          (payment.paymentMethodType === 'razorpay' && payment.transactionStatus === 'success') ||
          (payment.paymentMethodType === 'cod' && orderStatus === 'completed')
        );
      });

      const todayValidRevenueOrders = validRevenueOrders.filter(
        order => order.orderDetails?.order_requested_date === today
      );

      const newStats = {
        totalOrders: orders.length,
        totalRevenue: validRevenueOrders.reduce(
          (sum, order) => sum + (order.paymentDetails?.totalAmount || 0), 0),
        todayRevenue: todayValidRevenueOrders.reduce(
          (sum, order) => sum + (order.paymentDetails?.totalAmount || 0), 0),
        totalUsers: users?.length || 0 // Get user count from users API
      };

      setStats(newStats);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-800">Dashboard Overview</h1>
      </div>

      {/* Key Metrics - Only the 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders Card */}
        <div className="bg-white p-4 rounded border">
          <div className="flex items-center">
            <FiShoppingCart className="text-blue-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="font-medium">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white p-4 rounded border">
          <div className="flex items-center">
            <FiDollarSign className="text-green-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="font-medium">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Today's Revenue Card */}
        <div className="bg-white p-4 rounded border">
          <div className="flex items-center">
            <FiTrendingUp className="text-purple-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500">Today's Revenue</p>
              <p className="font-medium">₹{stats.todayRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Total Users Card */}
        <div className="bg-white p-4 rounded border">
          <div className="flex items-center">
            <FiUsers className="text-orange-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="font-medium">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};