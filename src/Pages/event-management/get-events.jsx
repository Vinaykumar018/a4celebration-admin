import React, { useEffect, useState } from 'react';
import GetTable from '../../Component/GetTable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, removeEvent } from '../../redux/eventSlice';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const GetEvents = () => {

  console.log("hello")
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, loading, error } = useSelector((state) => state.events);
  console.log(events)

  // Fetch categories on component mount 
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleUpdate = (id) => {
    navigate(`/event/update-event-list/${id}`);
  };

  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const confirmDelete = (category) => {
    setProductToDelete(category);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(removeEvent(productToDelete._id)).unwrap();
      toast.success('Product deleted successfully!');
      dispatch(fetchEvents());
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setShowModal(false);
      setProductToDelete(null);
    }
  };



  const handleView = (id) => {
    navigate(`/view/view-event-list/${id}`);
  };



  const columns = [
    {
      name: 'Image',
      selector: row => row.featured_image,
      cell: row => (
        <img
          src={`https://a4celebration.com/api/${row.featured_image.replace(/\\/g, '/')}`}
          alt={row.name}
          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
        />
      ),
      width: '150px',
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Category',
      selector: row => row.category_name,
      sortable: true,
      wrap: true,
      width: '180px'
    },
    {
      name: 'City',
      selector: row => row.city,
      sortable: true,
    },
    {
      name: 'Venue',
      selector: row => row.venue,
      sortable: true,
      width:"200px"
    },
    {
      name: 'Pax',
      selector: row => row.pax,
      sortable: true,
    },
    {
      name: 'Rooms',
      selector: row => row.room,
      sortable: true,
       width:"150px"
    },
    {
      name: 'Food Type',
      selector: row => row.food_type,
      sortable: true,
    },
    {
      name: 'Includes',
      selector: row => Object.keys(row.package_includes || {})
        .filter(key => row.package_includes[key])
        .join(', ') || '-',
      wrap: true,
    },
    {
      name: 'Price',
      selector: row => `₹${row.price.toLocaleString()}`,
      sortable: true,
    },
   
    {
      name: 'Status',
      selector: row => row.status === 'active' ? 'Active' : 'Inactive',
      sortable: true,
    },
   
    {
      name: 'Action',
      cell: row => (
        <div className="flex gap-2">


          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
            onClick={() => handleView(row._id)}
            title="View"
          >
            <FaEye></FaEye>
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
            onClick={() => handleUpdate(row._id)}
            title="Update"
          >
            <FaEdit />
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
            onClick={() => confirmDelete(row)}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  return (
    <div>


      <div className="card">
        <div className="card-header pb-2 pt-4 card-border">
          <div className='common-flex justify-between item-center'>
            <h5 className="mb-3">All events</h5>
            <button className='btn btn-info' >
              All events
            </button>
          </div>
        </div>
        <div className="card-body pt-5 pl-0 pr-0 pt-5">
          <GetTable
            columns={columns}
            data={events}

            title="Pandits List"
          />
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete <strong>{productToDelete?.category_name}</strong>?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer></ToastContainer>
    </div>
  );
}

export default GetEvents;
