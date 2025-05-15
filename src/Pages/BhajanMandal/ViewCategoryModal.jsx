import React from "react";

const ViewCategoryModal = ({ show, onClose, category, imageField = 'bhajan_image' }) => {
  if (!show || !category) return null;

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Category Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <h6>Category Name</h6>
              <p>{category.category}</p>
            </div>
            <div className="mb-3">
              <h6>Description</h6>
              <p>{category.short_discription}</p>
            </div>
            <div className="mb-3">
              <h6>Slug URL</h6>
              <p>{category.slug_url}</p>
            </div>
            <div className="mb-3">
              <h6>Status</h6>
              <span className={`badge ${category.status ? 'bg-success' : 'bg-danger'}`}>
                {category.status ? 'Active' : 'Inactive'}
              </span>
            </div>
            {category[imageField] && (
              <div className="mb-3">
                <h6>Image</h6>
                <img
                  src={`http://localhost:3000${category[imageField]}`}
                  alt={category.category}
                  width="150"
                  className="img-thumbnail"
                />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger text-white" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCategoryModal;