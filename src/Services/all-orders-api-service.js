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


export const getServiceOrdersData = async () => {
  try {
    const response = await axios.get(`${API_URL}get/all/orders`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_KEY,
      },
    });
    
    // Filter out orders that contain gift products (PROD-GIFT)
    const serviceOrders = response.data.data.filter(order => {
      // Check if any product in the order starts with PROD-GIFT
      const hasGiftProduct = order.productDetails?.some(product => 
        product.productId?.startsWith('PROD-GIFT')
      );
      return !hasGiftProduct; // Keep only non-gift orders
    });
    
    return serviceOrders;
  } catch (error) {
    throw error;
  }
};

// Get order details by ID
export const getEcommerceOrdersData = async () => {
   try {
    const response = await axios.get(`${API_URL}get/all/orders`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_KEY,
      },
    });
    
    // Filter out orders that contain gift products (PROD-GIFT)
    const serviceOrders = response.data.data.filter(order => {
      // Check if any product in the order starts with PROD-GIFT
      const hasGiftProduct = order.productDetails?.some(product => 
        product.productId?.startsWith('PROD-GIFT')
      );
      return hasGiftProduct; // Keep only non-gift orders
    });
    
    return serviceOrders;
  } catch (error) {
    throw error;
  }
};
