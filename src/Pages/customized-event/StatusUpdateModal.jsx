import React, { useState } from 'react';
import { FaRupeeSign, FaTimes } from 'react-icons/fa';
import { ToastContainer,toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const StatusUpdateModal = ({ 
  isOpen, 
  onClose, 
  currentStatus, 
  onUpdateStatus,
  requestId,currentBudgetStatus
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [adminNotes, setAdminNotes] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-orange-100 text-orange-800' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

   try {
  const updateData = {
    status,
    admin_notes: adminNotes,
    ...(finalPrice && { final_price: Number(finalPrice) }),
  };

  await onUpdateStatus(requestId, updateData);
  toast.success("Status updated successfully!", { autoClose: 2000 });
  setTimeout(onClose, 2000); // 200ms or slightly more
} catch (err) {
  toast.error("Failed to update status: " + (err.message || ""), { autoClose: 3000 });
  setError(err.message || 'Failed to update status');
} finally {
  setIsSubmitting(false);
}

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <ToastContainer></ToastContainer>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">Update Request Status</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Notes
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={3}
              placeholder="Add any notes for the customer..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quoted Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <input
                  type="number"
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
               
              {console.log(currentBudgetStatus)}
            </div> */}

<div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
               Requested Price
              </label>
             <div className="relative">
                
                <input
                  type="string"
                  value={currentBudgetStatus}
                 disabled
                  className="w-full pl-8 pr-3 py-2 border border-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-orange-100 text-orange-800"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
               </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Final Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2"><FaRupeeSign></FaRupeeSign></span>
                <input
                  type="number"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}

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

export default StatusUpdateModal;