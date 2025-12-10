import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const initialState = {
  users: [],
  students: [],
  currentUser: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all users (Admin)
export const getUsers = createAsyncThunk(
  'users/getAll',
  async (filters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const queryString = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `${API_URL}/admin/users?${queryString}`,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get students (Faculty)
export const getStudents = createAsyncThunk(
  'users/getStudents',
  async (filters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const queryString = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `${API_URL}/faculty/students?${queryString}`,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch students';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create user (Admin)
export const createUser = createAsyncThunk(
  'users/create',
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(
        `${API_URL}/admin/users`,
        userData,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user (Admin)
export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.put(
        `${API_URL}/admin/users/${id}`,
        data,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user (Admin)
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await axios.delete(
        `${API_URL}/admin/users/${id}`,
        getAuthHeader(token)
      );
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get students
      .addCase(getStudents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload.students;
      })
      .addCase(getStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create user
      .addCase(createUser.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.users.unshift(action.payload.user);
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.users.findIndex((u) => u._id === action.payload.user._id);
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
