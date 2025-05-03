import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryService from '../../services/Paramarsh/categoryService';
import moment from 'moment';
import AddEditCategoryModal from './AddEditCategoryModal';
import ViewCategoryModal from './ViewCategoryModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import GetTable from '../../Component/GetTable';

function ParamarshCategory() {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [viewCategory, setViewCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    long_discription: '',
    status: '1',
    featurd_image: null,
    imagePreview: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef(null);

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await CategoryService.getAllCategories(token);
      setCategories(data.data);
    } catch (err) {
      setError('Failed to fetch categories');
      toast.error('Failed to fetch categories!');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategory = async (id) => {
    setIsLoading(true);
    try {
      const category = await CategoryService.getCategory(id, token);
      setCurrentCategory(category);
      setFormData({
        name: category.name,
        short_description: category.short_description,
        long_discription: category.long_discription,
        status: category.status.toString(),
        featurd_image: null,
        imagePreview: category.featurd_image 
          ? `http://localhost:3000/${category.featurd_image}`
          : null
      });
      setIsEditMode(true);
      document.getElementById('addCategoryModal').classList.add('show');
      document.getElementById('addCategoryModal').style.display = 'block';
      document.body.classList.add('modal-open');
    } catch (err) {
      toast.error('Failed to fetch category details!');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const viewCategoryDetails = async (id) => {
    setIsLoading(true);
    try {
      const category = await CategoryService.getCategory(id, token);
      setViewCategory(category);
      document.getElementById('viewCategoryModal').classList.add('show');
      document.getElementById('viewCategoryModal').style.display = 'block';
      document.body.classList.add('modal-open');
    } catch (err) {
      toast.error('Failed to fetch category details!');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          featurd_image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      featurd_image: null,
      imagePreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('short_description', formData.short_description);
      formDataToSend.append('long_discription', formData.long_discription);
      formDataToSend.append('status', formData.status);
      if (formData.featurd_image) {
        formDataToSend.append('featurd_image', formData.featurd_image);
      }

      if (isEditMode && currentCategory) {
        await CategoryService.updateCategory(currentCategory._id, formDataToSend, token);
        toast.success('Category updated successfully!');
      } else {
        await CategoryService.createCategory(formDataToSend, token);
        toast.success('Category created successfully!');
      }

      closeModal('addCategoryModal');
      resetForm();
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
      toast.error(err.response?.data?.message || 'Failed to save category!');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === '1' ? '0' : '1';
    if (window.confirm(`Are you sure you want to ${newStatus === '1' ? 'activate' : 'deactivate'} this category?`)) {
      try {
        await CategoryService.updateStatus(id, newStatus, token);
        toast.success(`Category ${newStatus === '1' ? 'activated' : 'deactivated'} successfully!`);
        await fetchCategories();
      } catch (err) {
        toast.error('Failed to update status!');
        console.error(err);
      }
    }
  };

  const confirmDelete = (category) => {
    setDeleteCategory(category);
    document.getElementById('deleteConfirmationModal').classList.add('show');
    document.getElementById('deleteConfirmationModal').style.display = 'block';
    document.body.classList.add('modal-open');
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;
    
    try {
      await CategoryService.deleteCategory(deleteCategory._id, token);
      toast.success('Category deleted successfully!');
      closeModal('deleteConfirmationModal');
      await fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category!');
      console.error(err);
    } finally {
      setDeleteCategory(null);
    }
  };

  const closeModal = (modalId) => {
    document.getElementById(modalId).classList.remove('show');
    document.getElementById(modalId).style.display = 'none';
    document.body.classList.remove('modal-open');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      short_description: '',
      long_discription: '',
      status: '1',
      featurd_image: null,
      imagePreview: null
    });
    setCurrentCategory(null);
    setIsEditMode(false);
    closeModal('addCategoryModal');
  };

  const closeViewModal = () => {
    closeModal('viewCategoryModal');
  };

  const closeDeleteModal = () => {
    closeModal('deleteConfirmationModal');
    setDeleteCategory(null);
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
      name: 'Featured Image',
      cell: (row) => (
        row.featurd_image && (
          <img 
            src={`http://localhost:3000${row.featurd_image}`} 
            alt={row.name} 
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            className="img-thumbnail"
          />
        )
      ),
      width: '120px',
    },
    {
      name: 'Short Description',
      selector: row => row.short_description.substring(0, 50) + '...',
      sortable: true,
    },
    {
      name: 'Status',
      cell: (row) => (
        <span 
          className={`badge ${row.status === "1" ? "bg-success" : "bg-danger"}`}
          style={{cursor:"pointer"}} 
          onClick={() => handleStatusChange(row._id, row.status)}
        >
          {row.status === "1" ? "Active" : "Inactive"}
        </span>
      ),
      width: '120px',
    },
    {
      name: 'Created Date',
      selector: row => moment(row.createdAt).format('DD/MM/YYYY'),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => viewCategoryDetails(row._id)}
            className="p-2 text-blue-600 hover:text-blue-900 rounded hover:bg-blue-100"
          >
            <i className="fa-regular fa-eye"></i>
          </button>
          <button
            onClick={() => fetchCategory(row._id)}
            className="p-2 text-yellow-600 hover:text-yellow-900 rounded hover:bg-yellow-100"
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
          <button
            onClick={() => confirmDelete(row._id)}
            className="p-2 text-red-600 hover:text-red-900 rounded hover:bg-red-100"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '180px',
    },
  ];

  const openAddModal = () => {
    resetForm();
    document.getElementById('addCategoryModal').classList.add('show');
    document.getElementById('addCategoryModal').style.display = 'block';
    document.body.classList.add('modal-open');
  };

  return (
    <div className="col-span-12">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card">
        <div className="card-header pb-0 card-no-border">
          <div className='common-flex justify-between item-center'>
            <h5 className="mb-3">Paramarsh Category</h5>
            <button 
              className="btn btn-info" 
              type="button" 
              onClick={openAddModal}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Add Category'}
            </button>                    
          </div>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger mb-3">
              {error}
            </div>
          )}
          <GetTable
            columns={columns}
            data={categories}
            loading={isLoading}
            title="Categories List"
            onAddClick={openAddModal}
            addButtonText="Add Category"
          />
        </div>
      </div>

      <AddEditCategoryModal
        isEditMode={isEditMode}
        formData={formData}
        isLoading={isLoading}
        error={error}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
        removeImage={removeImage}
        fileInputRef={fileInputRef}
      />

      <ViewCategoryModal 
        category={viewCategory} 
        closeModal={closeViewModal} 
      />

      <DeleteConfirmationModal 
        item={deleteCategory}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        itemType="category"
      />
    </div>  
  );
}

export default ParamarshCategory;