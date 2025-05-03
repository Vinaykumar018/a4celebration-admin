import React, { useState, useEffect } from 'react';
import { fetchBhojRequests, cancelBhojRequest, requestPandit } from '../../Services/brahmanBhojApiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaTimes, FaUserPlus, FaChevronDown, FaChevronUp, FaIdCard, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaGlobe, FaUsers, FaClipboardCheck, FaStickyNote } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import GetTable from '../../Component/GetTable';

const BrahmanBhoj = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bhojToCancel, setBhojToCancel] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [rowToView, setRowToView] = useState(null);
  const [showPanditModal, setShowPanditModal] = useState(false);
  const [moreInfoExpanded, setMoreInfoExpanded] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchBhojRequests();
      if (result.status === 1) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = (id) => {
    setBhojToCancel(id);
    setShowDeleteModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      const response = await cancelBhojRequest(bhojToCancel);
      if (response.status === 1) {
        toast.success("Request cancelled successfully!");
        loadData();
      } else {
        toast.error(response.message || "Failed to cancel request.");
      }
    } catch (error) {
      toast.error(error.message || "Error cancelling request. Please try again.");
      console.error("Error cancelling request:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleView = (row) => {
    setRowToView(row);
    setViewModalVisible(true);
    setMoreInfoExpanded(true);
  };

  const handleRequestPandit = (row) => {
    setRowToView(row);
    setShowPanditModal(true);
  };

  const handleConfirmPanditRequest = async () => {
    try {
      const response = await requestPandit(rowToView._id);
      if (response.status === 1) {
        toast.success("Pandit request sent successfully!");
        loadData();
      } else {
        toast.error(response.message || "Failed to send pandit request.");
      }
    } catch (error) {
      toast.error(error.message || "Error sending pandit request. Please try again.");
      console.error("Error sending pandit request:", error);
    } finally {
      setShowPanditModal(false);
    }
  };

  const formatLocation = (location) => {
    if (!location) return 'N/A';
    return `Lat: ${location.latitude}, Long: ${location.longitude}`;
  };

  const getStatusBadge = (bookingStatus) => {
    switch (bookingStatus) {
      case '0':
        return <span className="badge bg-warning">Pending</span>;
      case '1':
        return <span className="badge bg-success">Pending</span>;
      case '2':
        return <span className="badge bg-danger">Cancelled</span>;
      case '3':
        return <span className="badge bg-info">Assign Pending</span>;
      case '4':
        return <span className="badge bg-primary">Completed</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Booking ID',
      selector: (row) => row.bhojId,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Name',
      selector: (row) => row.user_name,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Mobile',
      selector: (row) => row.phone,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Location',
      cell: (row) => formatLocation(row.location),
      width: '200px',
    },
    {
      name: 'Date',
      selector: (row) => new Date(row.date).toLocaleDateString(),
      sortable: true,
      width: '150px',
    },
    {
      name: 'Status',
      cell: (row) => getStatusBadge(row.status),
      sortable: true,
      width: '150px',
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
            onClick={() => handleRequestPandit(row)}
            className="p-2 text-green-600 hover:text-green-900 rounded hover:bg-green-100"
            data-tooltip-id="tooltip"
            data-tooltip-content="Request Pandit"
          >
            <FaUserPlus />
          </button>
          <button
            onClick={() => handleCancel(row._id)}
            className={`p-2 text-red-600 hover:text-red-900 rounded hover:bg-red-100 ${row.bookingStatus === '2' || row.bookingStatus === '4' ? 'opacity-50 cursor-not-allowed' : ''}`}
            data-tooltip-id="tooltip"
            data-tooltip-content="Cancel"
            disabled={row.bookingStatus === '2' || row.bookingStatus === '4'}
          >
            <FaTimes />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '180px',
    }
  ];

  return (
    <>
      <div className="card">
        <div className="card-header pb-2 pt-4 card-border">
          <div className='common-flex justify-between item-center'>
            <h5 className="mb-3">Brahman Bhoj Requests</h5>
          </div>
        </div>
        <div className="card-body pt-5 pl-0 pr-0 pt-5">
          <GetTable
            columns={columns}
            data={orders}
            loading={loading}
            title="Brahman Bhoj Requests"
            noDataMessage={loading ? "Loading..." : "No requests found"}
          />
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Cancellation</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to cancel this request? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-danger text-white" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-success text-white" 
                  onClick={handleConfirmCancel}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pandit Request Confirmation Modal */}
      {showPanditModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Pandit</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPanditModal(false)}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to request a pandit for this booking?</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-danger text-white" 
                  onClick={() => setShowPanditModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-success text-white" 
                  onClick={handleConfirmPanditRequest}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal - Updated Design */}
      {viewModalVisible && rowToView && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#6c63ff' }}>
                <h5 className="modal-title text-white">Brahman Bhoj Booking Details</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  style={{ filter: 'invert(1)' }}
                  onClick={() => setViewModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body p-0">
                {/* Main Info Card */}
                <div className="p-4 border-bottom">
                  <div className="row common-flex justify-content-between align-items-center flex-wrap">
                    <div className='col-8'>
                        <div className="d-flex align-items-center mb-2 me-3">
                        <FaIdCard className="text-primary me-2" />
                        <strong>ID:</strong> 
                        <span className="ms-2">{rowToView.bhojId}</span>
                        </div>
                        <div className="d-flex align-items-center mb-2 me-3">
                        <FaUser className="text-success me-2" />
                        <strong>Name:</strong> 
                        <span className="ms-2">{rowToView.user_name || 'N/A'}</span>
                        </div>
                        <div className="d-flex align-items-center mb-2 me-3">
                        <FaPhone className="text-warning me-2" />
                        <strong>Phone:</strong> 
                        <span className="ms-2">{rowToView.phone || 'N/A'}</span>
                        </div>
                        <div className="d-flex align-items-center mb-2 me-3">
                        <FaEnvelope className="text-danger me-2" />
                        <strong>Email:</strong> 
                        <span className="ms-2">{rowToView.email || 'N/A'}</span>
                        </div>
                    </div>
                    <div className='col-4'>
                        <button 
                        className="btn btn-success text-white ms-auto"
                        onClick={() => handleRequestPandit(rowToView)}
                        >
                        Request Pandit
                        </button>
                    </div>
                  </div>
                </div>

                {/* More Information Section */}
                <div className="p-4" style={{ backgroundColor: '#f8f6ff' }}>
                  <div 
                    className="common-flex align-items-center cursor-pointer mb-3" 
                    onClick={() => setMoreInfoExpanded(!moreInfoExpanded)}
                    style={{ cursor: 'pointer' }}
                  >
                    <FaUser className="text-primary me-2" />
                    <h6 className="mb-0">More Information</h6>
                    {moreInfoExpanded ? 
                      <FaChevronUp className="ms-2" /> : 
                      <FaChevronDown className="ms-2" />
                    }
                  </div>
                  
                  {moreInfoExpanded && (
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="common-flex align-items-center mb-2">
                          <FaMapMarkerAlt className="text-danger me-2" />
                          <strong>Address:</strong>
                          <span className="ms-2">{rowToView.address || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaClock className="text-secondary me-2" />
                          <strong>Created At:</strong>
                          <span className="ms-2">{new Date(rowToView.created_at).toLocaleString()}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaCalendarAlt className="text-primary me-2" />
                          <strong>Event Date:</strong>
                          <span className="ms-2">{rowToView.date ? new Date(rowToView.date).toDateString() : 'N/A'}</span>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="common-flex align-items-center mb-2">
                          <FaGlobe className="text-info me-2" />
                          <strong>Latitude:</strong>
                          <span className="ms-2">{rowToView.location?.latitude || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaGlobe className="text-info me-2" />
                          <strong>Longitude:</strong>
                          <span className="ms-2">{rowToView.location?.longitude || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaUsers className="text-success me-2" />
                          <strong>Attendees:</strong>
                          <span className="ms-2">{rowToView.attendees || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaClipboardCheck className="text-warning me-2" />
                          <strong>Status:</strong>
                          <span className="ms-2">{getStatusBadge(rowToView.status)}</span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="common-flex align-items-start mb-2">
                          <FaStickyNote className="text-secondary me-2 mt-1" />
                            <strong>Notes:</strong>
                            <span className="ms-2">{rowToView.notes || 'No special notes provided'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-danger text-white" 
                  onClick={() => setViewModalVisible(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer position="top-right" autoClose={3000} />
      <ReactTooltip id="tooltip" effect="solid" />
    </>
  );
};

export default BrahmanBhoj;