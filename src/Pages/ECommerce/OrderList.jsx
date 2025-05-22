import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import GetTable from '../../Component/GetTable';
import { MdCancel } from "react-icons/md";
import { FaEye, FaChevronDown, FaChevronUp, FaUser } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState({});
    const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';
    const BASE_URL = 'https://a4celebration.com/api/api/'

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/e-store/all-order`, {
                headers: { Authorization: token },
            });

            // Check if response.data exists and has orderData
            if (response.data && response.data.orderData) {
                const ordersWithAddresses = await fetchAddresses(response.data.orderData);
                setOrders(ordersWithAddresses);
            } else {
                toast.error("Invalid order data format received");
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error("Failed to load orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async (ordersData) => {
        // Check if ordersData is an array
        if (!Array.isArray(ordersData)) {
            console.error('ordersData is not an array:', ordersData);
            return [];
        }

        try {
            const updatedOrders = await Promise.all(
                ordersData.map(async (order) => {
                    try {
                        const addressResponse = await axios.get(`${BASE_URL}/order/delivery-address/${order.orderId}`, {
                            headers: { Authorization: token },
                        });

                        // Check if address response has data
                        const deliveryAddress = addressResponse.data?.DeliveryAddress || {};
                        return {
                            ...order,
                            Address: deliveryAddress,
                            formattedAddress: formatAddress(deliveryAddress) || "N/A"
                        };
                    } catch (error) {
                        console.error(`Error fetching address for order ${order.orderId}:`, error);
                        return {
                            ...order,
                            Address: {},
                            formattedAddress: "N/A"
                        };
                    }
                })
            );
            return updatedOrders;
        } catch (error) {
            console.error('Error in fetchAddresses:', error);
            return ordersData.map(order => ({
                ...order,
                Address: {},
                formattedAddress: "N/A"
            }));
        }
    };

    const formatAddress = (address) => {
        if (!address || typeof address !== 'object') return "N/A";
        return `${address.AddressLine1 || ''}, ${address.AddressLine2 || ''}, ${address.City || ''}, ${address.State || ''}, ${address.Country || ''} - ${address.PostalCode || ''}`;
    };

    const toggleRow = (orderId) => {
        setExpandedRows(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await axios.put(`${BASE_URL}/e-store/update-order-status/${orderId}`, {
                orderStatus: "cancelled",
            }, { headers: { Authorization: token } });

            toast.success("Order cancelled successfully!");
            fetchOrders(); // Refresh the data
        } catch (error) {
            toast.error("Failed to cancel order!");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'delivered':
                return <span className="badge bg-success">Delivered</span>;
            case 'cancelled':
                return <span className="badge bg-danger">Cancelled</span>;
            case 'shipped':
                return <span className="badge bg-info">Shipped</span>;
            case 'processing':
                return <span className="badge bg-primary">Processing</span>;
            default:
                return <span className="badge bg-warning">Pending</span>;
        }
    };

    const getPaymentBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="badge bg-success">Completed</span>;
            default:
                return <span className="badge bg-warning">Pending</span>;
        }
    };

    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            sortable: true,
            width: '80px',
        },
        {
            name: 'Order ID',
            cell: (row) => (
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-sm me-2"
                        onClick={() => toggleRow(row.orderId)}
                        style={{ background: 'transparent', border: 'none' }}
                    >
                        {expandedRows[row.orderId] ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    <Link to={`/order-details/${row.orderId}`}>
                        {row.orderId}
                    </Link>
                </div>
            ),
            width: '200px'
        },
        {
            name: 'Customer',
            cell: (row) => (
                <div>
                    <div className="d-flex align-items-center mb-1">
                        <FaUser className="text-primary me-2" size={12} />
                        <span>{row.userDetails?.username || 'N/A'}</span>
                    </div>
                    <div className="d-flex align-items-center mb-1">
                        <span className="me-2">Phone:</span>
                        <span>{row.userDetails?.contactNumber || 'N/A'}</span>
                    </div>
                </div>
            ),
            width: '200px'
        },
        {
            name: 'Amount',
            cell: (row) => (
                <div className="d-flex align-items-center">
                    <span className="me-2">Total:</span>
                    <span>₹{row.paymentDetails?.totalAmount || '0'}</span>
                </div>
            ),
            width: '150px'
        },
        {
            name: 'Payment',
            cell: (row) => getPaymentBadge(row.paymentDetails?.transactionStatus),
            width: '150px'
        },
        {
            name: 'Status',
            cell: (row) => getStatusBadge(row.orderStatus),
            width: '150px'
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-2">
                    <Link
                        to={`/order-details/${row.orderId}`}
                        className="p-2 text-indigo-600 hover:text-indigo-900 rounded hover:bg-indigo-100"
                        data-tooltip-id="tooltip"
                        data-tooltip-content="View"
                    >
                        <FaEye />
                    </Link>
                    {row.orderStatus !== 'cancelled' && (
                        <button
                            onClick={() => handleCancelOrder(row.orderId)}
                            className="p-2 text-red-600 hover:text-red-900 rounded hover:bg-red-100"
                            data-tooltip-id="tooltip"
                            data-tooltip-content="Cancel"
                        >
                            <MdCancel />
                        </button>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '150px',
        }
    ];

    const ExpandedRow = ({ data }) => {
        return (
            <div className="p-3 bg-light">
                <div className="row">
                    <div className="col-md-6">
                        <h6>Products</h6>
                        <ul className="list-group">
                            {data.orderDetails?.map((item, index) => (
                                <li key={index} className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>{item.productName || 'N/A'}</span>
                                        <span>₹{item.amount || '0'} x {item.quantity || '0'}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <h6>Delivery Address</h6>
                        <div className="card">
                            <div className="card-body">
                                {data.formattedAddress !== "N/A" ? (
                                    <>
                                        <p>{data.Address?.AddressLine1 || 'N/A'}</p>
                                        <p>{data.Address?.AddressLine2 || 'N/A'}</p>
                                        <p>{data.Address?.City || 'N/A'}, {data.Address?.State || 'N/A'}</p>
                                        <p>{data.Address?.Country || 'N/A'} - {data.Address?.PostalCode || 'N/A'}</p>
                                    </>
                                ) : (
                                    <p>No address available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="card">
                <div className="card-header pb-2 pt-4 card-border">
                    <div className='common-flex justify-between item-center'>
                        <h5 className="mb-3">Order List</h5>
                    </div>
                </div>
                <div className="card-body pt-5 pl-0 pr-0 pt-5">
                    <GetTable
                        columns={columns}
                        data={orders}
                        loading={loading}
                        title="All Orders"
                        noDataMessage={loading ? "Loading..." : "No orders found"}
                        expandableRows
                        expandableRowExpanded={row => expandedRows[row.orderId] || false}
                        expandableRowComponent={row => <ExpandedRow data={row} />}
                    />
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
            <ReactTooltip id="tooltip" effect="solid" />
        </>
    );
};

export default OrderList;