import React, { useState, useEffect } from 'react';
import { getOrders } from '../../Services/all-orders-api-service';
import GetTable from '../../Component/GetTable';

const Transaction = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrders();
        setOrdersData(response || []);
      } catch (err) {
        console.log(err);
        setError(err?.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  const columns = [
    {
      name: 'Order ID',
      accessor: 'order_id',
      width: '150px', // Fixed width for order IDs
      cell: (row) => <span className="font-medium text-blue-600">{row.order_id}</span>
    },
    {
      name: 'Transaction ID',
      accessor: 'paymentDetails.transactionId',
      width: '180px', // Wider for transaction IDs which can be long
      cell: (row) => row.paymentDetails.transactionId || <span className="text-gray-400">N/A</span>
    },
    {
      name: 'Total Amount',
      accessor: 'paymentDetails.totalAmount',
      width: '180px', // Fixed width for amounts
      cell: (row) => <span className="font-medium">₹{row.paymentDetails.totalAmount.toLocaleString()}</span>
    },

    {
      name: 'Payment Method',
      accessor: 'paymentDetails.paymentMethodType',
      width: '200px', // Enough space for payment method names
      cell: (row) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {row.paymentDetails.paymentMethodType.toUpperCase()}
        </span>
      )
    },
    {
      name: 'Payment Status',
      accessor: 'paymentDetails.transactionStatus',
      width: '200px', // Fixed width for status badges
      cell: (row) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${row.paymentDetails.transactionStatus === 'completed'
            ? 'bg-green-100 text-green-800'
            : row.paymentDetails.transactionStatus === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
          {row.paymentDetails.transactionStatus.charAt(0).toUpperCase() + row.paymentDetails.transactionStatus.slice(1)}
        </span>
      )
    },
    {
      name: 'Order Date',
      accessor: 'orderDetails.order_requested_date',
      width: '160px', // Enough space for date and time
      cell: (row) => (
        <div className="flex flex-col">
          <span>{new Date(row.orderDetails.order_requested_date).toLocaleDateString()}</span>

        </div>
      )
    }
  ];
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error: {error}. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
            <div className="flex items-center">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {ordersData.length} {ordersData.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            View and manage all your recent transactions
          </p>
        </div>

        <div className="overflow-x-auto">
          {ordersData.length > 0 ? (
            <GetTable
              data={ordersData}
              columns={columns}
              className="min-w-full divide-y divide-gray-200"
              style={{ tableLayout: 'fixed' }} // Ensures consistent column widths
            />
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">You don't have any transactions yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;