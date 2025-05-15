import React, { useState, useEffect } from 'react';
import { fetchPandits } from '../../Services/panditApiService';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewVendorTable = () => {
  const [panditData, setPanditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const IMGURL = 'http://localhost:3000/uploads/panditImages/';
  const defaultImage = 'https://img.freepik.com/premium-vector/man-professional-business-casual-young-avatar-icon-illustration_1277826-622.jpg';

  useEffect(() => {
    loadLatestPandits();
  }, []);

  const loadLatestPandits = async () => {
    try {
      setLoading(true);
      const response = await fetchPandits.getAll();
      // Sort by creation date (newest first) and take first 5 records
      const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPanditData(sortedData.slice(0, 5));
    } catch (error) {
      console.error('Error loading pandits:', error);
      toast.error(error.message || 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white border-bottom-0">
        <div className="header-top d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold">New Vendors</h5>
          <Link to="/pandit" className="btn btn-primary btn-sm text-white mr-2">
            View More
          </Link>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th width="5%" className="ps-4">#</th>
                <th width="10%">Image</th>
                <th width="20%">Email</th>
                <th width="15%">Mobile</th>
                <th width="15%">City</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : panditData.length > 0 ? (
                panditData.map((pandit, index) => (
                  <tr key={pandit._id}>
                    <td className="ps-4">{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="me-2">
                          <img
                            src={pandit.image ? IMGURL + pandit.image : defaultImage}
                            alt={pandit.username}

                            style={{ height: "50px", width: "50px", borderRadius: "50%" }}
                            onError={(e) => {
                              e.target.src = defaultImage;
                            }}
                          />
                        </div>
                        <div>
                          <span className="d-block fw-medium"><Link
                            to={`/pandit/${pandit._id}`}
                            className="text-primary text-decoration-none fw-medium"
                          >
                            {pandit.username}
                          </Link>
                          </span>
                        </div>
                      </div>

                    </td>

                    <td className="text-truncate" style={{ maxWidth: '200px' }}>
                      {pandit.email || 'N/A'}
                    </td>
                    <td>{pandit.mobile || 'N/A'}</td>
                    <td>{pandit.city || 'N/A'}</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No new vendors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewVendorTable;