import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/setting';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8'
  }
});

// Pandit Range API
export const getPanditRange = () => api.get('/pandit-range');
export const updatePanditRange = (data) => api.put('/update-range', data);
export const createPanditRange = (data) => api.post('/create-range', data);

// Commission API
export const getCommission = () => api.get('/commission');
export const updateCommission = (data) => api.put('/update-commission', data);
export const createCommission = (data) => api.post('/create-commission', data);

export default api;