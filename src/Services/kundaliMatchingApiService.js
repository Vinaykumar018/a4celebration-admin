import axios from 'axios';

const API_URL = 'http://localhost:3000/api/kundali';

const getAuthHeader = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const createKundaliMatching = async (matchingData) => {
  try {
    const response = await axios.post(`${API_URL}/kundali-matching`, matchingData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating kundali matching:', error);
    throw error;
  }
};

export const getAllKundaliMatchings = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-matching`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching kundali matchings:', error);
    throw error;
  }
};

export const getKundaliMatchingById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/get-match-by/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching kundali matching:', error);
    throw error;
  }
};

export const updateKundaliMatching = async (id, matchingData) => {
  try {
    const response = await axios.put(`${API_URL}/update-matching-details/${id}`, matchingData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating kundali matching:', error);
    throw error;
  }
};

export const deleteKundaliMatching = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-matching-request/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error deleting kundali matching:', error);
    throw error;
  }
};

export const getKundaliMatchingsByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/get-matching-user/${userId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching user kundali matchings:', error);
    throw error;
  }
};