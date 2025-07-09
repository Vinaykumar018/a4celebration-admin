import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const UpdateOrderModal = ({ 
  isOpen, 
  onClose, 
  currentStatus, 
  onUpdateStatus,
  requestId
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

   const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-orange-100 text-orange-800' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-600' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-400 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    ,
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onUpdateStatus(requestId, { status });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">Update Order Status</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    status === option.value 
                      ? `${option.color} border-2 border-current`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatus(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

         

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOrderModal;