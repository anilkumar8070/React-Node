import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isError: false,
  message: '',
};

// Get notifications
export const getNotifications = createAsyncThunk(
  'notifications/getAll',
  async (filters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const queryString = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `${API_URL}/notifications?${queryString}`,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch notifications';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark as read
export const markAsRead = createAsyncThunk(
  'notifications/markRead',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.put(
        `${API_URL}/notifications/${id}/read`,
        {},
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark as read';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark all as read
export const markAllAsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await axios.put(
        `${API_URL}/notifications/read-all`,
        {},
        getAuthHeader(token)
      );
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark all as read';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await axios.delete(
        `${API_URL}/notifications/${id}`,
        getAuthHeader(token)
      );
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete notification';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n._id === action.payload.notification._id
        );
        if (notification) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => (n.isRead = true));
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n._id === action.payload);
        if (notification && !notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload
        );
      });
  },
});

export const { reset, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
