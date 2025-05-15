import React, { useState, useEffect } from 'react';
import { fetchPandits, fetchPoojas } from '../../Services/panditApiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaCalendarAlt, FaEye, FaTrash, FaTasks } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import GetTable from '../../Component/GetTable';

function Pandit() {
  const navigate = useNavigate();
  const [panditData, setPanditData] = useState([]);
  const [poojaData, setPoojaData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [panditToDelete, setPanditToDelete] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedPandit, setSelectedPandit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoryMap, setCategoryMap] = useState({});

  const IMGURL = 'http://localhost:3000/uploads/panditImages/';

  useEffect(() => {
    loadPandits();
    loadPoojas();
  }, []);

  const loadPandits = async () => {
    try {
      setLoading(true);
      const response = await fetchPandits.getAll();
      setPanditData(response.data);

      // Load categories for each pandit
      const categories = {};
      for (const pandit of response.data) {
        const categoryResponse = await fetchPandits.getCategories(pandit._id);
        categories[pandit._id] = categoryResponse.data || [];
      }
      setCategoryMap(categories);
      setLoading(false);
      toast.success('Pandits loaded successfully');
    } catch (error) {
      setLoading(false);
      console.error('Error loading pandits:', error);
      toast.error(error.message || 'Failed to fetch pandits. Please try again.');
    }
  };

  const loadPoojas = async () => {
    try {
      const response = await fetchPoojas.getAll();
      setPoojaData(response.data);
    } catch (error) {
      console.error('Error loading poojas:', error);
      toast.error(error.message || 'Failed to fetch poojas');
    }
  };

  const handleDelete = (id) => {
    setPanditToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetchPandits.delete(panditToDelete);
      setPanditData(panditData.filter((pandit) => pandit._id !== panditToDelete));
      setShowModal(false);
      toast.success('Pandit deleted successfully');
    } catch (error) {
      console.error('Error deleting pandit:', error);
      toast.error(error.message || 'Failed to delete pandit');
    }
  };

  const handleAssignCategory = async (panditId, poojaIds) => {
    try {
      setLoading(true);
      const pandit = panditData.find((p) => p._id === panditId);

      // Map over all poojas to send checked as `1` and unchecked as `0`
      const allPoojas = poojaData.map((pooja) => ({
        pandit_id: panditId,
        name: pandit.username,
        pooja_id: pooja._id,
        pooja_name: pooja.pooja_name,
        category_status: poojaIds.includes(pooja._id) ? 1 : 0,
      }));

      // Call API for each pooja with its status
      await Promise.all(
        allPoojas.map((pooja) => fetchPandits.updateCategory(pooja))
      );

      // Refresh data
      await loadPandits();
      setShowCategoryModal(false);
      toast.success('Pooja categories updated successfully');
    } catch (error) {
      console.error('Error assigning categories:', error);
      toast.error(error.message || 'Failed to update categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/pandit/update-pandit/${id}`);
  };

  const navigateToAddPandit = () => {
    navigate('/pandit/add-pandit');
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
        <img
          src={IMGURL + row.image}
          alt={row.username}
          width="70"
          height="70"
          style={{ height: '70px', width: '70px', borderRadius: '50% !important' }}
          className="rounded-50"
        />
      ),
      width: '100px',
    },
    {
      name: 'Name',
      selector: row => row.username,
      sortable: true,
      cell: (row) => <Link to={`/pandit/${row._id}`} className="text-blue-600 hover:text-blue-800">{row.username}</Link>,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Mobile',
      selector: row => row.mobile,
      sortable: true,
    },
    {
      name: 'City',
      selector: row => row.city,
      sortable: true,
    },
    {
      name: 'Experience',
      selector: row => `${row.experience} years`,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Category',
      selector: (row) => {
        const categoryList = categoryMap[row._id] || [];
        return categoryList.length > 0 ? (
          <div className="common-flex flex-wrap">
            {categoryList.map((item) => (
              <span key={item.pooja_id} className="badge bg-success m-0">
                {item.pooja_name}
              </span>
            ))}
          </div>
        ) : (
          <span>No Categories</span>
        );
      },
      width: '260px',
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Link
            to={`/pandit/${row._id}`}
            className="p-2 text-indigo-600 hover:text-indigo-900 rounded hover:bg-indigo-100"
            data-tooltip-id="tooltip"
            data-tooltip-content="View"
          >
            <FaEye />
          </Link>
          <Link
            to={`/pandit/bookings/${row._id}`}
            className="p-2 text-green-600 hover:text-green-900 rounded hover:bg-green-100"
            data-tooltip-id="tooltip"
            data-tooltip-content="Bookings"
          >
            <FaCalendarAlt />
          </Link>
          <button
            onClick={() => {
              setSelectedPandit(row._id);
              setShowCategoryModal(true);
            }}
            className="p-2 text-purple-600 hover:text-purple-900 rounded hover:bg-purple-100"
            data-tooltip-id="tooltip"
            data-tooltip-content="Manage Poojas"
          >
            <FaTasks />
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
            <h5 className="mb-3">All Pandits</h5>
            <button className='btn btn-info' onClick={navigateToAddPandit}>
              Add Pandit
            </button>
          </div>
        </div>
        <div className="card-body pt-5 pl-0 pr-0 pt-5">
          <GetTable
            columns={columns}
            data={panditData}
            loading={loading}
            title="Pandits List"
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this Pandit?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Category Modal */}
      {showCategoryModal && (
        <AssignCategoryModal
          show={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          panditId={selectedPandit}
          poojaData={poojaData}
          currentPoojas={
            categoryMap[selectedPandit]?.filter(cat => cat.status === '1').map(cat => cat.pooja_id) || []
          }
          onAssign={handleAssignCategory}
          loading={loading}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
      <ReactTooltip id="tooltip" effect="solid" />
    </>
  );
}

const AssignCategoryModal = ({
  show,
  onClose,
  panditId,
  poojaData,
  onAssign,
  currentPoojas = [],
  loading,
}) => {
  const [selectedPoojas, setSelectedPoojas] = useState([]);

  useEffect(() => {
    if (show) {
      setSelectedPoojas(currentPoojas);
    }
  }, [show, currentPoojas]);

  const handleCheckboxChange = (poojaId) => {
    setSelectedPoojas((prev) =>
      prev.includes(poojaId)
        ? prev.filter((id) => id !== poojaId)
        : [...prev, poojaId]
    );
  };

  const handleAssign = async () => {
    if (selectedPoojas.length === 0) return;
    await onAssign(panditId, selectedPoojas);
  };

  if (!show) return null;

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Assign Pooja Categories</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Select Poojas</label>
              <div className="pooja-checkboxes" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {poojaData.map((pooja) => (
                  <div key={pooja._id} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`pooja-${pooja._id}`}
                      checked={selectedPoojas.includes(pooja._id)}
                      onChange={() => handleCheckboxChange(pooja._id)}
                    />
                    <label className="form-check-label" htmlFor={`pooja-${pooja._id}`}>
                      {pooja.pooja_name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger text-white" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success text-white"
              onClick={handleAssign}
              disabled={selectedPoojas.length === 0 || loading}
            >
              {loading ? 'Assigning...' : `Assign (${selectedPoojas.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pandit;