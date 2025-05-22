// src/features/products/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from '../Services/gift-api-service';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const addProduct = createAsyncThunk(
  'products/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createProduct(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const modifyProduct = createAsyncThunk(
  'products/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await updateProduct(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const removeProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteProduct(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchProductById = createAsyncThunk(
  'products/fetchOne',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getProductById(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  success: false,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductStatus: (state) => {
      state.error = null;
      state.success = false;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    // Optional: Add sorting/filtering reducers if needed
    sortProducts: (state, action) => {
      const { field, order } = action.payload;
      state.products.sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.success = true;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update product
      .addCase(modifyProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(modifyProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(modifyProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete product
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload.id,
        );
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductStatus, clearCurrentProduct, sortProducts } =
  productsSlice.actions;

export default productsSlice.reducer;
