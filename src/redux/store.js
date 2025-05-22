import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './categoriesSlice';
import productReducer from './decorationSlice'
import giftingReducer from './giftingsSlice'

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products:productReducer
  },
});

export default store;
