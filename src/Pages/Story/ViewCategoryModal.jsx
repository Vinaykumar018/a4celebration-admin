import React from "react";

const ViewCategoryModal = ({ show, onClose, category }) => {
  if (!show || !category) return null;

  const getLanguageName = (lang) => {
    switch (lang) {
      case 'english': return 'English';
      case 'hindi': return 'Hindi';
      case 'sanskrit': return 'Sanskrit';
      default: return lang;
    }
  };

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Category Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-4">
                {category.image && (
                  <img
                    src={`http://localhost:3000${category.image}`}
                    alt={category.title}
                    width="200"
                    className="img-thumbnail"
                  />
                )}
              </div>
              <div className="col-md-8">
                <div className="mb-3">
                  <h6>Language</h6>
                  <p>{getLanguageName(category.language)}</p>
                </div>
                <div className="mb-3">
                  <h6>Title</h6>
                  <p>{category.title}</p>
                </div>
              </div>
              <div className="col-md-8">
                <div className="mb-3">
                  <h6>Title</h6>
                  <p>{category.title}</p>
                </div>
                <div className="mb-3">
                  <h6>Meta Title</h6>
                  <p>{category.metaTitle}</p>
                </div>
                <div className="mb-3">
                  <h6>Meta Keywords</h6>
                  <p>{category.metaKeywords}</p>
                </div>
                <div className="mb-3">
                  <h6>Meta Description</h6>
                  <p>{category.metaDescription}</p>
                </div>
              </div>
            </div>
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