import React, { useEffect, useState } from 'react';
import GetTable from '../../Component/GetTable';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllUsers, updateUserStatus, deleteUserById } from '../../Services/all-users-api-service';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch users');
        toast.error(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdate = (id) => {
    navigate(`/update/user/${id}`);
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await updateUserStatus(userId, newStatus);
      console.log(response)

      if (response.status) {
        toast.success(`User status updated to ${newStatus}`);
        setUsers(users.map(user =>
          user._id === userId ? { ...user, status: newStatus } : user
        ));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const response = await deleteUserById(userToDelete._id);

      if (response.status) {
        toast.success('User deleted successfully!');
        setUsers(users.filter(user => user._id !== userToDelete._id));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setLoading(false);
      setShowModal(false);
      setUserToDelete(null);
    }
  };

  const columns = [
    {
      name: 'Name',
      selector: row => row.username,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Phone',
      selector: row => row.mobile || '-',
      sortable: true,
    },
    {
      name: 'Role',
      selector: row => row.role,
      sortable: true,
    },
    {
      name: 'Status',
      cell: row => (
        <button
          onClick={() => handleStatusToggle(row._id, row.status)}
          className={`flex items-center gap-1 ${row.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}
          title={row.status === 'active' ? 'Deactivate user' : 'Activate user'}
          disabled={loading}
        >
          {row.status === 'active' ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
          {row.status}
        </button>
      ),
      sortable: true,
    },
    {
      name: 'Login At',
      selector: row => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
      wrap: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="flex gap-2">

          <button
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
            onClick={() => confirmDelete(row)}
            title="Delete"
            disabled={loading}
          >
            <FaTrash />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  return (
    <div>
      <div className="card">
        <div className="card-header pb-2 pt-4 card-border">
          <div className='common-flex justify-between item-center'>
            <h5 className="mb-3">All Users</h5>
            <button className='btn btn-info'>
              All Users
            </button>
          </div>
        </div>
        <div className="card-body pt-5 pl-0 pr-0 pt-5">
          <GetTable
            columns={columns}
            data={users}
            title="Users List"
            progressPending={loading}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete user <strong>{userToDelete?.username}</strong>?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Users;