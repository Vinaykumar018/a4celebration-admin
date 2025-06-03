// src/features/events/eventSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
} from '../Services/events-management-api-service'

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllEvents();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addEvent = createAsyncThunk(
  'events/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createEvent(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const modifyEvent = createAsyncThunk(
  'events/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await updateEvent(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeEvent = createAsyncThunk(
  'events/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteEvent(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchOne',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await getEventById(eventId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
  success: false,
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    resetEventStatus: (state) => {
      state.error = null;
      state.success = false;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    sortEvents: (state, action) => {
      const { field, order } = action.payload;
      state.events.sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create event
      .addCase(addEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
        state.success = true;
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update event
      .addCase(modifyEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(modifyEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(
          (event) => event._id === action.payload._id
        );
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(modifyEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete event
      .addCase(removeEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(
          (event) => event._id !== action.payload.id
        );
      })
      .addCase(removeEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single event
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentEvent = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  resetEventStatus, 
  clearCurrentEvent, 
  sortEvents 
} = eventSlice.actions;

export default eventSlice.reducer;