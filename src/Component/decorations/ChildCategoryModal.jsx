import React, { useState } from 'react';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ChildCategoryModal = ({
  mode,
  row,
  onClose,
  onSuccess
}) => {
  const [childCategoryName, setChildCategoryName] = useState('');
  const [childCategoryImage, setChildCategoryImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedChildIds, setSelectedChildIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChildCategoryImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // console.log(mode, 
  //   row, 
  //   onClose, 
  //   onSuccess)
  const handleAddChildCategory = async () => {
    if (!childCategoryName.trim()) {
      setError('Child category name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('child_category_name', childCategoryName);
      if (childCategoryImage) {
        formData.append('child_category_image', childCategoryImage);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://a4celebration.com/api/api/category/add-child-category/${row}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpbmF5IiwiaWF0IjoxNzQ0OTY2MzI0fQ.bHVez4j2ksigzKlm7G3G7OlzrlkgAIwN6cPZySRvdCI`
          },
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add child category');
      }

      toast.success('Child category added successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChildCategories = async () => {
    console.log(row)
    if (selectedChildIds.length === 0) {
      setError('Please select at least one child category');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://a4celebration.com/api/api/category/remove-child-category/${row._id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpbmF5IiwiaWF0IjoxNzQ0OTY2MzI0fQ.bHVez4j2ksigzKlm7G3G7OlzrlkgAIwN6cPZySRvdCI`
          },
          body: JSON.stringify({ child_ids: selectedChildIds })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete child categories');
      }

      toast.success('Child categories deleted successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChildSelection = (childId) => {
    setSelectedChildIds(prev =>
      prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'add') {
      handleAddChildCategory();
    } else {
      handleDeleteChildCategories();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {mode === 'add' ? 'Add Child Category' : 'Remove Child Categories'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'add' ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Child Category Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  value={childCategoryName}
                  onChange={(e) => setChildCategoryName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Child Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm"
                  disabled={isLoading}
                />
                {previewImage && (
                  <div className="mt-2">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-32 object-contain"
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Child Categories to Remove
              </label>
              <div className="max-h-60 overflow-y-auto border rounded">
                {row.child_category && Object.entries(row.child_category).length > 0 ? (
                  Object.entries(row.child_category).map(([id, child]) => (
                    <div
                      key={id}
                      className="p-2 border-b hover:bg-gray-50 flex items-center text-sm"
                    >
                      <input
                        type="checkbox"
                        id={`child-${id}`}
                        checked={selectedChildIds.includes(id)}
                        onChange={() => toggleChildSelection(id)}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <div className="flex items-center">
                        {child.image && (
                          <img
                            src={`https://a4celebration.com/api${child.image}`}
                            alt={child.name}
                            className="w-8 h-8 object-cover rounded-full mr-2"
                          />
                        )}
                        <label htmlFor={`child-${id}`} className="cursor-pointer">
                          {child.name}
                        </label>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No child categories found
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded text-sm ${mode === 'add'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-red-600 hover:bg-red-700'
                }`}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : mode === 'add' ? 'Add' : 'Delete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChildCategoryModal;