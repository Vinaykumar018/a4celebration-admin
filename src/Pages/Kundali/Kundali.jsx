import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GetTable from "../../Component/GetTable";
import KundaliForm from "./KundaliForm";
import ViewKundaliModal from "./ViewKundaliModal";
import { 
  getAllKundalis, 
  getKundaliById,
  createKundali, 
  updateKundali, 
  deleteKundali,
  cancelKundaliRequest,
  updateKundaliTransaction
} from "../../Services/kundaliApiService";

const Kundali = () => {
  const [kundaliData, setKundaliData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kundaliToEdit, setKundaliToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [kundaliToDelete, setKundaliToDelete] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [rowToView, setRowToView] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionData, setTransactionData] = useState({
    transactionStatus: '',
    transactionId: '',
    transactionAmount: '',
    transactionDate: ''
  });

  const fetchKundaliData = async () => {
    setLoading(true);
    try {
      const result = await getAllKundalis();
      if (result.success === true) {
        setKundaliData(result.data);
      } else {
        toast.error(result.message || "Failed to load kundalis");
      }
    } catch (error) {
      console.error("Error loading kundalis:", error);
      toast.error(error.response?.data?.message || "Failed to load kundalis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKundaliData();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      if (kundaliToEdit) {
        const result = await updateKundali(kundaliToEdit._id, formData);
        if (result.success === true) {
          toast.success("Kundali updated successfully!");
          fetchKundaliData();
          return true;
        }
      } else {
        const result = await createKundali(formData);
        if (result.success === true) {
          toast.success("Kundali created successfully!");
          fetchKundaliData();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
      return false;
    }
  };

  const handleDelete = (id) => {
    setKundaliToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteKundali(kundaliToDelete);
      if (response.success === true) {
        toast.success("Kundali deleted successfully!");
        setKundaliData(kundaliData.filter((item) => item._id !== kundaliToDelete));
      } else {
        toast.error(response.message || "Failed to delete kundali.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting kundali. Please try again.");
      console.error("Error deleting kundali:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleView = (row) => {
    setRowToView(row);
    setViewModalVisible(true);
  };

  const handleEdit = (row) => {
    setKundaliToEdit(row);
    setShowFormModal(true);
  };

  const handleCancelRequest = (id) => {
    setKundaliToDelete(id);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      const response = await cancelKundaliRequest(kundaliToDelete);
      if (response.success === true) {
        toast.success("Kundali request cancelled successfully!");
        fetchKundaliData();
      } else {
        toast.error(response.message || "Failed to cancel kundali request.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error cancelling kundali request.");
      console.error("Error cancelling kundali request:", error);
    } finally {
      setShowCancelModal(false);
    }
  };

  const handleUpdateTransaction = (row) => {
    setKundaliToEdit(row);
    setTransactionData({
      transactionStatus: row.transactionStatus || '',
      transactionId: row.transactionId || '',
      transactionAmount: row.transactionAmount || '',
      transactionDate: row.transactionDate || ''
    });
    setShowTransactionModal(true);
  };

  const handleTransactionSubmit = async () => {
    try {
      const response = await updateKundaliTransaction(kundaliToEdit._id, transactionData);
      if (response.success === true) {
        toast.success("Transaction updated successfully!");
        fetchKundaliData();
        setShowTransactionModal(false);
      } else {
        toast.error(response.message || "Failed to update transaction.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating transaction.");
      console.error("Error updating transaction:", error);
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
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Gender',
      selector: row => row.gender,
      sortable: true,
    },
    {
      name: 'DOB',
      selector: row => row.dateOfBirth,
      sortable: true,
    },
    {
      name: 'Time',
      selector: row => row.timeOfBirth,
      sortable: true,
    },
    {
      name: 'Place',
      selector: row => row.placeOfBirth,
      sortable: true,
    },
    {
      name: 'Status',
      cell: row => (
        <span className={`badge rounded-pill px-3 py-1 ${
          row.status === true ? 'bg-success' : row.status === 0 ? 'bg-danger' : 'bg-warning'
        } text-white`}>
          {row.status === true ? 'Active' : row.status === 0 ? 'Cancelled' : 'Pending'}
        </span>
      ),
      sortable: true,
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
            onClick={() => handleEdit(row)}
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
          {row.status !== 0 && (
            <button
              onClick={() => handleCancelRequest(row._id)}
              className="p-2 text-orange-600 hover:text-orange-900 rounded hover:bg-orange-100"
              data-tooltip-id="tooltip"
              data-tooltip-content="Cancel Request"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => handleUpdateTransaction(row)}
            className="p-2 text-purple-600 hover:text-purple-900 rounded hover:bg-purple-100"
            data-tooltip-id="tooltip"
            data-tooltip-content="Update Transaction"
          >
            Transaction
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '250px',
    },
  ];

  return (
    <div className="card">
      <div className="card-header pb-2 pt-4 card-border">
        <div className='common-flex justify-between item-center'>
          <h5 className="mb-3">All Kundali Requests</h5>
          <button
            className="btn btn-info text-white"
            onClick={() => {
              setKundaliToEdit(null);
              setShowFormModal(true);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Add Kundali"
          >
            <FaPlus className="me-1" />
            Add Kundali
          </button>
        </div>
      </div>
      <div className="card-body pt-5 pl-0 pr-0 pt-5">
        <GetTable
          columns={columns}
          data={kundaliData}
          loading={loading}
          title="Kundali Requests"
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this kundali? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-info text-white" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger text-white" onClick={handleConfirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Request Modal */}
      {showCancelModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Cancellation</h5>
                <button type="button" className="btn-close" onClick={() => setShowCancelModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to cancel this kundali request?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-info text-white" onClick={() => setShowCancelModal(false)}>
                  No
                </button>
                <button type="button" className="btn btn-danger text-white" onClick={handleConfirmCancel}>
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Transaction Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowTransactionModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Transaction Status</label>
                  <select
                    className="form-control"
                    value={transactionData.transactionStatus}
                    onChange={(e) => setTransactionData({...transactionData, transactionStatus: e.target.value})}
                  >
                    <option value="">Select Status</option>
                    <option value="Success">Success</option>
                    <option value="Failed">Failed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Transaction ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={transactionData.transactionId}
                    onChange={(e) => setTransactionData({...transactionData, transactionId: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    value={transactionData.transactionAmount}
                    onChange={(e) => setTransactionData({...transactionData, transactionAmount: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={transactionData.transactionDate}
                    onChange={(e) => setTransactionData({...transactionData, transactionDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger text-white" onClick={() => setShowTransactionModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success text-white" onClick={handleTransactionSubmit}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      <KundaliForm 
        show={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setKundaliToEdit(null);
        }}
        onSubmit={handleFormSubmit}
        kundaliToEdit={kundaliToEdit}
      />

      {/* View Modal */}
      <ViewKundaliModal
        show={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
        kundali={rowToView}
      />

      <ToastContainer position="top-right" autoClose={3000} />
      <ReactTooltip id="tooltip" effect="solid" />
    </div>
  );
};

export default Kundali;