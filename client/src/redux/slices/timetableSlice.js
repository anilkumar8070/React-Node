import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchStudentTimetable = createAsyncThunk(
  'timetable/fetchStudentTimetable',
  async (studentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/timetable/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timetable');
    }
  }
);

export const fetchClassTimetable = createAsyncThunk(
  'timetable/fetchClassTimetable',
  async (classId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/timetable/class/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timetable');
    }
  }
);

export const fetchFacultyTimetable = createAsyncThunk(
  'timetable/fetchFacultyTimetable',
  async (facultyId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/timetable/faculty/${facultyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timetable');
    }
  }
);

export const createTimetableEntry = createAsyncThunk(
  'timetable/createEntry',
  async (entryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/timetable`, entryData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create timetable entry');
    }
  }
);

export const updateTimetableEntry = createAsyncThunk(
  'timetable/updateEntry',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/timetable/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update timetable entry');
    }
  }
);

export const deleteTimetableEntry = createAsyncThunk(
  'timetable/deleteEntry',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/timetable/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete timetable entry');
    }
  }
);

const timetableSlice = createSlice({
  name: 'timetable',
  initialState: {
    entries: [],
    loading: false,
    error: null,
    success: null
  },
  reducers: {
    clearTimetableError: (state) => {
      state.error = null;
    },
    clearTimetableSuccess: (state) => {
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch student timetable
      .addCase(fetchStudentTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchStudentTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch class timetable
      .addCase(fetchClassTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchClassTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch faculty timetable
      .addCase(fetchFacultyTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFacultyTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchFacultyTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create entry
      .addCase(createTimetableEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTimetableEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.push(action.payload);
        state.success = 'Timetable entry created successfully';
      })
      .addCase(createTimetableEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update entry
      .addCase(updateTimetableEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTimetableEntry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.entries.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
        state.success = 'Timetable entry updated successfully';
      })
      .addCase(updateTimetableEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete entry
      .addCase(deleteTimetableEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTimetableEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = state.entries.filter(e => e._id !== action.payload);
        state.success = 'Timetable entry deleted successfully';
      })
      .addCase(deleteTimetableEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearTimetableError, clearTimetableSuccess } = timetableSlice.actions;
export default timetableSlice.reducer;
