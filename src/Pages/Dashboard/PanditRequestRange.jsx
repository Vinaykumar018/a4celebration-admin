import React, { useEffect, useState } from 'react';
import { GiPathDistance } from 'react-icons/gi';
import { ToastContainer, toast } from 'react-toastify';
import { FaEdit, FaPlusCircle } from 'react-icons/fa';
import { getPanditRange, updatePanditRange, createPanditRange } from '../../Services/serviceApi';

const PanditRequestRange = () => {
  const [action, setAction] = useState('POST');
  const [rangeId, setRangeID] = useState(null);
  const [range, setRange] = useState({ range: '' });

  const handleChange = (e) => {
    setRange({ ...range, [e.target.name]: e.target.value });
  };

  const handleFetch = async () => {
    try {
      const response = await getPanditRange();
      if (response.data.data.length > 0) {
        const fetchedRange = response.data.data[0];
        setRangeID(fetchedRange._id);
        setRange({ range: fetchedRange.range });
        setAction('PUT');
      }
    } catch (error) {
      console.error('Error fetching range:', error);
      toast.error('Failed to fetch range data');
    }
  };

  const handleSubmit = async () => {
    if (!range.range) {
      toast.error('Please enter a valid range before submitting.');
      return;
    }

    try {
      if (action === 'POST') {
        await createPanditRange({ range: range.range });
      } else {
        await updatePanditRange({ rangeId, range: range.range });
      }
      toast.success(`Range ${action === 'POST' ? 'created' : 'updated'} successfully!`);
      handleFetch();
    } catch (error) {
      console.error('Error submitting range:', error);
      toast.error('Failed to submit range. Please try again.');
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div className="col-12 mb-4">
      <ToastContainer />
      <div className="card shadow-sm rounded-3 hover-shadow-lg transition-all">
        <div className="card-body text-white rounded-3" style={{ 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
          padding: '1.5rem'
        }}>
          <div className="d-flex justify-content-center mb-4">
            <div className="range-icon" style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '5px 5px 10px #d9d9d9, -5px -5px 10px #ffffff'
            }}>
              <GiPathDistance size={30} className="text-primary" />
            </div>
          </div>

          <h5 className="card-title text-center mb-4" style={{ 
            fontSize: '18px',
            color: '#2c3e50',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Pandit Request Range
          </h5>

          <div className="d-flex flex-column gap-3">
            <div className="form-group">
              <label htmlFor="range" className="form-label">Distance (in km)</label>
              <input
                id="range"
                type="number"
                placeholder="Enter distance in kilometers"
                name="range"
                value={range.range}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <button
              className="btn submit-btn"
              onClick={handleSubmit}
              style={{
                background: 'linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                padding: '12px 0',
                fontWeight: '600',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              {action === 'POST' ? (
                <>
                  <FaPlusCircle size={18} />
                  Set Range
                </>
              ) : (
                <>
                  <FaEdit size={16} />
                  Update Range
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanditRequestRange;