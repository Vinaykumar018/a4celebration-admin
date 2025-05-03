// src/features/categories/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById
} from '.././Services/category-api-service';

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createCategory(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const modifyCategory = createAsyncThunk(
  'categories/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await updateCategory(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeCategory = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteCategory(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchOne',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await getCategoryById(categoryId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
  success: false,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.success = false;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create category
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
        state.success = true;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update category
      .addCase(modifyCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(modifyCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          category => category._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(modifyCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete category
      .addCase(removeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          category => category._id !== action.payload.id
        );
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single category
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentCategory = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatus, clearCurrentCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;