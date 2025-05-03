import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEllipsisV } from 'react-icons/fa';
import { fetchUsers } from '../../Services/userApiService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewUserTable = () => {
  const [latestUsers, setLatestUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLatestUsers = async () => {
      try {
        const response = await fetchUsers.getAll();
        // Sort by newest first (assuming createdAt field exists) and get first 5 users
        const sortedUsers = [...response]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setLatestUsers(sortedUsers);
      } catch (error) {
        console.error('Error loading latest users:', error);
        toast.error(error.message || 'Failed to fetch latest users');
      } finally {
        setLoading(false);
      }
    };

    loadLatestUsers();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="card">
      <div className="card-header card-no-border">
        <div className="header-top d-flex justify-content-between align-items-center mr-2">
          <h5 className="mb-0">New Users</h5>
          <Link to="/user" className="btn btn-primary btn-sm text-white">
            View More
          </Link>
        </div>
      </div>
      <div className="card-body px-0 pt-0 common-option">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="table table-hover">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="ps-4">#</th>
                <th scope="col">User</th>
                <th scope="col">Mobile</th>
                <th scope="col">Email</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {latestUsers.length > 0 ? (
                latestUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td className="ps-4">{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="me-2">
                          <img 
                            className="rounded-circle" 
                            src={user.image || 'https://img.freepik.com/premium-vector/man-professional-business-casual-young-avatar-icon-illustration_1277826-622.jpg'} 
                            alt={user.username} 
                            
                            style={{height:"50px",width:"50px",borderRadius:"50%"}}

                          />
                        </div>
                        <div>
                          <span className="d-block fw-medium">{user.username}</span>
                        </div>
                      </div>
                    </td>
                    <td>{user.mobile || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>
                      <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                        {user.status || 'N/A'}
                      </span>
                    </td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewUserTable;