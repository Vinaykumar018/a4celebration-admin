import React, { useState, useEffect } from "react";
import {
  fetchStoryCategories,
  deleteStoryCategory,
  updateStoryCategory,
  createStoryCategory
} from "../../Services/storyApiService";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaEye, FaTrash, FaPlus } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import GetTable from "../../Component/GetTable";
import Loader from "../../Component/Loader";
import AddEditCategoryModal from "./AddEditCategoryModal";
import ViewCategoryModal from "./ViewCategoryModal";

const StoryCategory = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [rowToView, setRowToView] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const result = await fetchStoryCategories();
      if (result.status === 1) {
        setCategoryData(result.data);
      } else {
        toast.error(result.message || "Failed to load categories");
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error(error.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

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
            src={`https://a4celebration.com/api${row.image}`}
            alt={row.title}
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
      name: 'Title',
      selector: row => row.title,
      sortable: true,
    },
    {
      name: 'Language',
      selector: row => {
        switch (row.language) {
          case 'english': return 'English';
          case 'hindi': return 'Hindi';
          case 'sanskrit': return 'Sanskrit';
          default: return row.language;
        }
      },
      sortable: true,
    },
    {
      name: 'Meta Title',
      selector: row => row.metaTitle,
      wrap: true,
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

  const handleView = (row) => {
    setRowToView(row);
    setViewModalVisible(true);
  };

  const handleEdit = (row) => {
    setCategoryToEdit({
      _id: row._id,
      title: row.title,
      metaTitle: row.metaTitle,
      metaKeywords: row.metaKeywords,
      metaDescription: row.metaDescription,
      image: row.image,
      language: row.language || 'english'
    });
    setShowFormModal(true);
  };

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteStoryCategory(categoryToDelete);
      if (response.status === 1) {
        toast.success("Category deleted successfully!");
        setCategoryData(categoryData.filter((item) => item._id !== categoryToDelete));
      } else {
        toast.error(response.message || "Failed to delete category.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting category. Please try again.");
      console.error("Error deleting category:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const navigateToAddCategory = () => {
    setCategoryToEdit(null);
    setShowFormModal(true);
  };

  return (
    <>
      <div className="card">
        <div className="card-header pb-2 pt-4 card-border">
          <div className='common-flex justify-between item-center'>
            <h5 className="mb-3">All Story Categories</h5>
            <button className='btn btn-info' onClick={navigateToAddCategory}>
              <FaPlus className="me-2" />
              Add Category
            </button>
          </div>
        </div>
        <div className="card-body pt-5 pl-0 pr-0 pt-5">
          <GetTable
            columns={columns}
            data={categoryData}
            loading={loading}
            title="Story Categories"
          />
        </div>
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
                <p>Are you sure you want to delete this category? This action cannot be undone.</p>
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
      <AddEditCategoryModal
        show={showFormModal}
        onClose={() => setShowFormModal(false)}
        categoryToEdit={categoryToEdit}
        onSuccess={loadCategories}
      />

      {/* View Modal */}
      <ViewCategoryModal
        show={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
        category={rowToView}
      />

      <ToastContainer position="top-right" autoClose={3000} />
      <ReactTooltip id="tooltip" effect="solid" />
    </>
  );
};

export default StoryCategory;