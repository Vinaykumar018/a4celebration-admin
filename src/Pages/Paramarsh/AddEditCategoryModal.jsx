const AddEditCategoryModal = ({ 
    show,
    onHide,
    isEditMode, 
    formData, 
    isLoading, 
    error, 
    handleInputChange, 
    handleFileChange, 
    handleSubmit, 
    resetForm, 
    removeImage,
    fileInputRef
  }) => {
    return (
      <div 
        className={`modal fade ${show ? 'show' : ''}`} 
        style={{ display: show ? 'block' : 'none' }}
        id="addCategoryModal" 
        tabIndex="-1" 
        role="dialog" 
        aria-labelledby="addCategoryModalLabel" 
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addCategoryModalLabel">
                {isEditMode ? 'Edit Category' : 'Add New Category'}
              </h5>
              <button 
                className="btn-close py-0" 
                type="button" 
                onClick={onHide}
                aria-label="Close" 
              ></button>
            </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger mb-3">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Category Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name" 
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="short_description" className="form-label">Short Description</label>
                <textarea 
                  className="form-control" 
                  id="short_description" 
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  rows="3" 
                  placeholder="Enter short description"
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="long_discription" className="form-label">Long Description</label>
                <textarea 
                  className="form-control" 
                  id="long_discription" 
                  name="long_discription"
                  value={formData.long_discription}
                  onChange={handleInputChange}
                  rows="5" 
                  placeholder="Enter long description"
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  className="form-control" 
                  id="status" 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="featurd_image" className="form-label">Featured Image</label>
                <input 
                  type="file" 
                  className="form-control" 
                  id="featurd_image" 
                  name="featurd_image"
                  onChange={handleFileChange}
                  accept="image/*"
                  ref={fileInputRef}
                />
                {formData.imagePreview && (
                  <div className="mt-3">
                    <img 
                      src={formData.imagePreview} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '200px' }} 
                      className="img-thumbnail"
                    />
                    <button 
                      type="button" 
                      className="btn btn-danger btn-sm ms-2"
                      onClick={removeImage}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-danger text-white" 
                  type="button" 
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  Close
                </button>
                <button 
                  className="btn btn-success text-white" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : isEditMode ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default AddEditCategoryModal;