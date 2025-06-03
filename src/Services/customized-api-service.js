import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Get all customized requests
export const getCustomizedRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}customized/get-all-requests`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_KEY,
      },
    });
    return response.data.data; // adjust depending on your actual response structure
  } catch (error) {
    throw error;
  }
};


export const updateRequestStatus = async (id, updateData) => {
  try {
    const response = await axios.put(
      `${API_URL}customized/update-request-status/${id}`,
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