import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom';
import GetTable from "../../Component/GetTable";
import { fetchAllStories, deleteStory } from "../../Services/storyApiService";
import { FaEdit, FaEye, FaTrash, FaPlus, FaList, FaSpinner } from 'react-icons/fa';

const Story = () => {
  const [storyData, setStoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const loadStories = async () => {
    setLoading(true);
    try {
      const result = await fetchAllStories();
      if (result.status === 1) {
        setStoryData(result.data);
      } else {
        toast.error(result.message || "Failed to fetch stories");
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast.error("An error occurred while fetching stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const truncateText = (text, length = 50) => {
    return text?.length > length ? `${text.substring(0, length)}...` : text || "N/A";
  };

  const getCategoryBadge = (category) => {
    if (!category) return (
      <span className="px-2 py-1 text-xs font-medium rounded bg-info text-light">
        Uncategorized
      </span>
    );
    
    const colors = {
      primary: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-cyan-100 text-cyan-800',
      dark: 'bg-gray-800 text-white'
    };
    
    const colorKeys = Object.keys(colors);
    const color = colorKeys[Math.abs(category.title?.length % colorKeys.length)] || 'primary';
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[color]}`}>
        {category.title}
      </span>
    );
  };

  const columns = [
    { 
      name: "#", 
      selector: (row, index) => index + 1,
      width: "80px",
      center: true
    },
    { 
        name: "Image", 
        selector: (row) => (
          row.image ? (
            <img
              className="w-20 h-12 border rounded object-cover"
              src={`http://localhost:3000${row.image}`}
              alt={row.title}
            />
          ) : (
            <div className="text-gray-500 text-sm">No Image</div>
          )
        ),
        width: "120px",
        wrap:"true",
        center: true
      },
    { 
      name: "Title", 
      selector: (row) => (
        <div className="font-semibold text-blue-600">
          {truncateText(row.title)}
        </div>
      ),
      sortable: true,
      grow: 2,
      wrap:"true"

    },
    { 
        name: "Category", 
        selector: (row) => getCategoryBadge(row.category),
        width: "150px"
      },
    { 
      name: "Description", 
      selector: (row) => (
        <div className="text-sm text-gray-500">
          {truncateText(row.description, 200)}
        </div>
      ),
      grow: 3,
    wrap:"true"
    },
   
    {
      name: "Actions",
      selector: (row) => (
        <div className="flex justify-end space-x-2">
          <button
            title="View Details"
            className="p-2 text-info hover:text-info hover:bg-info rounded"
            onClick={() => navigate(`/story/view/${row._id}`)}
          >
            <FaEye className="h-5 w-5" />
          </button>
          
          <button
            title="Sub Stories"
            className="p-2 text-green-500 hover:text-green-700 hover:bg-success rounded"
            onClick={() => navigate(`/story/sub-story/${row._id}`)}
          >
            <FaList className="h-5 w-5" />
          </button>
          
          <button
            title="Edit Story"
            className="p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded"
            onClick={() => navigate(`/story/edit/${row._id}`)}
          >
            <FaEdit className="h-5 w-5" />
          </button>
          
          <button
            title="Delete Story"
            className="p-2 text-red hover:text-red hover:bg-danger rounded disabled:opacity-50"
            disabled={deletingId === row._id}
            onClick={() => handleDelete(row._id)}
          >
            {deletingId === row._id ? (
              <FaSpinner className="animate-spin h-5 w-5 text-red" />
            ) : (
              <FaTrash className="h-5 w-5" />
            )}
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "220px"
    },
  ];

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    
    setDeletingId(id);
    try {
      const result = await deleteStory(id);
      if (result.status === 200) {
        toast.success("Story deleted successfully!");
        loadStories();
      } else {
        toast.error(result.message || "Failed to delete story");
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("An error occurred while deleting the story");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white card rounded-lg shadow-md overflow-hidden mb-6">
        <div className="card-header flex justify-between items-center bg-white border-b border-gray-200 px-6 py-4">
          <h5 className="text-xl font-semibold text-gray-800">Story Management</h5>
          <Link 
            to="/story/add-story" 
            className="inline-flex items-center px-3 py-2 bg-info text-white text-sm font-medium rounded-md hover:bg-info"
          >
            <FaPlus className="me-2" />
            Add Story
          </Link>
        </div>
        <div className="card-body p-6">
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          
          <GetTable 
            data={storyData} 
            columns={columns} 
            title=""
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 25, 50]}
            highlightOnHover
            responsive
            striped
            noDataComponent={
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No stories found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new story.</p>
                <div className="mt-6">
                  <Link 
                    to="/story/add-story" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    <FaPlus className="h-4 w-4 mr-1" />
                    Create Your First Story
                  </Link>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Story;