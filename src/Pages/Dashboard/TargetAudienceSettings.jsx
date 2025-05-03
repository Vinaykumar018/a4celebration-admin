import React from 'react';

const TargetAudienceSettings = () => {
  return (
    <div className="card shadow-lg mb-4  h-full">
      <div className="card-header p-3">
        <h5 className="text-uppercase text-center">SELECT TARGET AUDIENCE</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <label className="form-label text-uppercase fw-bold">TARGET AUDIENCE</label>
          <select className="form-select">
            <option value="">Select Audience</option>
            <option value="user">User</option>
            <option value="pandit">Pandit</option>
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" placeholder="Enter your name" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Enter your email" />
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-success text-white  btn-md px-5 float-end">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TargetAudienceSettings;