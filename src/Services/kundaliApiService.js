import axios from 'axios';

const API_URL = 'http://localhost:3000/api/kundali';

const getAuthHeader = () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const getAllKundalis = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching kundalis:', error);
    throw error;
  }
};

export const getKundaliById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/get-kundali/${id}`,
      getAuthHeader(),
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching kundali:', error);
    throw error;
  }
};

export const createKundali = async (kundaliData) => {
  try {
    const response = await axios.post(
      `${API_URL}/create-kundali`,
      kundaliData,
      getAuthHeader(),
    );
    return response.data;
  } catch (error) {
    console.error('Error creating kundali:', error);
    throw error;
  }
};

export const updateKundali = async (id, kundaliData) => {
  try {
    const response = await axios.put(
      `${API_URL}/update-kundali/${id}`,
      kundaliData,
      getAuthHeader(),
    );
    return response.data;
  } catch (error) {
    console.error('Error updating kundali:', error);
    throw error;
  }
};

export const cancelKundaliRequest = async (id) => {
  try {
    const response = await axios.put(
      `${API_URL}/cancel-request/${id}`,
      { status: 0 },
      getAuthHeader(),
    );
    return response.data;
  } catch (error) {
    console.error('Error canceling kundali request:', error);
    throw error;
  }
};

export const deleteKundali = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/delete/${id}`,
      getAuthHeader(),
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting kundali:', error);
    throw error;
  }
};

export const getKundalisByUser = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/get-kundalis-user/${userId}`,
      getAuthHeader(),
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user kundalis:', error);
    throw error;
  }
};

export const updateKundaliTransaction = async (id, transactionData) => {
  try {
    const response = await axios.put(
      `${API_URL}/update-transcation/${id}`,
      transactionData,
      getAuthHeader(),
    );
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};
