import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import CategoryService from '../../services/Paramarsh/categoryService';
import GetTable from '../../Component/GetTable';

const ParamarshRequest = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';

  const fetchRequests = async () => {
    try {
      const data = await CategoryService.getAllParamarshRequests(token);
      setRequests(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch requests');
      toast.error('Failed to fetch requests!');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const intervalId = setInterval(fetchRequests, 1000); // Changed to 1000ms (1 second)
    return () => clearInterval(intervalId);
  }, []);

  const getStatusBadge = (status) => {
    return status === "1" ? (
      <span className="badge badge-light-success">Active</span>
    ) : (
      <span className="badge badge-light-danger">Inactive</span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    if (!status) return <span className="badge bg-secondary">Pending</span>;
    return status === "confirmed" ? (
      <span className="badge bg-success">Confirmed</span>
    ) : (
      <span className="badge bg-warning">Processing</span>
    );
  };

  const getAssignmentStatus = (status) => {
    return status === "1" ? (
      <span className="badge bg-success">Assigned</span>
    ) : (
      <span className="badge bg-warning">Not Assigned</span>
    );
  };

  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      sortable: true,
      width: '80px',
    },
    {
      name: 'User Name',
      selector: row => row.userName,
      sortable: true,
    },
    {
      name: 'Contact',
      selector: row => row.contact_no,
      sortable: true,
    },
    {
      name: 'Question',
      selector: row => row.question,
      sortable: true,
    },
    {
      name: 'DOB',
      selector: row => moment(row.dob).format('DD/MM/YYYY'),
      sortable: true,
    },
    {
      name: 'Payment Status',
      cell: (row) => getPaymentStatusBadge(row.paymentStatus),
      sortable: true,
    },
    {
      name: 'Assigned',
      cell: (row) => getAssignmentStatus(row.assignPanditStatus),
      sortable: true,
    },
    {
      name: 'Status',
      cell: (row) => getStatusBadge(row.status),
      sortable: true,
    },
    {
      name: 'Created At',
      selector: row => moment(row.created_at).format('DD/MM/YYYY'),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="p-2 text-blue-600 hover:text-blue-900 rounded hover:bg-blue-100"
            onClick={() => {
              // Add your view/edit logic here
            }}
          >
            <i className="fa-regular fa-eye"></i>
          </button>
          <button
            className="p-2 text-yellow-600 hover:text-yellow-900 rounded hover:bg-yellow-100"
            onClick={() => {
              // Add your edit logic here
            }}
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px',
    },
  ];

  return (
    <div className="col-span-12">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card">
        <div className="card-header pb-0 card-no-border">
          <h5 className="mb-3">Paramarsh Requests</h5>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger mb-3">
              {error}
            </div>
          )}
          <GetTable
            columns={columns}
            data={requests}
            loading={isLoading}
            title="Paramarsh Requests"
            noDataMessage="No requests found"
          />
        </div>
      </div>
    </div>
  );
};

export default ParamarshRequest;