import React, { useState, useEffect } from 'react';
import { FaEdit, FaPlusCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { fetchCommission, updateCommission } from '../../Services/settingsService';

const CommissionSettings = () => {
  const [action, setAction] = useState('POST');
  const [comission, setComission] = useState({
    target: 'mandali',
    commision: '',
    commision_type: 'percentage',
  });
  const [panditComissionID, setPanditComissionId] = useState(null);
  const [mandaliComissionID, setMandaliComissionID] = useState(null);
  const [panditData, setPanditData] = useState(null);
  const [mandaliData, setMandaliData] = useState(null);

  const handleChange = (e) => {
    setComission((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    const loadCommissionData = async () => {
      try {
        const response = await fetchCommission();
        
        if (response && response.data.length > 0) {
          const fetchedCommissions = response.data;
          
          const panditCommission = fetchedCommissions.find(item => item.target === 'pandit');
          const mandaliCommission = fetchedCommissions.find(item => item.target === 'mandali');

          if (panditCommission) {
            setPanditComissionId(panditCommission._id);
            setPanditData({
              commision: panditCommission.commision,
              commision_type: panditCommission.commision_type
            });
          }

          if (mandaliCommission) {
            setMandaliComissionID(mandaliCommission._id);
            setMandaliData({
              commision: mandaliCommission.commision,
              commision_type: mandaliCommission.commision_type
            });
            setComission({
              target: 'mandali',
              commision: mandaliCommission.commision,
              commision_type: mandaliCommission.commision_type
            });
          }

          setAction('PUT');
        }
      } catch (error) {
        toast.error('Failed to fetch commission data.');
      }
    };

    loadCommissionData();
  }, []);

  const handleSubmit = async () => {
    if (!comission.commision) {
      toast.error('Please enter a valid commission value.');
      return;
    }

    try {
      const isUpdate = action === 'PUT';
      const commissionId = comission.target === 'pandit' ? panditComissionID : mandaliComissionID;
      const data = isUpdate ? { ...comission, commissionId } : comission;
      
      await updateCommission(data, isUpdate);
      toast.success(`Commission ${isUpdate ? 'updated' : 'created'} successfully!`);
      
      // Refresh data
      const response = await fetchCommission();
      const fetchedCommissions = response.data;
      
      if (comission.target === 'pandit') {
        const panditCommission = fetchedCommissions.find(item => item.target === 'pandit');
        setPanditData({
          commision: panditCommission.commision,
          commision_type: panditCommission.commision_type
        });
      } else {
        const mandaliCommission = fetchedCommissions.find(item => item.target === 'mandali');
        setMandaliData({
          commision: mandaliCommission.commision,
          commision_type: mandaliCommission.commision_type
        });
      }
    } catch (error) {
      toast.error('Failed to submit commission data.');
    }
  };

  useEffect(() => {
    if (comission.target === 'pandit' && panditData) {
      setComission({
        target: 'pandit',
        commision: panditData.commision,
        commision_type: panditData.commision_type
      });
    } else if (comission.target === 'mandali' && mandaliData) {
      setComission({
        target: 'mandali',
        commision: mandaliData.commision,
        commision_type: mandaliData.commision_type
      });
    }
  }, [comission.target, panditData, mandaliData]);

  return (
    <div className="card shadow-sm rounded-3 hover-shadow-lg transition-all  h-full">
      <div className="card-header p-3">
        <h5 className="text-uppercase text-center">UPDATE EXISTING COMMISSION</h5>
      </div>
      <div className="card-body">
        <div className="d-flex flex-column gap-3">
          <div className="form-group">
            <label htmlFor="target" className="form-label fw-bold">Commission Target</label>
            <select
              id="target"
              name="target"
              onChange={handleChange}
              value={comission.target}
              className="form-control select-input"
            >
              <option value="mandali">Mandali Commission</option>
              <option value="pandit">Pandit Commission</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="commission" className="form-label fw-bold">Commission Value</label>
            <input
              id="commission"
              type="number"
              placeholder="Enter commission value"
              name="commision"
              value={comission.commision}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type" className="form-label fw-bold">Commission Type</label>
            <select
              id="type"
              name="commision_type"
              onChange={handleChange}
              value={comission.commision_type}
              className="form-control select-input"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>

          <button
            className="btn btn-success btn-md mt-4 text-white px-5 float-end"
            onClick={handleSubmit}
          >
            {action === 'POST' ? (
              <span>
                <FaPlusCircle className="me-2" />
                Create Commission
              </span>
            ) : (
              <span>
                <FaEdit className="me-2" />
                UPDATE COMMISSION
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommissionSettings;