import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GetTable from "../../Component/GetTable";
import MainSliderForm from "./MainSliderForm";
import { 
  getAllSliders, 
  createSlider, 
  updateSlider, 
  deleteSlider,
  updateSliderStatus 
} from "../../Services/sliderApiService";
import ViewSliderModal from "./ViewSliderModal";

const Slider = () => {
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sliderToEdit, setSliderToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [rowToView, setRowToView] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const fetchSliderData = async () => {
    setLoading(true);
    try {
      const result = await getAllSliders();
      if (result.status === 1) {
        setSliderData(result.data);
      } else {
        toast.error(result.message || "Failed to load sliders");
      }
    } catch (error) {
      console.error("Error loading sliders:", error);
      toast.error(error.response?.data?.message || "Failed to load sliders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliderData();
  }, []);

  const handleToggleStatus = (row) => {
    setStatusToUpdate({
      id: row._id,
      currentStatus: row.status,
      newStatus: !row.status
    });
    setShowStatusModal(true);
  };

  const handleConfirmStatusChange = async () => {
    try {
      const response = await updateSliderStatus(
        statusToUpdate.id, 
        statusToUpdate.newStatus ? 'active' : 'inactive'
      );
      
      if (response.status === 1) {
        toast.success("Status updated successfully!");
        setSliderData(sliderData.map(item => 
          item._id === statusToUpdate.id 
            ? { ...item, status: statusToUpdate.newStatus } 
            : item
        ));
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating status");
      console.error("Error updating status:", error);
    } finally {
      setShowStatusModal(false);
      setStatusToUpdate(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (sliderToEdit) {
        const result = await updateSlider(sliderToEdit._id, formData);
        if (result.status === 1) {
          toast.success("Slider updated successfully!");
          fetchSliderData();
          return true;
        }
      } else {
        const result = await createSlider(formData);
        if (result.status === 1) {
          toast.success("Slider created successfully!");
          fetchSliderData();
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
    setSliderToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteSlider(sliderToDelete);
      if (response.status === 1) {
        toast.success("Slider deleted successfully!");
        setSliderData(sliderData.filter((item) => item._id !== sliderToDelete));
      } else {
        toast.error(response.message || "Failed to delete slider.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting slider. Please try again.");
      console.error("Error deleting slider:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleView = (row) => {
    setRowToView(row);
    setViewModalVisible(true);
  };

  const handleEdit = (row) => {
    setSliderToEdit(row);
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
      name: 'Image',
      cell: (row) => (
        row.image ? (
          <img 
            src={row.image} 
            alt={row.name} 
            width="50" 
            height="50"
            style={{ borderRadius: '5px' }}
          />
        ) : (
          "N/A"
        )
      ),
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Category',
      selector: row => row.category,
      sortable: true,
    },
    {
      name: 'Status',
      cell: row => (
        <span
          onClick={() => handleToggleStatus(row)}
          className={`badge rounded-pill px-3 py-1 cursor-pointer ${
            row.status ? 'bg-success text-white' : 'bg-danger text-white'
          }`}
          style={{ cursor: 'pointer' }}
        >
          {row.status ? 'Active' : 'Inactive'}
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
          <h5 className="mb-3">All Sliders</h5>
          <button
            className="btn btn-info text-white"
            onClick={() => {
              setSliderToEdit(null);
              setShowFormModal(true);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Add Slider"
          >
            <FaPlus className="me-1" />
            Add Slider
          </button>
        </div>
      </div>
      <div className="card-body pt-5 pl-0 pr-0 pt-5">
        <GetTable
          columns={columns}
          data={sliderData}
          loading={loading}
          title="Sliders"
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
                <p>Are you sure you want to delete this slider? This action cannot be undone.</p>
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

      {/* Status Change Modal */}
      {showStatusModal && statusToUpdate && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Status Change</h5>
                <button type="button" className="btn-close" onClick={() => setShowStatusModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to change the status to{' '}
                  <strong>{statusToUpdate.newStatus ? 'Active' : 'Inactive'}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-danger text-white" 
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-success text-white" 
                  onClick={handleConfirmStatusChange}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      <MainSliderForm 
        show={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSliderToEdit(null);
        }}
        onSubmit={handleFormSubmit}
        sliderToEdit={sliderToEdit}
        onSuccess={fetchSliderData}
      />

      {/* View Modal */}
      <ViewSliderModal
        show={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
        slider={rowToView}
      />

      <ToastContainer position="top-right" autoClose={3000} />
      <ReactTooltip id="tooltip" effect="solid" />
    </div>
  );
};

export default Slider;