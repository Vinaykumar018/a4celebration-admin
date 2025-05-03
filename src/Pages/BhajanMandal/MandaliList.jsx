import React, { useState, useEffect } from "react";
import GetTable from "../../Component/GetTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  deleteBhajanMandal, 
  fetchBhajanMandalData, 
  UpdateBhajanStatus,
  fetchCategories 
} from '../../Services/bhajanApiService';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaTrash, FaPlus, FaVideo } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import AddBhajanVideoModal from './AddVideoBhajanModal';

const MandalList = () => {
  const navigate = useNavigate();
  const [bhajanMandalData, setBhajanMandalData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bhajanMandalToDelete, setBhajanMandalToDelete] = useState(null);
  const [videoModal, setVideoModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [rowToView, setRowToView] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mandalData, categoriesData] = await Promise.all([
        fetchBhajanMandalData(),
        fetchCategories()
      ]);

      if (mandalData.status === 1) {
        setBhajanMandalData(mandalData.data);
      }
      if (categoriesData.status === 1) {
        setCategories(categoriesData.data);
      }
    } catch (error) {
      toast.error('Error loading data');
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const navigateToAddBhajanMandal = () => {
    navigate('/add-bhajan-mandal');
  };

  const handleEdit = (id) => {
    navigate(`/bhajan-mandal/edit/${id}`);
  };

  const handleDelete = (id) => {
    setBhajanMandalToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteBhajanMandal(bhajanMandalToDelete);
      if (response.status === 1) {
        toast.success("Bhajan Mandal deleted successfully!");
        setBhajanMandalData(bhajanMandalData.filter((item) => item._id !== bhajanMandalToDelete));
      } else {
        toast.error(response.message || "Failed to delete Bhajan Mandal.");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting Bhajan Mandal. Please try again.");
      console.error("Error deleting Bhajan Mandal:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleView = (row) => {
    setRowToView(row);
    setViewModalVisible(true);
  };

  const updateStatus = async (id, status) => {
    const newStatus = status == 0 ? 1 : 0;
    try {
      await UpdateBhajanStatus(id, newStatus);
      toast.success(`Status updated to ${newStatus == 1 ? 'Active' : 'Inactive'}`);
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status. Please try again.');
    }
  };

  const addVideo = (id) => {
    setSelectedId(id);
    setVideoModal(true);
  };

  const handlePreview = (id) => {
    navigate(`/preview/${id}`);
  };

  const getCategoryName = (categoryId) => {
    if (!categories || categories.length === 0) return 'Loading...';
    const category = categories.find(item => item._id === categoryId);
    return category ? category.category : 'Uncategorized';
  };

  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Name',
      selector: row => row.bhajan_name,
      sortable: true,
      cell: row => (
        <div style={{ whiteSpace: 'normal' }}>
          {row.bhajan_name}
        </div>
      ),
      wrap: true,
      width: "200px",
    },
    {
      name: 'Category',
      cell: row => getCategoryName(row.bhajan_category),
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: 'Price',
      selector: row => `₹${row.bhajan_price || '0'}`,
      sortable: true,
      width: '100px'
    },
    {
      name: 'Members',
      selector: row => row.bhajan_member || 'N/A',
      sortable: true,
      width: '100px'
    },
    {
      name: 'Owner',
      cell: row => (
        <div>
          <div><strong>Name:</strong> {row.bhajan_owner?.owner_name || 'N/A'}</div>
          <div><strong>Phone:</strong> {row.bhajan_owner?.owner_phone || 'N/A'}</div>
        </div>
      ),
      width: '200px'
    },
    {
      name: 'Status',
      cell: row => (
        <span 
          className={`badge ${row.status == 1 ? 'bg-success' : 'bg-danger'}`}
          style={{ cursor: 'pointer' }}
          onClick={() => updateStatus(row._id, row.status)}
        >
          {row.status == 1 ? 'Active' : 'Inactive'}
        </span>
      ),
      sortable: true,
      width: '120px',
    },
    {
      name: 'Profile',
      cell: row => (
        <span className={`badge ${row.profile_status == 1 ? 'bg-success' : 'bg-warning'}`}>
          {row.profile_status == 1 ? 'Complete' : 'Incomplete'}
        </span>
      ),
      sortable: true,
      width: '120px',
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(row)}
            className="p-2 text-indigo-600 hover:text-indigo-900 rounded hover:bg-indigo-100"
            data-tooltip-id="tooltip"
            data-tooltip-content="View"
          >
            <FaEye />
          </button>
          <button
            onClick={() => handleEdit(row._id)}
            className="p-2 text-blue-600 hover:text-blue-900 rounded hover:bg-blue-100"
            data-tooltip-id="tooltip"
            data-tooltip-content="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-2 text-red-600 hover:text-red-900 rounded hover:bg-red-100"
            data-tooltip-id="tooltip"
            data-tooltip-content="Delete"
          >
            <FaTrash />
          </button>
          <button
            onClick={() => addVideo(row._id)}
            className="p-2 text-green-600 hover:text-green-900 rounded hover:bg-green-100"
            data-tooltip-id="tooltip"
            data-tooltip-content="Add Video"
          >
            <FaVideo />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '200px',
    },
  ];

  return (
    <>
      <div className="card">
        <div className="card-header pb-2 pt-4 card-border">
          <div className='common-flex justify-between item-center'>
            <h5 className="mb-3">All Bhajan Mandals List</h5>
            <button 
              className='btn btn-info' 
              onClick={navigateToAddBhajanMandal}
              disabled={loading}
            >
              <FaPlus className="me-2" />
              Add Mandal
            </button>               
          </div>
        </div>
        <div className="card-body pt-5 pl-0 pr-0 pt-5">
          <GetTable
            columns={columns}
            data={bhajanMandalData}
            loading={loading}
            title="Complete Bhajan Mandal List"
            noDataMessage={loading ? "Loading..." : "No Bhajan Mandals found"}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Bhajan Mandal Deletion</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this Bhajan Mandal? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleConfirmDelete}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalVisible && rowToView && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Complete Bhajan Mandal Details</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setViewModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <h4>{rowToView.bhajan_name}</h4>
                    <p className="text-muted">Category: {getCategoryName(rowToView.bhajan_category)}</p>
                    
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <h6>Price:</h6>
                        <p>₹{rowToView.bhajan_price || '0'}</p>
                      </div>
                      <div className="col-md-4">
                        <h6>Members:</h6>
                        <p>{rowToView.bhajan_member || 'N/A'}</p>
                      </div>
                      <div className="col-md-4">
                        <h6>Experience:</h6>
                        <p>{rowToView.exp_year || 'N/A'} years</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h6>Owner Details:</h6>
                      <div className="border p-2 rounded bg-light">
                        <p><strong>Name:</strong> {rowToView.bhajan_owner?.owner_name || 'N/A'}</p>
                        <p><strong>Email:</strong> {rowToView.bhajan_owner?.owner_email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {rowToView.bhajan_owner?.owner_phone || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h6>Address:</h6>
                      <div className="border p-2 rounded bg-light">
                        <p>{rowToView.mandali_address?.address || 'N/A'}</p>
                        <p>{rowToView.mandali_address?.city || 'N/A'}, {rowToView.mandali_address?.state || 'N/A'}</p>
                        <p>{rowToView.mandali_address?.country || 'N/A'} - {rowToView.mandali_address?.pin_code || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h6>Short Description:</h6>
                      <div className="border p-2 rounded bg-light">
                        {rowToView.short_discription || 'N/A'}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className={`badge me-2 ${rowToView.status == 1 ? 'bg-success' : 'bg-danger'}`}>
                        {rowToView.status == 1 ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`badge ${rowToView.profile_status == 1 ? 'bg-success' : 'bg-warning'}`}>
                        {rowToView.profile_status == 1 ? 'Complete' : 'Incomplete'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setViewModalVisible(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModal && (
        <AddBhajanVideoModal id={selectedId} onClose={() => setVideoModal(false)} />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
      <ReactTooltip id="tooltip" effect="solid" />
    </>
  );
};

export default MandalList;