import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../../Services/userApiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaCalendarAlt, FaEye } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import GetTable from '../../Component/GetTable';

function User() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      setStatus('loading');
      const response = await fetchUsers.getAll();
      setUsers(response);
      setStatus('success');
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error(error.message || 'Failed to fetch users. Please try again.');
      setStatus('error');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await fetchUsers.updateStatus(userId, newStatus);
      if (response.status === 1) {
        toast.success('User status updated successfully!');
        loadUsers();
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const handleEdit = (id) => {
    navigate(`/user/update-user/${id}`);
  };

  const navigateToAddUser = () => {
    navigate('/user/add-user');
  };

  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Image',
      cell: (row) => (
        <img 
          src={row.image || 'https://img.freepik.com/premium-vector/man-professional-business-casual-young-avatar-icon-illustration_1277826-622.jpg?semt=ais_hybrid'} 
          alt={row.username} 
          width="50" 
          height="50"
          className="rounded-full"
        />
      ),
      width: '100px',
    },
    {
      name: 'Username',
      selector: row => row.username,
      sortable: true,
      cell: (row) => <Link to={`/user/${row._id}`} className="text-blue-600 hover:text-blue-800">{row.username}</Link>,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Mobile',
      selector: row => row.mobile,
      sortable: true,
    },
    {
      name: 'City',
      selector: row => row.city,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: (row) => (
        <span 
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row._id)}
            className="p-2 text-blue-600 hover:text-blue-900 rounded hover:bg-blue-100"
            data-tooltip-id="tooltip"
            data-tooltip-content="Edit"
          >
            <FaEdit />
          </button>
          <Link 
            to={`/user/bookings/${row._id}`} 
            className="p-2 text-green-600 hover:text-green-900 rounded hover:bg-green-100"
            data-tooltip-id="tooltip"
            data-tooltip-content="Bookings"
          >
            <FaCalendarAlt />
          </Link>
          <Link 
            to={`/user/${row._id}`} 
            className="p-2 text-indigo-600 hover:text-indigo-900 rounded hover:bg-indigo-100"
            data-tooltip-id="tooltip"
            data-tooltip-content="View"
          >
            <FaEye />
          </Link>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '180px',
    },
  ];

  return (
    <>
    <div className="card">
      <div className="card-header pb-2 pt-4 card-border">
          <div className='common-flex justify-between item-center'>
            <h5 className="mb-3">All User</h5>
            <Link className='btn btn-info' to={'/user/add-user'}>Add User</Link>               
          </div>
        </div>
      <div className="card-body pt-5 pl-0 pr-0 pt-5">
        <GetTable
          columns={columns}
          data={users}
          loading={status === 'loading'}
          title="Users List"
          onAddClick={navigateToAddUser}
          addButtonText="Add User"
        />
      </div>
    </div>  
      <ToastContainer position="top-right" autoClose={3000} />
      <ReactTooltip id="tooltip" effect="solid" />
    </>
  );
}

export default User;