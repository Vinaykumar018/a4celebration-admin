// src/services/apiService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}category/get-all-categories`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};




// Create a new category
export const createCategory = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}category/create-category`, formData, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Update an existing category
export const updateCategory = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}category/update-category/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};


export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}category/delete-category/${id}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};






export const getCategoryById = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}category/get-category/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};