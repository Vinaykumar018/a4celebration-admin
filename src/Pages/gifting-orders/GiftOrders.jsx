import React, { useEffect, useState } from 'react';
import GetTable from '../../Component/GetTable';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { getOrders } from '../../Services/gifting-orders-api-service'; 

const GiftOrders = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrders();
        
        setOrdersData(response || []); // Ensure we always have an array
      } catch (err) {
        console.log(err);
        setError(err?.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  console.log(ordersData)

  // Define columns for the table
const columns = [
  {
    name: 'Order ID',
    selector: row => row.order_id,
    sortable: true,
    width: '150px',
    wrap: true,
  },
  {
    name: 'Customer',
    selector: row => row.userDetails.username,
    cell: row => (
      <div>
        <div className="font-medium">{row.userDetails.username}</div>
        <div className="text-sm text-gray-500">{row.userDetails.contactNumber}</div>
      </div>
    ),
    sortable: true,
    width: '180px',
  },
  {
    name: 'Order Status',
    selector: row => row.orderDetails.order_status,
    cell: row => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        row.orderDetails.order_status === 'processing' ? 'bg-orange-100 text-orange-800' :
        row.orderDetails.order_status === 'completed' ? 'bg-green-100 text-green-800' :
        row.orderDetails.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {row.orderDetails.order_status.toUpperCase()}
      </span>
    ),
    sortable: true,
    width: '150px',
  },
  {
    name: 'Order Date',
    selector: row => row.orderDetails.order_requested_date,
    cell: row => (
      <div>
        <div>{row.orderDetails.order_requested_date}</div>
        <div className="text-sm text-gray-500">{row.orderDetails.order_requested_time}</div>
      </div>
    ),
    sortable: true,
    width: '150px',
  },
  {
    name: 'Products',
    selector: row => row.productDetails.map(p => p.productName).join(', '),
    cell: row => (
      <div>
        {row.productDetails.map(product => (
          <div key={product._id} className="mb-1">
            <div>{product.productName}</div>
            <div className="text-sm text-gray-500">
              {product.quantity} × ₹{product.amount} = ₹{product.quantity * product.amount}
            </div>
          </div>
        ))}
      </div>
    ),
    wrap: true,
    width: '200px',
  },
  {
    name: 'Payment',
    selector: row => row.paymentDetails.paymentMethodType,
    cell: row => (
      <div>
        <div className="font-medium">₹{row.paymentDetails.totalAmount}</div>
        <div className="text-sm text-gray-500 capitalize">
          {row.paymentDetails.paymentMethodType} ({row.paymentDetails.transactionStatus})
        </div>
      </div>
    ),
    sortable: true,
    width: '150px',
  },
  {
    name: 'Requested Delivery Date',
    selector: row => row.deliveryNotes,
    cell: row => {
      const match = row.deliveryNotes.match(/for (.*?) between (.*)/);
      return match ? (
        <div>
          <div className="font-medium">{match[1]}</div>
          <div className="text-sm text-gray-500">{match[2]}</div>
        </div>
      ) : (
        <div>{row.deliveryNotes}</div>
      );
    },
    sortable: true,
    width: '200px',
  },
  {
    name: 'Action',
    cell: row => (
      <div className="flex gap-2">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          onClick={() => handleView(row._id)}
          title="View Details"
        >
          <FaEye />
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
          onClick={() => handleUpdateStatus(row._id)}
          title="Update Status"
        >
          <FaEdit />
        </button>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: '120px',
  }
];

const handleView = (orderId) => {
  // Implement view details logic
};

const handleUpdateStatus = (orderId) => {
  // Implement status update logic
};

const confirmDelete = (order) => {
  // Implement delete confirmation logic
};

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
<div className="card">
        <div className="card-header pb-2 pt-4 card-border mb-5">
          <div className='common-flex justify-between item-center'>
            <h5 className="mb-3">All Gift Orders</h5>
            <button className='btn btn-info' >
              All Gift Orders
            </button>
          </div>
        </div>
        <GetTable 
        
          columns={columns} 
          data={ordersData} 
          title="Orders List"
          showSearch={true}
          showPagination={true}
        />
        </div>
      )}
      
    </div>
  );
};

export default GiftOrders ;