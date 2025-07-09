import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';
const token = import.meta.env.VITE_API_KEY; // Change this to your actual backend URL

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/get-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error.response?.data || { message: 'Unknown error', status: 0 };
  }
};
