import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GetTable from '../../Component/GetTable';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaTimes, FaChevronDown, FaChevronUp, FaIdCard, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaRupeeSign, FaInfoCircle } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const UserBookingList = () => {
  const { id } = useParams();
  const [userBookingList, setUserBookingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [rowToView, setRowToView] = useState(null);
  const [moreInfoExpanded, setMoreInfoExpanded] = useState(true);

  const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';
  const url = 'http://localhost:3000/api/user/get-booking-user';

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      setUserBookingList(response.data.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [id]);

  const handleCancel = (bookingId) => {
    setBookingToCancel(bookingId);
    setShowDeleteModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      // Replace with your actual cancel booking API call
      // const response = await cancelBooking(bookingToCancel);
      // if (response.status === 1) {
      //   toast.success("Booking cancelled successfully!");
      //   fetchBookings();
      // } else {
      //   toast.error(response.message || "Failed to cancel booking.");
      // }
      toast.success("Booking cancellation would be processed here");
      fetchBookings();
    } catch (error) {
      toast.error(error.message || "Error cancelling booking. Please try again.");
      console.error("Error cancelling booking:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleView = (row) => {
    setRowToView(row);
    setViewModalVisible(true);
    setMoreInfoExpanded(true);
  };

  const getStatusBadge = (bookingStatus) => {
    switch (bookingStatus) {
      case 0:
        return <span className="badge bg-warning">Pending</span>;
      case 1:
        return <span className="badge bg-success">Confirmed</span>;
      case 2:
        return <span className="badge bg-danger">Cancelled</span>;
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
      selector: (row) => row.bookingId,
      wrap: true,

    },
    {
      name: 'Pooja Name',
      selector: (row) => row.bookingDetails.poojaName,
      wrap: true,
    },
    {
      name: 'Pandit ID',
      selector: (row) => row.panditId || 'N/A',
      wrap: true,

    },
    {
      name: 'Schedule',
      cell: (row) => (
        <div>
          <div className="d-flex align-items-center mb-1">
            <FaCalendarAlt className="text-primary me-2" size={12} />
            <span>{row.schedule.date}</span>
          </div>
          <div className="d-flex align-items-center">
            <FaClock className="text-info me-2" size={12} />
            <span>{row.schedule.time}</span>
          </div>
        </div>
      ),
      width: '150px',
    },
    {
      name: 'Amount',
      cell: (row) => (
        <div className="d-flex align-items-center">
          <FaRupeeSign className="text-success me-2" size={12} />
          <span>{row.paymentDetails.amount}</span>
        </div>
      ),
      width: '120px',
    },
    {
      name: 'Status',
      cell: (row) => getStatusBadge(row.bookingStatus),
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
            onClick={() => handleCancel(row.bookingId)}
            className={`p-2 text-red-600 hover:text-red-900 rounded hover:bg-red-100 ${row.bookingStatus === 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
            data-tooltip-id="tooltip"
            data-tooltip-content="Cancel"
            disabled={row.bookingStatus === 2}
          >
            <FaTimes />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px',
    }
  ];

  return (
    <>
      <div className="card">
        <div className="card-header pb-2 pt-4 card-border">
          <div className='common-flex justify-between item-center'>
            <h5 className="mb-3">User Booking List</h5>
          </div>
        </div>
        <div className="card-body pt-5 pl-0 pr-0 pt-5">
          <GetTable
            columns={columns}
            data={userBookingList}
            loading={loading}
            title="User Bookings"
            noDataMessage={loading ? "Loading..." : "No bookings found"}
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
                <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
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

      {/* View Modal */}
      {viewModalVisible && rowToView && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#6c63ff' }}>
                <h5 className="modal-title text-white">Booking Details</h5>
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
                    <div className='col-12'>
                      <div className="d-flex align-items-center mb-2 me-3">
                        <FaIdCard className="text-primary me-2" />
                        <strong>Booking ID:</strong>
                        <span className="ms-2">{rowToView.bookingId}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2 me-3">
                        <FaInfoCircle className="text-success me-2" />
                        <strong>Pooja Name:</strong>
                        <span className="ms-2">{rowToView.bookingDetails.poojaName || 'N/A'}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2 me-3">
                        <FaUser className="text-info me-2" />
                        <strong>User Name:</strong>
                        <span className="ms-2">{rowToView.userDetails.username || 'N/A'}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2 me-3">
                        <FaPhone className="text-warning me-2" />
                        <strong>Contact:</strong>
                        <span className="ms-2">{rowToView.userDetails.contactNumber || 'N/A'}</span>
                      </div>
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
                    <FaInfoCircle className="text-primary me-2" />
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
                          <FaEnvelope className="text-danger me-2" />
                          <strong>Email:</strong>
                          <span className="ms-2">{rowToView.userDetails.email || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaUser className="text-primary me-2" />
                          <strong>Pandit ID:</strong>
                          <span className="ms-2">{rowToView.panditId || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaInfoCircle className="text-secondary me-2" />
                          <strong>Type:</strong>
                          <span className="ms-2">{rowToView.bookingDetails.Type || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaInfoCircle className="text-secondary me-2" />
                          <strong>Samagri Included:</strong>
                          <span className="ms-2">{rowToView.bookingDetails.isSamagriIncluded ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="common-flex align-items-center mb-2">
                          <FaCalendarAlt className="text-info me-2" />
                          <strong>Date:</strong>
                          <span className="ms-2">{rowToView.schedule.date || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaClock className="text-info me-2" />
                          <strong>Time:</strong>
                          <span className="ms-2">{rowToView.schedule.time || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaRupeeSign className="text-success me-2" />
                          <strong>Amount:</strong>
                          <span className="ms-2">{rowToView.paymentDetails.amount || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaInfoCircle className="text-success me-2" />
                          <strong>Quantity:</strong>
                          <span className="ms-2">{rowToView.paymentDetails.quantity || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <span className="me-2"><strong>Status:</strong></span>
                          {getStatusBadge(rowToView.bookingStatus)}
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

export default UserBookingList;