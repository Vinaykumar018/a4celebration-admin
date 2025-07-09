import React from 'react';
import { FiCalendar, FiClock, FiList, FiAlertCircle } from 'react-icons/fi';


export const ServicesStats = ({ stats }) => {
  return (
    <div className='mb-6'>

    <h1 className="text-xl font-medium text-gray-800 mb-2">Services Overview</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

     
      {/* Today's Bookings Column */}
      <div className="bg-white p-4 rounded border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium flex items-center">
            <FiCalendar className="text-blue-500 mr-2" />
            Today's Bookings
          </h2>
        </div>
        <div className="space-y-3">
          {stats.todayBookings.map((booking, index) => (
            <div key={index} className="text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{booking.service}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-gray-500 text-xs flex items-center mt-1">
                <FiClock className="mr-1" size={12} />
                {booking.time}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Column */}
      <div className="bg-white p-4 rounded border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium flex items-center">
            <FiList className="text-green-500 mr-2" />
            Recent Orders
          </h2>
        </div>
        <div className="space-y-3">
          {stats.latestOrders.map((order, index) => (
            <div key={index} className="text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{order.id}</span>
                <span className="font-medium">{order.amount}</span>
              </div>
              <p className="text-gray-500 text-xs">{order.customer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Status Column */}
      <div className="bg-white p-4 rounded border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium flex items-center">
            <FiAlertCircle className="text-orange-500 mr-2" />
            Order Status
          </h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Pending
            </span>
            <span>{stats.orderStatus.pending}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Processing
            </span>
            <span>{stats.orderStatus.processing}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Completed
            </span>
            <span>{stats.orderStatus.completed}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Cancelled
            </span>
            <span>{stats.orderStatus.cancelled}</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};