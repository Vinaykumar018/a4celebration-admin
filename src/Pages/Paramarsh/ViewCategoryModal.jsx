import React from 'react';
import moment from 'moment';

const ViewCategoryModal = ({ category, closeModal }) => {
  if (!category) return null;

  return (
    <div className="modal fade" id="viewCategoryModal" tabIndex="-1" role="dialog" aria-labelledby="viewCategoryModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="viewCategoryModalLabel">Category Details</h5>
            <button
              className="btn-close py-0"
              type="button"
              onClick={closeModal}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <h6>Name:</h6>
                <p>{category.name}</p>
              </div>
              <div className="col-md-6 mb-3">
                <h6>Status:</h6>
                <p>
                  <span className={`badge ${category.status === "1" ? "bg-success" : "bg-danger"}`}>
                    {category.status === "1" ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-3">
              <h6>Featured Image:</h6>
              {category.featurd_image && (
                <img
                  src={`https://a4celebration.com/api/${category.featurd_image}`}
                  alt={category.name}
                  style={{ maxWidth: '100%', maxHeight: '300px' }}
                  className="img-thumbnail"
                />
              )}
            </div>

            <div className="mb-3">
              <h6>Short Description:</h6>
              <p>{category.short_description}</p>
            </div>

            <div className="mb-3">
              <h6>Long Description:</h6>
              <p>{category.long_discription}</p>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <h6>Created At:</h6>
                <p>{moment(category.createdAt).format('DD/MM/YYYY HH:mm')}</p>
              </div>
              <div className="col-md-6 mb-3">
                <h6>Updated At:</h6>
                <p>{moment(category.updatedAt).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCategoryModal;