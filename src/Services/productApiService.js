import axios from 'axios';

const BASE_URL = `http://localhost:3000/api/product`;
const AUTH_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';

export const createCategory = async (data) => {
  try {
    console.log('Submitting Data:', data);
    const response = await axios.post(`${BASE_URL}/category`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: AUTH_TOKEN,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      'Error creating category:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTH_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const updateCategory = async (id, updatedData) => {
  console.log('Updating Category:', id, updatedData);
  try {
    const response = await axios.put(
      `${BASE_URL}/update-category/${id}`,
      updatedData,
      {
        headers: {
          Authorization: AUTH_TOKEN,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error.response?.data || error);
    throw error;
  }
};

export const getProductCategoryById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/category/${id}`, {
      headers: {
        Authorization: AUTH_TOKEN, // Corrected token format
        'Content-Type': 'application/json', // Explicitly setting content type
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching Bhajan by ID:',
      error.response?.data || error,
    );
    throw error;
  }
};

export const deleteProductCategory = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete-category/${id}`, {
      headers: {
        Authorization: AUTH_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting Category:', error);
    throw error;
  }
};

export const UpdateProductCategoryStatus = async (id) => {
  try {
    const response = axios.patch(
      `${BASE_URL}product/category/update-status/${id}`,
      {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating Status:', error);
    throw error;
  }
};

export const createProduct = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/add-product`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: AUTH_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const fetchProduct = async () => {
  try {
    const response = await fetch(`${BASE_URL}/get-all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTH_TOKEN,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json(); // Ensure parsing works
    console.log('API Response:', data); // Debugging
    return data; // Return the parsed JSON
  } catch (error) {
    console.error('Error fetching Product:', error);
    return null; // Prevent undefined errors
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
      headers: {
        Authorization: AUTH_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting Product:', error);
    throw error;
  }
};

export const updateFeaturedStatus = async (id, updatedData) => {
  console.log('Updating Product:', id, updatedData);
  try {
    const response = await axios.put(
      `${BASE_URL}/${id}/featured`,
      updatedData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_TOKEN,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error.response?.data || error);
    throw error;
  }
};

export const updateStatus = async (id, updatedData) => {
  console.log('Updating Product:', id, updatedData);
  try {
    const response = await axios.patch(
      `${BASE_URL}/update-status/${id}`,
      updatedData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_TOKEN,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error.response?.data || error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-product/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTH_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching product by ID:',
      error.response?.data || error,
    );
    throw error;
  }
};

export const updateProduct = async (id, updatedData) => {
  console.log('Updating Product:', id, updatedData);
  try {
    const response = await axios.put(
      `${BASE_URL}/update-product/${id}`,
      updatedData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: AUTH_TOKEN,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error.response?.data || error);
    throw error;
  }
};

export const updateProductCategoryStatus = async (id, status) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/api/product/category/update-status/${id}`,
      { status }, // sending the status in request body
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_TOKEN,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error updating category status:',
      error.response?.data || error,
    );
    throw error;
  }
};
