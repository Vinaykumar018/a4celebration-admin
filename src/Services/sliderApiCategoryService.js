import axios from 'axios';

// const apiUrl = "https://parampara-admin.vercel.app/api/slider";
// const apiUrl = `${import.meta.env.VITE_BASE_URL}/slider`;
const apiUrl = 'http://localhost:3000/api/slider';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
};

// Fetch all categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${apiUrl}/all-category`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Create a new category
export const createCategory = async (formData) => {
  try {
    const response = await axios.post(`${apiUrl}/create-category`, formData, {
      headers: { ...headers, 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const UpdateSliderCategory = async (id, updatedData) => {
  try {
    const response = await axios.put(
      `${apiUrl}/category/update-category/${id}`,
      updatedData,
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error; // Rethrow the error to handle it in the calling component
  }
};
