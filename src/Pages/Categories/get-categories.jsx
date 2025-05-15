import React, { useEffect, useState } from 'react';
import GetTable from '../../Component/GetTable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, removeCategory } from '../../redux/categoriesSlice';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa'; // Added FaTimes
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChildCategoryModal from '../../Component/decorations/ChildCategoryModal';



const GetCategories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading, error } = useSelector((state) => state.categories);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleUpdate = (id) => {
    navigate(`/update/update-category-list/${id}`);
  };

  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(removeCategory(categoryToDelete._id)).unwrap();
      toast.success('Category deleted successfully!');
      dispatch(fetchCategories());
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setShowModal(false);
      setCategoryToDelete(null);
    }
  };

  // Child category modal state
  const [childCategoryModal, setChildCategoryModal] = useState({
    show: false,
    mode: 'add',
    row: null
  });

  const handleAddChildCategory = (row) => {
    console.log(row)
    setChildCategoryModal({
      show: true,
      mode: 'add',
      row
    });
  };

  const confirmChildCategoryDelete = (row) => {
    setChildCategoryModal({
      show: true,
      mode: 'delete',
      row
    });
  };

  const handleChildCategorySuccess = () => {
    dispatch(fetchCategories());
  };
  console.log(categories)
  const columns = [
    {
      name: 'Image',
      selector: row => row.category_image,
      cell: row => (
        <img
          src={`http://localhost:3000/${row.category_image.replace(/\\/g, '/')}`}
          alt={row.category_name}
          style={{
            width: '3rem',
            height: '3rem',
            objectFit: 'cover',
            borderRadius: '0.25rem'
          }}
        />
      ),
      width: '5rem',
      minWidth: '5rem',
    },
    {
      name: 'Name',
      selector: row => row.category_name,
      sortable: true,
      wrap: true,
      width: '10rem',
      minWidth: '10rem',
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
      wrap: true,
      width: '15rem',
      minWidth: '12rem',
      grow: 1,
    },
    {
      name: 'Child Categories',
      cell: row => (
        <div className="flex items-center gap-2">
          <div className="flex gap-1 whitespace-nowrap py-1 scrollbar-hide flex-1">
            {row.child_category && Object.entries(row.child_category).map(([id, child], index) => {
              const colors = [
                'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
                'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
                'bg-red-500', 'bg-teal-500'
              ];
              const color = colors[index % colors.length];
              return (
                <span
                  key={id}
                  className={`${color} text-white text-[0.6rem] px-1 py-0.5 rounded-full inline-block leading-none`}
                >
                  {child.name}
                </span>
              );
            })}
          </div>
          <div className="flex gap-1">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded text-sm"
              onClick={() => handleAddChildCategory(row._id)}
              title="Edit Child Categories"
            >
              <FaEdit size={12} />
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-sm"
              onClick={() => confirmChildCategoryDelete(row)}
              title="Remove Child Categories"
            >
              <FaTrash size={12} />
            </button>
          </div>
        </div>
      ),
      width: '25rem',
      minWidth: '15rem',
      wrap: false,
    }
    ,
    {
      name: 'Slug URL',
      selector: row => row.slug_url || '-',
      wrap: true,
      width: '10rem',
      minWidth: '8rem',
    },
    {
      name: 'Status',
      selector: row => (row.status === '1' ? 'Active' : 'Inactive'),
      sortable: true,
      width: '6rem',
      minWidth: '6rem',
      center: true,
    },
    {
      name: 'Created At',
      selector: row => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      width: '8rem',
      minWidth: '8rem',
    },
    {
      name: 'Action',
      cell: row => (
        <div className="flex gap-1">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded text-sm"
            onClick={() => handleUpdate(row._id)}
            title="Update"
          >
            <FaEdit size={12} />
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-sm"
            onClick={() => confirmDelete(row)}
            title="Delete"
          >
            <FaTrash size={12} />
          </button>
        </div>
      ),
      width: '6rem',
      minWidth: '6rem',
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
            <h5 className="mb-3">All Categories</h5>
            <button className='btn btn-info' >
              All Categories
            </button>
          </div>
        </div>
        <div className="card-body pt-5 pl-0 pr-0 pt-5">
          <GetTable
            columns={columns}
            data={categories}
            title="Categories List"
          />
        </div>
      </div>

      {/* Delete Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete <strong>{categoryToDelete?.category_name}</strong>?</p>
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

      {/* Child Category Modal */}
      {childCategoryModal.show && (
        <ChildCategoryModal
          mode={childCategoryModal.mode}
          row={childCategoryModal.row}
          onClose={() => setChildCategoryModal({ show: false, mode: 'add', row: null })}
          onSuccess={handleChildCategorySuccess}
        />
      )}

      <ToastContainer />
    </div>
  );
}

export default GetCategories;