import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/pandit';
const POOJA_BASE_URL = 'http://localhost:3000/api/pooja';
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';

const fetchPandits = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all-pandit`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pandits');
    }
  },

  getCategories: async (panditId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-category/${panditId}`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: [] };
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete-pandit/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete pandit');
    }
  },

  updateCategory: async (data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/update-category`, data, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  },
};

const fetchPoojas = {
  getAll: async () => {
    try {
      const response = await axios.get(`${POOJA_BASE_URL}/all-pooja`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch poojas');
    }
  },
};


export { fetchPandits, fetchPoojas };
export const getPanditByID =async(id)=>{


  try {
    const response = await axios.get(`${API_BASE_URL}/get-pandit/${id}`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    console.log(response)
    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error.response ? error.response.data : error.message);
  }
}