import React from 'react';
import { 
  FiShoppingCart, 
  FiDollarSign, 
  FiTrendingUp,
  FiUsers,
  FiPackage,
  FiCreditCard
} from 'react-icons/fi';

export const EcommerceStats = ({ stats }) => {
  return (
    <div className='mb-6'>
      <h1 className="text-xl font-medium text-gray-800 mb-2">Ecommerce Overview</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        
        {/* Sales Summary Column */}
        <div className="bg-white p-4 rounded border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium flex items-center">
              <FiDollarSign className="text-green-500 mr-2" />
              Sales Summary
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Total Revenue</span>
              <span className="font-medium">{stats.totalRevenue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Today's Revenue</span>
              <span className="font-medium">{stats.todayRevenue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Avg. Order Value</span>
              <span className="font-medium">$85.60</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Conversion Rate</span>
              <span className="font-medium">3.2%</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions Column */}
        <div className="bg-white p-4 rounded border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium flex items-center">
              <FiShoppingCart className="text-blue-500 mr-2" />
              Recent Transactions
            </h2>
          </div>
          <div className="space-y-3">
            {stats.latestOrders.map((order, index) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">#{order.id.split('-')[1]}</span>
                  <span className="font-medium">{order.amount}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>{order.customer}</span>
                  <span className={`${
                    order.status === 'Processing' ? 'text-yellow-500' :
                    order.status === 'Shipped' ? 'text-blue-500' :
                    'text-green-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer & Inventory Column */}
        <div className="bg-white p-4 rounded border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium flex items-center">
              <FiUsers className="text-purple-500 mr-2" />
              Customers & Inventory
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiUsers className="text-gray-400 mr-2" size={16} />
                <span>Total Customers</span>
              </div>
              <span className="font-medium">{stats.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiPackage className="text-gray-400 mr-2" size={16} />
                <span>Products in Stock</span>
              </div>
              <span className="font-medium">1,248</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiTrendingUp className="text-gray-400 mr-2" size={16} />
                <span>Monthly Growth</span>
              </div>
              <span className="font-medium text-green-500">+12.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiCreditCard className="text-gray-400 mr-2" size={16} />
                <span>Payment Methods</span>
              </div>
              <span className="font-medium">4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};