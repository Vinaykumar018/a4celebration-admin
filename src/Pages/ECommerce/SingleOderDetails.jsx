import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SingleOrderDetails.css";

const SingleOrderDetails = () => {
  const { id } = useParams();
  const orderId = id;
  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusUpdated, setStatusUpdated] = useState(false);

  const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8";
  const BASE_URL = 'https://a4celebration.com/api/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderRes, deliveryRes] = await Promise.all([
          axios.get(`${BASE_URL}/e-store/orders/${orderId}`, {
            headers: { Authorization: token },
          }),
          axios.get(`${BASE_URL}/order/delivery-address/${orderId}`, {
            headers: { Authorization: token },
          })
        ]);

        setOrder(orderRes.data.order);
        setDelivery(deliveryRes.data);
        setSelectedStatus(orderRes.data.order.orderStatus);
      } catch (error) {
        toast.error("Error fetching order details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const getStatusClass = (status) => {
    switch (status) {
      case "delivered": return "completed";
      case "shipped": return "in-progress";
      case "processing": return "processing";
      case "completed": return "completed";
      default: return "pending";
    }
  };

  const getTimelineStatus = (currentStatus, timelineStatus) => {
    const statusOrder = ["placed", "payment", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(
      currentStatus === "completed" ? "delivered" :
        currentStatus === "in-progress" ? "shipped" :
          currentStatus.toLowerCase()
    );
    const timelineIndex = statusOrder.indexOf(timelineStatus);

    if (timelineIndex < currentIndex) {
      return "completed";
    } else if (timelineIndex === currentIndex) {
      return getStatusClass(currentStatus);
    }
    return "pending";
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      toast.warning("Please select a status");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/e-store/update-order-status/${orderId}`,
        { orderStatus: selectedStatus },
        { headers: { Authorization: token } }
      );

      // Trigger the blink animation
      setStatusUpdated(true);

      toast.success("Order status updated successfully!");

      // Refresh the order data
      const response = await axios.get(`${BASE_URL}/e-store/orders/${orderId}`, {
        headers: { Authorization: token },
      });
      setOrder(response.data.order);

      // Remove the blink animation after 3 seconds
      setTimeout(() => setStatusUpdated(false), 3000);
    } catch (error) {
      toast.error("Failed to update order status!");
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order || !delivery) {
    return <div className="error-message">Failed to load order details</div>;
  }

  const currentStatus = order.orderStatus.toLowerCase();
  const shouldBlink = (status) => {
    const statusMap = {
      "placed": "pending",
      "payment": currentStatus === "pending",
      "processing": currentStatus === "processing",
      "shipped": currentStatus === "shipped",
      "delivered": currentStatus === "delivered" || currentStatus === "completed"
    };
    return statusUpdated && statusMap[status];
  };

  return (
    <div className="order-details-container card mb-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Order Header */}
      <div className="order-header">
        <h2>
          <i className="fas fa-shopping-cart"></i> Order #{order._id}
        </h2>
        <div className="order-meta">
          <span className="order-date">
            <i className="far fa-calendar-alt"></i> {new Date(order.createdAt).toLocaleDateString()}
          </span>
          <span className={`order-status ${getStatusClass(order.orderStatus)} ${statusUpdated ? 'blink' : ''}`}>
            {order.orderStatus}
          </span>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="order-timeline">
        <div className="timeline-item">
          <div className={`timeline-dot ${getTimelineStatus(currentStatus, "placed")} ${shouldBlink("placed") ? 'blink' : ''}`}></div>
          <div className={`timeline-line ${getTimelineStatus(currentStatus, "placed")} ${shouldBlink("placed") ? 'blink' : ''}`}></div>
          <div className={`timeline-label ${currentStatus === "pending" ? 'active' : ''}`}>Order Placed</div>
        </div>
        {/* <div className="timeline-item">
          <div className={`timeline-dot ${order.paymentDetails.paymentDate ? "completed" : getTimelineStatus(currentStatus, "payment")} ${shouldBlink("payment") ? 'blink' : ''}`}></div>
          <div className={`timeline-line ${order.paymentDetails.paymentDate ? "completed" : getTimelineStatus(currentStatus, "payment")} ${shouldBlink("payment") ? 'blink' : ''}`}></div>
          <div className={`timeline-label ${currentStatus === "pending" && !order.paymentDetails.paymentDate ? 'active' : ''}`}>Payment Completed</div>
        </div> */}
        <div className="timeline-item">
          <div className={`timeline-dot ${getTimelineStatus(currentStatus, "processing")} ${shouldBlink("processing") ? 'blink' : ''}`}></div>
          <div className={`timeline-line ${getTimelineStatus(currentStatus, "processing")} ${shouldBlink("processing") ? 'blink' : ''}`}></div>
          <div className={`timeline-label ${currentStatus === "processing" ? 'active' : ''}`}>Processing</div>
        </div>
        <div className="timeline-item">
          <div className={`timeline-dot ${getTimelineStatus(currentStatus, "shipped")} ${shouldBlink("shipped") ? 'blink' : ''}`}></div>
          <div className={`timeline-line ${getTimelineStatus(currentStatus, "shipped")} ${shouldBlink("shipped") ? 'blink' : ''}`}></div>
          <div className={`timeline-label ${currentStatus === "shipped" ? 'active' : ''}`}>Shipped</div>
        </div>
        <div className="timeline-item">
          <div className={`timeline-dot ${getTimelineStatus(currentStatus, "delivered")} ${shouldBlink("delivered") ? 'blink' : ''}`}></div>
          <div className={`timeline-label ${currentStatus === "delivered" || currentStatus === "completed" ? 'active' : ''}`}>Delivered</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="order-content-grid">
        {/* Left Column */}
        <div className="order-left-column">
          {/* Order Items */}
          <div className="order-card">
            <h3 className="card-title">
              <i className="fas fa-box-open"></i> Order Items
            </h3>
            <div className="order-items">
              {order.orderDetails.map((product, index) => (
                <div className="order-item" key={index}>
                  <div className="item-image">
                    <img src={product.imageUrl || "https://via.placeholder.com/80"} alt={product.productName} />
                  </div>
                  <div className="item-details">
                    <h4>{product.productName}</h4>
                    <p className="item-description">{product.description}</p>
                    <div className="item-meta">
                      <span className="item-price">₹{product.amount}</span>
                      <span className="item-quantity">Qty: {product.quantity}</span>
                      <span className="item-total">₹{product.amount * product.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="order-card">
            <h3 className="card-title">
              <i className="fas fa-user"></i> Customer Information
            </h3>
            <div className="customer-info">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{order.userDetails.username}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{order.userDetails.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{order.userDetails.contactNumber}</span>
              </div>
            </div>
          </div>
          {/* Delivery Address */}
          <div className="order-card">
            <h3 className="card-title">
              <i className="fas fa-truck"></i> Delivery Address
            </h3>
            <div className="address-card">
              <p>{delivery.DeliveryAddress.AddressLine1}</p>
              {delivery.DeliveryAddress.AddressLine2 && <p>{delivery.DeliveryAddress.AddressLine2}</p>}
              <p>
                {delivery.DeliveryAddress.City}, {delivery.DeliveryAddress.State} - {delivery.DeliveryAddress.PostalCode}
              </p>
              <p>{delivery.DeliveryAddress.Country}</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="order-right-column">
          <div className="order-card">
            <h3 className="card-title">
              <i className="fas fa-sync-alt"></i> Update Status
            </h3>
            <div className="status-update">
              <select
                className="status-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
              <button
                className="update-btn"
                onClick={handleStatusUpdate}
              >
                Update Status
              </button>
            </div>
          </div>
          {/* Order Summary */}
          <div className="order-card">
            <h3 className="card-title">
              <i className="fas fa-receipt"></i> Order Summary
            </h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{order.paymentDetails.totalAmount}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>₹0</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>₹0</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{order.paymentDetails.totalAmount}</span>
            </div>
          </div>
          {/* Payment Information */}
          <div className="order-card">
            <h3 className="card-title">
              <i className="fas fa-credit-card"></i> Payment Information
            </h3>
            <div className="payment-info">
              <div className="info-row">
                <span className="info-label">Method:</span>
                <span className="info-value">{order.paymentDetails.paymentMethod}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className={`info-value ${getStatusClass(order.paymentDetails.transactionStatus)}`}>
                  {order.paymentDetails.transactionStatus}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Transaction ID:</span>
                <span className="info-value">{order.paymentDetails.transactionId || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrderDetails;