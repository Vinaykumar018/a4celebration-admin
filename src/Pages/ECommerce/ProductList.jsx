import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import {
  fetchProduct,
  deleteProduct,
  updateFeaturedStatus,
  updateStatus
} from '../../Services/productApiService';
import GetTable from '../../Component/GetTable';
import { FaEdit, FaEye, FaTrash, FaPlus } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [rowToView, setRowToView] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetchProduct();
      if (response?.success && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        toast.error("Invalid data format received from server");
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error("Failed to load data");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const navigateToAddProduct = () => {
    navigate('/e-commerce/add-product');
  };

  const handleEdit = (id) => {
    navigate(`/product/update-product/${id}`);
  };

  const handleDelete = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteProduct(productToDelete);
      if (response.status === 1) {
        toast.success("Product deleted successfully!");
        setProducts(products.filter((item) => item._id !== productToDelete));
      } else {
        toast.error(response.message || "Failed to delete product.");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting product. Please try again.");
      console.error("Error deleting product:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleView = (row) => {
    setRowToView(row);
    setViewModalVisible(true);
  };

  const handleToggleFeatured = async (id) => {
    try {
      const product = products.find(p => p._id === id);
      if (!product) return;

      const newStatus = !product.isFeatured;
      const response = await updateFeaturedStatus(id, { isFeatured: newStatus });

      if (response?.success) {
        setProducts(products.map(p =>
          p._id === id ? { ...p, isFeatured: newStatus } : p
        ));
        toast.success(`Product marked as ${newStatus ? 'featured' : 'not featured'}`);
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  const handleStatusToggle = async (id) => {
    try {
      const product = products.find(p => p._id === id);
      if (!product) return;

      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      const response = await updateStatus(id, { status: newStatus });

      if (response?.success) {
        setProducts(products.map(p =>
          p._id === id ? { ...p, status: newStatus } : p
        ));
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
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
      name: 'Image',
      cell: (row) => (
        <img
          src={`https://a4celebration.com/api/${row.featuredImage}`}
          alt={row.name}
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: '4px' }}
        />
      ),
      width: '100px'
    },
    {
      name: 'Product Name',
      selector: (row) => row.name,
      sortable: true,
      width: '200px',
      wrap: true
    },
    {
      name: 'Category',
      selector: (row) => row.category,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Price',
      cell: (row) => (
        <div>
          <div>Price: ₹{row.price || '0'}</div>
          <div>Selling: ₹{row.sellingPrice || '0'}</div>
        </div>
      ),
      width: '150px'
    },
    {
      name: 'Stock',
      selector: (row) => row.stock || '0',
      sortable: true,
      width: '100px'
    },
    {
      name: 'Featured',
      cell: (row) => (
        <span
          className={`badge ${row.isFeatured ? 'bg-success' : 'bg-secondary'}`}
          style={{ cursor: 'pointer' }}
          onClick={() => handleToggleFeatured(row._id)}
        >
          {row.isFeatured ? 'Yes' : 'No'}
        </span>
      ),
      width: '100px'
    },
    {
      name: 'Status',
      cell: (row) => (
        <span
          className={`badge ${row.status === 'active' ? 'bg-success' : 'bg-danger'}`}
          style={{ cursor: 'pointer' }}
          onClick={() => handleStatusToggle(row._id)}
        >
          {row.status}
        </span>
      ),
      width: '100px'
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
      width: '150px',
    }
  ];

  return (
    <>
      <div className="card">
        <div className="card-header pb-2 pt-4 card-border">
          <div className='common-flex justify-between item-center'>
            <h5 className="mb-3">Product List</h5>
            <button
              className='btn btn-info'
              onClick={navigateToAddProduct}
              disabled={loading}
            >
              <FaPlus className="me-2" />
              Add Product
            </button>
          </div>
        </div>
        <div className="card-body pt-5 pl-0 pr-0 pt-5">
          <GetTable
            columns={columns}
            data={products}
            loading={loading}
            title="Product List"
            noDataMessage={loading ? "Loading..." : "No products found"}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Product Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this product? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-info text-white"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger text-white"
                  onClick={handleConfirmDelete}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
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
                <h5 className="modal-title text-white">Product Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  style={{ filter: 'invert(1)' }}
                  onClick={() => setViewModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="p-4 border-bottom">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <img
                        src={`https://a4celebration.com/api/${rowToView.featuredImage}`}
                        alt={rowToView.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                    <div className="col-md-8">
                      <h4>{rowToView.name}</h4>
                      <div className="d-flex gap-3 mb-2">
                        <span className={`badge ${rowToView.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                          {rowToView.status}
                        </span>
                        <span className={`badge ${rowToView.isFeatured ? 'bg-primary' : 'bg-secondary'}`}>
                          {rowToView.isFeatured ? 'Featured' : 'Not Featured'}
                        </span>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <p><strong>Category:</strong> {rowToView.category}</p>
                          <p><strong>Price:</strong> ₹{rowToView.price}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Selling Price:</strong> ₹{rowToView.sellingPrice}</p>
                          <p><strong>Stock:</strong> {rowToView.stock}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h5 className="mb-3">Additional Information</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>GST:</strong> {rowToView.gst || 'N/A'}</p>
                      <p><strong>Local Delivery:</strong> {rowToView.local_delivery || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Created At:</strong> {new Date(rowToView.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h6>Description:</h6>
                    <div className="border p-2 rounded bg-light">
                      {rowToView.short_discription || 'No description available'}
                    </div>
                  </div>
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

export default ProductList;