import React, { useEffect, useState } from 'react';
import GetTable from '../../Component/GetTable';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { getCustomizedRequests, updateRequestStatus } from '../../Services/customized-api-service';
import StatusUpdateModal from './StatusUpdateModal';

const AllCustomizedRequests = () => {
  const [requestsData, setRequestsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getCustomizedRequests();
        setRequestsData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Define columns for the table
  const columns = [
    {
      name: 'Request ID',
      selector: row => row._id,
      sortable: true,
      width: '150px',
      cell: row => <span className="text-blue-500 font-medium">{row._id}...</span>,
    },
    {
      name: 'Customer',
      selector: row => row.name,
      cell: row => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-gray-500">{row.phone_number}</div>
          {row.email && <div className="text-sm text-gray-500">{row.email}</div>}
        </div>
      ),
      sortable: true,
      width: '180px',
    },
    {
      name: 'Event Details',
      selector: row => row.event_date,
      cell: row => (
        <div>
          <div className="font-medium">
            {new Date(row.event_date).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-500">
            {row.guest_count} guests
          </div>
        </div>
      ),
      sortable: true,
      width: '150px',
    },
    {
      name: 'Preferences',
      cell: row => (
        <div>
          <div className="text-sm">
            <span className="font-medium">Food:</span> {row.food_preference}
          </div>
          <div className="text-sm">
            <span className="font-medium">Budget:</span> {row.budget_range}
          </div>
        </div>
      ),
      width: '200px',
    },
    {
      name: 'Package Customizations',
      cell: row => (
        <div className="flex flex-wrap gap-1">
          {Object.entries(row.package_customizations).map(([key, value]) => (
            value && (
              <span 
                key={key}
                className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs capitalize"
              >
                {key}
              </span>
            )
          ))}
        </div>
      ),
      width: '200px',
    },
    {
      name: 'Status',
      selector: row => row.status,
      cell: row => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.status === 'pending' ? 'bg-orange-100 text-orange-800' :
          row.status === 'approved' ? 'bg-green-100 text-green-800' :
          row.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.status.toUpperCase()}
        </span>
      ),
      sortable: true,
      width: '120px',
    },
    {
      name: 'Special Requirements',
      selector: row => row.special_requirements,
      cell: row => (
        <div className="text-sm text-gray-600 line-clamp-2">
          {row.special_requirements || 'None'}
        </div>
      ),
      width: '200px',
    },
    {
      name: 'Submitted On',
      selector: row => row.createdAt,
      cell: row => (
        <div className="text-sm">
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      ),
      sortable: true,
      width: '120px',
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
            onClick={() => handleApproveRequest(row._id)}
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

  const handleView = (requestId) => {
    // Implement view details logic
    console.log('View request:', requestId);
  };

 const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedRequest, setSelectedRequest] = useState(null);

// Update your handleApproveRequest function
const handleApproveRequest = (requestId) => {
  const request = requestsData.find(r => r._id === requestId);
  setSelectedRequest(request);
  setIsModalOpen(true);
};

// Add this function to handle the actual status update
const handleUpdateStatus = async (requestId, updateData) => {
  try {
    const updatedRequest = await updateRequestStatus(requestId, updateData);
    
    // Update the local state
    setRequestsData(prev => 
      prev.map(req => 
        req._id === requestId ? { ...req, ...updatedRequest } : req
      )
    );
    
    return updatedRequest;
  } catch (error) {
    throw error;
  }
};

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="card">
          <div className="card-header pb-2 pt-4 card-border mb-5">
            <div className='common-flex justify-between item-center'>
              <h5 className="mb-3">All Customized Requests</h5>
              <button className='btn btn-info'>
                All Requests
              </button>
            </div>
          </div>
          <GetTable 
            columns={columns} 
            data={requestsData} 
            title="Customized Requests"
            showSearch={true}
            showPagination={true}
          />
        </div>
      )}
      <StatusUpdateModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  currentStatus={selectedRequest?.status || 'pending'}
  onUpdateStatus={handleUpdateStatus}
  requestId={selectedRequest?._id}
/>
    </div>
  );
};

export default AllCustomizedRequests;