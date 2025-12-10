import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const initialState = {
  departments: [],
  currentDepartment: null,
  isLoading: false,
  isError: false,
  message: '',
};

// Get all departments
export const getDepartments = createAsyncThunk(
  'departments/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/departments`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch departments';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDepartments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments = action.payload.departments;
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = departmentSlice.actions;
export default departmentSlice.reducer;
