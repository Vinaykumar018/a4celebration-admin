import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/paramarsha';

const CategoryService = {
  getAllCategories: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getCategory: async (id, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  createCategory: async (formData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (id, formData, token) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  updateStatus: async (id, status, token) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  },
  getAllParamarshRequests: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/request/all`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch requests');
    }
  },
  deleteCategory: async (id, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};

export default CategoryService;
