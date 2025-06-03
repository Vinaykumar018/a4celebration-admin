import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './categoriesSlice';
import productReducer from './decorationSlice'
import giftingReducer from './giftingsSlice'
import eventReducer from './eventSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products:productReducer,
    events: eventReducer,
  },
});

export default store;
