import React, { useState, useEffect } from 'react';
import {
  FiShoppingCart,
  FiUsers,
  FiTrendingUp,
  FiDollarSign,
  FiLoader,
  FiAlertCircle
} from 'react-icons/fi';
import { getOrders } from '../../Services/all-orders-api-service';
import { getAllUsers } from '../../Services/all-users-api-service';

// Updated lighter color palette
const COLORS = {
  primary: '#5D3A7F',       // Softer brinjal purple
  secondary: '#8E6CA0',     // Lighter purple
  accent: '#B399D4',        // Very light purple
  text: '#333333',
  textLight: '#5D3A7F',     // Brinjal for light text
  background: '#ffffff',
  cardBackground: '#f9f9f9',
  iconBg: '#F0E6F6',        // Very light purple
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c'
};

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
        const [ordersResponse, usersResponse] = await Promise.all([
          getOrders(),
          getAllUsers()
        ]);
        calculateStats(ordersResponse, usersResponse.data);
       
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err?.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    const calculateStats = (orders, users) => {
      if (!orders || !orders.length) return;

      const today = new Date().toISOString().split('T')[0];
      const validRevenueOrders = orders.filter(order => {
        const payment = order.paymentDetails || {};
        const orderStatus = order.orderDetails?.order_status || '';
        return (
          (payment.paymentMethodType === 'razorpay' && payment.transactionStatus === 'completed') ||
          (payment.paymentMethodType === 'cod' && payment.transactionStatus === 'completed')
        );
      });

      const todayValidRevenueOrders = validRevenueOrders.filter(
        order => order.orderDetails?.order_requested_date === today
      );

      setStats({
        totalOrders: orders.length,
        totalRevenue: validRevenueOrders.reduce(
          (sum, order) => sum + (order.paymentDetails?.totalAmount || 0), 0),
        todayRevenue: todayValidRevenueOrders.reduce(
          (sum, order) => sum + (order.paymentDetails?.totalAmount || 0), 0),
        totalUsers: users?.length || 0
      });
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <FiLoader className="animate-spin mr-2" size={24} color={COLORS.primary} />
      <span className="text-lg" style={{ color: COLORS.primary }}>Loading Dashboard...</span>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <FiAlertCircle className="mr-2" size={24} color={COLORS.error} />
      <span className="text-lg" style={{ color: COLORS.error }}>{error}</span>
    </div>
  );

  return (
    <div className="p-4 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Key metrics and performance indicators
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          icon={<FiShoppingCart size={20} />}
          title="Total Orders"
          value={stats.totalOrders}
          trend="up"
          color={COLORS.primary}
        />

        <MetricCard
          icon={<FiDollarSign size={20} />}
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          trend="up"
          color={COLORS.primary}
        />

        <MetricCard
          icon={<FiTrendingUp size={20} />}
          title="Today's Revenue"
          value={`₹${stats.todayRevenue.toLocaleString()}`}
          trend="up"
          color={COLORS.primary}
        />

        <MetricCard
          icon={<FiUsers size={20} />}
          title="Total Users"
          value={stats.totalUsers}
          trend="up"
          color={COLORS.primary}
        />
      </div>
    </div>
  );
};

// Simplified Metric Card Component
const MetricCard = ({ icon, title, value, color }) => {
  return (
    <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start">
        <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: COLORS.iconBg }}>
          {React.cloneElement(icon, { color: color })}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold" style={{ color: color }}>{value}</p>
        </div>
      </div>
    </div>
  );
};