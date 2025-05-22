
// src/services/apiService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Product API Services

/**
 * Get all products
 * Array of products
 */
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}giftings/get-all-products`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Create a new product
 * Created product data
 */
export const createProduct = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}giftings/create-product`, formData, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update an existing product

 */
export const updateProduct = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}giftings/update-product/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 
 */
export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}giftings/get-product-by-id/${productId}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Delete a product

 */
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}giftings/delete-product/${id}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
