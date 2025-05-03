import axios from "axios";

const BASE_URL = `http://localhost:3000/api/user`;
const TOKEN = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const fetchUsers = {
    getAll: async () => {
        try {
          const response = await api.get('/all-user');
          if (response.data.status !== 1) {
            throw new Error(response.data.message || 'Failed to fetch users');
          }
          return response.data.data; // Make sure this matches your API response structure
        } catch (error) {
          throw new Error(error.response?.data?.message || error.message || 'Failed to fetch users');
        }
      },
      updateStatus: async (userId, status) => {
        try {
          const response = await api.put('/update-status', { userId, status });
          return response.data;
        } catch (error) {
          throw new Error(error.response?.data?.message || error.message || 'Failed to update status');
        }
      },
  create: async (userData) => {
    try {
      const response = await api.post('/create-user', userData);
      if (response.data.status !== 1) {
        throw new Error(response.data.message || 'Failed to create user');
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to create user');
    }
  },
  update: async (userId, userData) => {
    try {
      const response = await api.put(`/update-user/${userId}`, userData);
      if (response.data.status !== 1) {
        throw new Error(response.data.message || 'Failed to update user');
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update user');
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      if (response.data.status !== 1) {
        throw new Error(response.data.message || 'Failed to fetch user');
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user');
    }
  }
};

export const getUserByID =async(id)=>{


  try {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8",
        "Content-Type": "application/json",
      },
    });

    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error.response ? error.response.data : error.message);
  }
}
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/create-user`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        // Remove the Content-Type header for FormData
      },
      body: userData, // Send FormData directly
    });

    const data = await response.json();

    if (data.status !== 1) {
      throw new Error(data.message || 'Failed to create user');
    }
    return data; // Return created user data if successful
  } catch (error) {
    throw new Error(error.message || 'Something went wrong');
  }
};
export const updateUser = async (userId, userData) => {
  console.log(userId,userData)
  try {
    const response = await fetch(`${BASE_URL}/update-user/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        // Remove the Content-Type header for FormData
      },
      body: userData, // Send FormData directly
    });

    const data = await response.json();

    if (data.status !== 1) {
      throw new Error(data.message || 'Failed to update user');
    }
    return data; // Return updated user data if successful
  } catch (error) {
    throw new Error(error.message || 'Something went wrong');
  }
};