import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GetTable from "../../Component/GetTable";
import KundaliMatchingForm from "./KundaliMatchingForm";
import ViewKundaliMatchingModal from "./ViewKundaliMatchingModal";
import { 
  getAllKundaliMatchings,
  getKundaliMatchingById,
  createKundaliMatching,
  updateKundaliMatching,
  deleteKundaliMatching
} from "../../Services/kundaliMatchingApiService";

const KundaliMatching = () => {
  const [matchingData, setMatchingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchingToEdit, setMatchingToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [matchingToDelete, setMatchingToDelete] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [rowToView, setRowToView] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const fetchMatchingData = async () => {
    setLoading(true);
    try {
      const result = await getAllKundaliMatchings();
      if (result.success === true) {
        setMatchingData(result.data);
      } else {
        toast.error(result.message || "Failed to load kundali matchings");
      }
    } catch (error) {
      console.error("Error loading kundali matchings:", error);
      toast.error(error.response?.data?.message || "Failed to load kundali matchings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchingData();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      if (matchingToEdit) {
        const result = await updateKundaliMatching(matchingToEdit._id, formData);
        if (result.success === true) {
          toast.success("Kundali matching updated successfully!");
          fetchMatchingData();
          return true;
        }
      } else {
        const result = await createKundaliMatching(formData);
        if (result.success === true) {
          toast.success("Kundali matching created successfully!");
          fetchMatchingData();
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
    setMatchingToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteKundaliMatching(matchingToDelete);
      if (response.success === true) {
        toast.success("Kundali matching deleted successfully!");
        setMatchingData(matchingData.filter((item) => item._id !== matchingToDelete));
      } else {
        toast.error(response.message || "Failed to delete kundali matching.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting kundali matching. Please try again.");
      console.error("Error deleting kundali matching:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleView = (row) => {
    setRowToView(row);
    setViewModalVisible(true);
  };

  const handleEdit = (row) => {
    setMatchingToEdit(row);
    setShowFormModal(true);
  };

  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Groom Name',
      selector: row => row.matchingDetails?.groomName || 'N/A',
      sortable: true,
    },
    {
      name: 'Bride Name',
      selector: row => row.matchingDetails?.brideName || 'N/A',
      sortable: true,
    },
    {
      name: 'Contact',
      selector: row => row.contactNumber,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Status',
      cell: row => (
        <span className={`badge rounded-pill px-3 py-1 ${
          row.success === true ? 'bg-success' : 'bg-warning'
        } text-white`}>
          {row.success === true ? 'Completed' : 'Pending'}
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
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px',
    },
  ];

  return (
    <div className="card">
      <div className="card-header pb-2 pt-4 card-border">
        <div className='common-flex justify-between item-center'>
          <h5 className="mb-3">All Kundali Matchings</h5>
          <button
            className="btn btn-info text-white"
            onClick={() => {
              setMatchingToEdit(null);
              setShowFormModal(true);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Add Kundali Matching"
          >
            <FaPlus className="me-1" />
            Add Matching
          </button>
        </div>
      </div>
      <div className="card-body pt-5 pl-0 pr-0 pt-5">
        <GetTable
          columns={columns}
          data={matchingData}
          loading={loading}
          title="Kundali Matchings"
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
                <p>Are you sure you want to delete this kundali matching? This action cannot be undone.</p>
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

      {/* Add/Edit Form Modal */}
      <KundaliMatchingForm 
        show={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setMatchingToEdit(null);
        }}
        onSubmit={handleFormSubmit}
        matchingToEdit={matchingToEdit}
      />

      {/* View Modal */}
      <ViewKundaliMatchingModal
        show={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
        matching={rowToView}
      />

      <ToastContainer position="top-right" autoClose={3000} />
      <ReactTooltip id="tooltip" effect="solid" />
    </div>
  );
};

export default KundaliMatching;