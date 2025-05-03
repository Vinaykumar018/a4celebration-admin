import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './categoriesSlice';
import productReducer from './productSlice'

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products:productReducer
  },
});

export default store;
