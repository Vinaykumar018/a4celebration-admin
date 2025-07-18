// src/services/apiService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Get order details by ID
export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}get/all/orders`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_KEY,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};


export const updateOrderStatus = async (id, updateData) => {
  try {
    const response = await axios.put(
      `${API_URL}order/update-status/${id}`,
      updateData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: API_KEY,
        },
      }
    );
    return response.data.data; // adjust depending on your actual response structure
  } catch (error) {
    throw error;
  }
};
