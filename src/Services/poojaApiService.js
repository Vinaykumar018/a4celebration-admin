import axios from 'axios';

const BASE_URL = `http://localhost:3000/api/pooja`; // 🔧 Fixed `http/` to `http://`
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';

export const fetchPoojaData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/all-pooja`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching pooja data:", error);
      throw error;
    }
  };
  
  export const deletePooja = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete-pooja/${id}`, {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting pooja:', error);
      throw error;
    }
  };


  export const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/category`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };
  
  export const createCategory = async (data) => {
    try {
      console.log(`${BASE_URL}/create-category`)
      const response = await axios.post(`${BASE_URL}/create-category`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: AUTH_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };
  
  
  export const deletePoojaCategory = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/category/delete/${id}`, {
  
        
        headers: {
          Authorization: AUTH_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting Pooja:', error);
      throw error;
    }
  };
  
  
  
  export const UpdatePoojaCategory = async (id, updatedData) => {
    console.log(id,updatedData)
    try {
      const response = await axios.put(`${BASE_URL}/category/update-category/${id}`, updatedData, {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      });
      return response.data; // Return the response data for further use
    } catch (error) {
      console.error('Error updating Pooja:', error);
      throw error; // Rethrow the error to handle it in the calling component
    }
  };

  export const updatePoojaCategoryStatus = async (poojacategoryId, newStatus) => {
    try {
      const response = await axios.put(BASE_URL+'/category/update-status',
        { poojacategoryId, newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const fetchPoojaBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/orders`, {
        headers: { Authorization: AUTH_TOKEN },
      });
      const ordersWithAddresses = await fetchAddresses(response.data);
      return { status: 1, data: ordersWithAddresses };
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { status: 0, message: 'Error fetching orders' };
    }
  };
  
  const fetchAddresses = async (ordersData) => {
    const updatedOrders = await Promise.all(
      ordersData.map(async (order) => {
        try {
          const addressResponse = await axios.get(`http://localhost:3000/api/order/delivery-address/${order.bookingId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: AUTH_TOKEN
            },
          });
          return { 
            ...order, 
            Address: formatAddress(addressResponse.data.DeliveryAddress) || "N/A" 
          };
        } catch (error) {
          console.error(`Error fetching address for Booking ID: ${order.bookingId}`, error);
          return { ...order, Address: "N/A" };
        }
      })
    );
    return updatedOrders;
  };
  
  const formatAddress = (address) => {
    if (!address) return "N/A";
    return `${address.AddressLine1 || ''}, ${address.AddressLine2 || ''}, ${address.Location || ''}, ${address.Landmark ? address.Landmark + ', ' : ''}${address.City || ''}, ${address.State || ''}, ${address.Country || ''} - ${address.PostalCode || ''}`;
  };
  
  export const cancelPoojaBooking = async (bookingId) => {
    try {
      // Replace with your actual cancel endpoint
      const response = await axios.put(`http://localhost:3000/api/order/cancel/${bookingId}`, {}, {
        headers: { Authorization: AUTH_TOKEN },
      });
      return { status: 1, data: response.data };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return { status: 0, message: 'Error cancelling booking' };
    }
  };  
  export const createPooja = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/create-pooja`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: AUTH_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating Pooja:', error);
      throw error;
    }
  };
  
  export const updatePooja = async (id, data) => {
    try {
      const response = await axios.put(`${BASE_URL}/update-pooja/${id}`, data, {
        headers: {
          Authorization: AUTH_TOKEN,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating Pooja:', error);
      throw error;
    }
  };

  export const fetchPoojaById = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/pooja/${id}`, {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching pooja by slug (${slug}):`, error);
      throw error;
    }
  };

  export const fetchPoojaSamagriById = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/samagri/${id}`, {
        headers: {
          'Authorization': AUTH_TOKEN
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching pooja samagri:', error);
      throw error;
    }
  };