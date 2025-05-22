import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaTimes, FaChevronDown, FaChevronUp, FaIdCard, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaRupeeSign, FaInfoCircle } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import GetTable from '../../Component/GetTable';

const BookingListBhajanMandal = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [rowToView, setRowToView] = useState(null);
  const [moreInfoExpanded, setMoreInfoExpanded] = useState(true);

  const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';
  const BASE_URL = `https://a4celebration.com/api/api/`;

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://a4celebration.com/api/api/order/bhajan-mandali`, {
        headers: { Authorization: token },
      });

      if (response.data && Array.isArray(response.data)) {
        const ordersWithAddresses = await fetchAddresses(response.data);
        setOrders(ordersWithAddresses);
      } else {
        toast.error("Invalid data format received from server");
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error("Failed to load data");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const fetchAddresses = async (ordersData) => {
    if (!Array.isArray(ordersData)) {
      console.error('ordersData is not an array:', ordersData);
      return [];
    }

    try {
      const updatedOrders = await Promise.all(
        ordersData.map(async (order) => {
          try {
            const addressResponse = await axios.get(`${BASE_URL}/order/delivery-address/${order.bookingId}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: token
              },
            });

            const deliveryAddress = addressResponse.data?.DeliveryAddress || {};
            return {
              ...order,
              address: deliveryAddress,
              formattedAddress: formatAddress(deliveryAddress) || "N/A"
            };
          } catch (error) {
            console.error(`Error fetching address for Booking ID: ${order.bookingId}`, error);
            return { ...order, address: {}, formattedAddress: "N/A" };
          }
        })
      );
      return updatedOrders;
    } catch (error) {
      console.error('Error in fetchAddresses:', error);
      return ordersData.map(order => ({ ...order, address: {}, formattedAddress: "N/A" }));
    }
  };

  const formatAddress = (address) => {
    if (!address || typeof address !== 'object') return "N/A";
    return `${address.AddressLine1 || ''}, ${address.AddressLine2 || ''}, ${address.Location || ''}, ${address.Landmark ? address.Landmark + ', ' : ''}${address.City || ''}, ${address.State || ''}, ${address.Country || ''} - ${address.PostalCode || ''}`;
  };

  const handleCancel = (bookingId) => {
    setBookingToCancel(bookingId);
    setShowDeleteModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      // Replace with your actual cancel API call
      toast.success("Booking cancelled successfully!");
      loadData();
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
      case 3:
        return <span className="badge bg-info">Completed</span>;
      case 4:
        return <span className="badge bg-primary">Scheduled</span>;
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
      sortable: true,
      width: '150px',
    },
    {
      name: 'Mandali Name',
      selector: (row) => row.bookingDetails?.mandaliName || 'N/A',
      sortable: true,
      width: '180px',
    },
    {
      name: 'User Details',
      cell: (row) => (
        <div>
          <div className="d-flex align-items-center mb-1">
            <FaUser className="text-primary me-2" size={12} />
            <span>{row.userDetails?.username || 'N/A'}</span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <FaEnvelope className="text-danger me-2" size={12} />
            <span>{row.userDetails?.email || 'N/A'}</span>
          </div>
          <div className="d-flex align-items-center">
            <FaPhone className="text-success me-2" size={12} />
            <span>{row.userDetails?.contactNumber || 'N/A'}</span>
          </div>
        </div>
      ),
      sortable: true,
      width: '250px',
    },
    {
      name: 'Address',
      selector: (row) => row.formattedAddress,
      sortable: true,
      width: '250px',
      wrap: true,
    },
    {
      name: 'Schedule',
      cell: (row) => (
        <div>
          <div className="d-flex align-items-center mb-1">
            <FaCalendarAlt className="text-primary me-2" size={12} />
            <span>{row.schedule?.date || 'N/A'}</span>
          </div>
          <div className="d-flex align-items-center">
            <FaClock className="text-info me-2" size={12} />
            <span>{row.schedule?.time || 'N/A'}</span>
          </div>
        </div>
      ),
      sortable: true,
      width: '150px',
    },
    {
      name: 'Amount',
      cell: (row) => (
        <div className="d-flex align-items-center">
          <FaRupeeSign className="text-success me-2" size={12} />
          <span>{row.paymentDetails?.amount || 'N/A'}</span>
        </div>
      ),
      sortable: true,
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
            className={`p-2 text-red-600 hover:text-red-900 rounded hover:bg-red-100 ${[2, 3].includes(row.bookingStatus) ? 'opacity-50 cursor-not-allowed' : ''}`}
            data-tooltip-id="tooltip"
            data-tooltip-content="Cancel"
            disabled={[2, 3].includes(row.bookingStatus)}
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
            <h5 className="mb-3">Bhajan Mandal Booking List</h5>
          </div>
        </div>
        <div className="card-body pt-5 pl-0 pr-0 pt-5">
          <GetTable
            columns={columns}
            data={orders}
            loading={loading}
            title="Bhajan Mandal Bookings"
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
                <h5 className="modal-title text-white">Bhajan Mandal Booking Details</h5>
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
                        <strong>Mandali Name:</strong>
                        <span className="ms-2">{rowToView.bookingDetails?.mandaliName || 'N/A'}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2 me-3">
                        <FaUser className="text-info me-2" />
                        <strong>User Name:</strong>
                        <span className="ms-2">{rowToView.userDetails?.username || 'N/A'}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2 me-3">
                        <FaPhone className="text-warning me-2" />
                        <strong>Contact:</strong>
                        <span className="ms-2">{rowToView.userDetails?.contactNumber || 'N/A'}</span>
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
                          <span className="ms-2">{rowToView.userDetails?.email || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaMapMarkerAlt className="text-secondary me-2" />
                          <strong>Address:</strong>
                          <span className="ms-2">{rowToView.formattedAddress || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaInfoCircle className="text-primary me-2" />
                          <strong>Mandali Type:</strong>
                          <span className="ms-2">{rowToView.bookingDetails?.Type || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaRupeeSign className="text-success me-2" />
                          <strong>Quantity:</strong>
                          <span className="ms-2">{rowToView.paymentDetails?.quantity || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="common-flex align-items-center mb-2">
                          <FaCalendarAlt className="text-info me-2" />
                          <strong>Date:</strong>
                          <span className="ms-2">{rowToView.schedule?.date || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaClock className="text-info me-2" />
                          <strong>Time:</strong>
                          <span className="ms-2">{rowToView.schedule?.time || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <FaRupeeSign className="text-success me-2" />
                          <strong>Amount:</strong>
                          <span className="ms-2">{rowToView.paymentDetails?.amount || 'N/A'}</span>
                        </div>
                        <div className="common-flex align-items-center mb-2">
                          <span className="me-2"><strong>Status:</strong></span>
                          {getStatusBadge(rowToView.bookingStatus)}
                        </div>
                        {rowToView.schedule?.bhajanStartTime && (
                          <div className="common-flex align-items-center mb-2">
                            <FaClock className="text-primary me-2" />
                            <strong>Start Time:</strong>
                            <span className="ms-2">{rowToView.schedule.bhajanStartTime}</span>
                          </div>
                        )}
                        {rowToView.schedule?.bhajanEndTime && (
                          <div className="common-flex align-items-center mb-2">
                            <FaClock className="text-danger me-2" />
                            <strong>End Time:</strong>
                            <span className="ms-2">{rowToView.schedule.bhajanEndTime}</span>
                          </div>
                        )}
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

export default BookingListBhajanMandal;