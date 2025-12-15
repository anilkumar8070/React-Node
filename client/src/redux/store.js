import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import activityReducer from './slices/activitySlice';
import userReducer from './slices/userSlice';
import notificationReducer from './slices/notificationSlice';
import departmentReducer from './slices/departmentSlice';
import timetableReducer from './slices/timetableSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    activities: activityReducer,
    users: userReducer,
    notifications: notificationReducer,
    departments: departmentReducer,
    timetable: timetableReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
