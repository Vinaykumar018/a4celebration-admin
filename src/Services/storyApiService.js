import axios from 'axios';

const API_BASE_URL = 'https://a4celebration.com/api/api/story';
const tokken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';
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

export const fetchStoryCategories = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/get-category`,
      getAuthHeader(),
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching story categories:', error);
    throw error;
  }
};

export const createStoryCategory = async (formData) => {
  try {
    const config = {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    };
    const response = await axios.post(
      `${API_BASE_URL}/create-category`,
      formData,
      config,
    );
    return response.data;
  } catch (error) {
    console.error('Error creating story category:', error);
    throw error;
  }
};

export const updateStoryCategory = async (id, formData) => {
  try {
    const config = {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    };
    const response = await axios.put(
      `${API_BASE_URL}/update-category/${id}`,
      formData,
      config,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating story category:', error);
    throw error;
  }
};

export const updateStory = async (id, formData) => {
  try {
    const config = {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    };

    // Convert FormData to a regular object if no file is present
    let payload = formData;
    if (!(formData instanceof FormData) && formData._parts) {
      // Check if there's actually a file to send
      const hasFile = formData._parts.some(
        ([key, value]) => value instanceof File,
      );
      if (!hasFile) {
        payload = {};
        formData._parts.forEach(([key, value]) => {
          if (!(value instanceof File)) {
            payload[key] = value;
          }
        });
      }
    }

    const response = await axios.put(
      `${API_BASE_URL}/update-story/${id}`,
      payload,
      config,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating story:', error);
    throw error;
  }
};

export const deleteStoryCategory = async (id) => {
  try {
    console.log('Deleting category with ID:', id); // 👈 check what you're passing
    const response = await axios.delete(
      `${API_BASE_URL}/delete-category/${id}`,
      getAuthHeader(),
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error deleting story category:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const fetchActiveStoryCategories = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/get-category`,
      getAuthHeader(),
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching story categories:', error);
    throw error;
  }
};

export const createStory = async (formData) => {
  try {
    const config = getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/add-story`,
      formData,
      config,
    );
    return response.data;
  } catch (error) {
    console.error('Error creating story:', error);
    throw error;
  }
};

export const fetchAllStories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-all-story`, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
};

export const deleteStory = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete-story/${id}`, {
      headers: {
        Authorization: tokken,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting story:', error);
    throw error;
  }
};

export const createSubstory = async (formData) => {
  try {
    const config = {
      ...getAuthHeader(),
      headers: {
        ...getAuthHeader().headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await axios.post(
      `${API_BASE_URL}/add-substory`,
      formData,
      config,
    );
    return response.data;
  } catch (error) {
    console.error('Error creating substory:', error);
    throw error;
  }
};

export const fetchSubstoriesByStoryId = async (storyId) => {
  try {
    const config = {
      ...getAuthHeader(),
    };
    const response = await axios.get(
      `${API_BASE_URL}/${storyId}/substory`,
      config,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching substories:', error);
    throw error;
  }
};

export const fetchStoryById = async (storyId) => {
  try {
    const config = {
      ...getAuthHeader(),
    };
    const response = await axios.get(`${API_BASE_URL}/${storyId}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching story:', error);
    throw error;
  }
};

export const fetchSubstoryById = async (storyId, substoryId) => {
  try {
    const config = getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/${storyId}/substory/${substoryId}`,
      config,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching substory:', error);
    throw error;
  }
};

export const updateSubstory = async (storyId, substoryId, formData) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await axios.put(
      `${API_BASE_URL}/${storyId}/update-substory/${substoryId}`,
      formData,
      config,
    );

    return response.data;
  } catch (error) {
    console.error(
      'Error updating substory:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
