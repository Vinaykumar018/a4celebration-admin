import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const couponService = {
  getAllCoupons: async () => {
    try {
      const response = await axios.get(`${API_URL}/get/allcoupons`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_KEY,
      }});
      return response.data;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  },

  createCoupon: async (couponData) => {
    try {
      const response = await axios.post(`${API_URL}/create/coupon`, couponData);
      return response.data;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  },

  applyCoupon: async (couponCode) => {
    try {
      const response = await axios.post(`${API_URL}/apply/coupon`, { code: couponCode });
      return response.data;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  }
};