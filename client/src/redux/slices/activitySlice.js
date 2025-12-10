import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const initialState = {
  activities: [],
  currentActivity: null,
  stats: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
};

// Get all activities
export const getActivities = createAsyncThunk(
  'activities/getAll',
  async (filters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const queryString = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `${API_URL}/activities?${queryString}`,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch activities';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single activity
export const getActivity = createAsyncThunk(
  'activities/getOne',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get(
        `${API_URL}/activities/${id}`,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch activity';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create activity
export const createActivity = createAsyncThunk(
  'activities/create',
  async (activityData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(
        `${API_URL}/activities`,
        activityData,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create activity';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update activity
export const updateActivity = createAsyncThunk(
  'activities/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.put(
        `${API_URL}/activities/${id}`,
        data,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update activity';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete activity
export const deleteActivity = createAsyncThunk(
  'activities/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await axios.delete(
        `${API_URL}/activities/${id}`,
        getAuthHeader(token)
      );
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete activity';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Upload documents
export const uploadDocuments = createAsyncThunk(
  'activities/uploadDocs',
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(
        `${API_URL}/activities/${id}/documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload documents';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get activity stats
export const getActivityStats = createAsyncThunk(
  'activities/getStats',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get(
        `${API_URL}/activities/stats`,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch stats';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const activitySlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentActivity: (state) => {
      state.currentActivity = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all activities
      .addCase(getActivities.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActivities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.activities = action.payload.activities;
        state.stats = action.payload.stats;
        state.pagination = {
          page: action.payload.page || 1,
          pages: action.payload.pages || 1,
          total: action.payload.total || action.payload.count || 0,
        };
      })
      .addCase(getActivities.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get single activity
      .addCase(getActivity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentActivity = action.payload.activity;
      })
      .addCase(getActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create activity
      .addCase(createActivity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.activities.unshift(action.payload.activity);
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update activity
      .addCase(updateActivity.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.activities.findIndex(
          (a) => a._id === action.payload.activity._id
        );
        if (index !== -1) {
          state.activities[index] = action.payload.activity;
        }
      })
      // Delete activity
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.activities = state.activities.filter(
          (a) => a._id !== action.payload
        );
      })
      // Get stats
      .addCase(getActivityStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
      });
  },
});

export const { reset, clearCurrentActivity } = activitySlice.actions;
export default activitySlice.reducer;
