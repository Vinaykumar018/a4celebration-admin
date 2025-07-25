import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const token = import.meta.env.VITE_API_KEY;

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}user/get-user`, {
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

export const updateUserStatus = async (userId, status) => {
  try {
    if (!['active', 'inactive'].includes(status)) {
      throw new Error('Status must be either "active" or "inactive"');
    }

    const response = await axios.put(
      `${API_BASE_URL}user/update-status/${userId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw (
      error.response?.data || {
        message: 'Failed to update user status',
        status: 0,
      }
    );
  }
};

export const deleteUserById = async (userId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}user/delete-user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw (
      error.response?.data || { message: 'Failed to delete user', status: 0 }
    );
  }
};
