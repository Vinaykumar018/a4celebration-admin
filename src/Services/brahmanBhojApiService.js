import axios from 'axios';

const BASE_URL = `http://localhost:3000/api/`;
const token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';

export const fetchBhojRequests = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/brahman-bhoj/get-bhoj-request`,
      { headers: { Authorization: token } },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching bhoj requests:', error);
    throw error;
  }
};

export const cancelBhojRequest = async (id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/brahman-bhoj/cancel-request/${id}`,
      {},
      { headers: { Authorization: token } },
    );
    return response.data;
  } catch (error) {
    console.error('Error cancelling bhoj request:', error);
    throw error;
  }
};

export const requestPandit = async () => {};
