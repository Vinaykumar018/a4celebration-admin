import React from 'react';

const NewOrderTable = () => {
  return (
    <div className="card">
      <div className="card-header card-no-border">
        <div className="header-top">
          <h5>New Order</h5>
          <div className="card-header-right-icon">
            <div className="dropdown icon-dropdown">
              <button className="btn dropdown-toggle" id="recentButton" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="icon-more-alt"></i>
              </button>
              <div className="dropdown-menu dropdown-menu-end" aria-labelledby="recentButton">
                <a className="dropdown-item" href="#!">Today</a>
                <a className="dropdown-item" href="#!">Tomorrow</a>
                <a className="dropdown-item" href="#!">Yesterday</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body px-0 pt-0 common-option">
        <div className="recent-table overflow-x-auto currency-table recent-order-table custom-scrollbar">
          <table className="table" id="main-recent-order">
            <thead>
              <tr>
                <th></th>
                <th>Product Name</th>
                <th>Customers</th>
                <th>Qty</th>
                <th>Total Price</th>
                <th>Order Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="currency-icon warning">
                      <img className="max-w-full h-auto" src="../assets/images/dashboard-2/order/sub-product/16.png" alt="" />
                    </div>
                    <div> 
                      <a className="f-14 mb-0 font-medium c-light" href="product-details.html">Bag</a>
                      <p className="c-o-light">#452140</p>
                    </div>
                  </div>
                </td>
                <td>Jenny Wilson</td>
                <td>2 PCS</td>
                <td>$2,854</td>
                <td>16 Jan,2025</td>
                <td><button className="btn button-light-success txt-success font-medium">Delivered</button></td>
              </tr>
              {/* Additional rows... */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewOrderTable;