import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';
const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8'
  }
});

export const fetchCommission = async () => {
  try {
    const response = await api.get('/setting/commission');
    return response.data;
  } catch (error) {
    console.error('Error fetching commission:', error);
    throw error;
  }
};

export const updateCommission = async (data, isUpdate) => {
  try {
    const url = isUpdate ? '/update-commission' : '/setting/commission';
    const method = isUpdate ? 'put' : 'post';
    const response = await api[method](url, data);
    return response.data;
  } catch (error) {
    console.error('Error updating commission:', error);
    throw error;
  }
};

export const getPanditRange = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/setting/pandit-range`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching pandit range:', error);
    throw error;
  }
};

export const createPanditRange = async (range) => {
  try {
    const response = await fetch(`${API_BASE_URL}/setting/create-range`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ range })
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating pandit range:', error);
    throw error;
  }
};

export const updatePanditRange = async (rangeId, range) => {
  try {
    const response = await fetch(`${API_BASE_URL}/setting/update-range`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rangeId, range })
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating pandit range:', error);
    throw error;
  }
};