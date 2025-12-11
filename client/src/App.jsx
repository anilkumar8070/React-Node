import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMe } from './redux/slices/authSlice';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import StudentProfile from './pages/student/StudentProfile';
import AddActivity from './pages/student/AddActivity';
import ActivityList from './pages/student/ActivityList';
import ActivityDetail from './pages/student/ActivityDetail';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyReview from './pages/faculty/FacultyReview';
import StudentsList from './pages/faculty/StudentsList';
import ClassDetailPage from './pages/faculty/ClassDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage from './pages/ReportsPage';

// Components
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [token, dispatch]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/profile"
          element={
            <RoleRoute roles={['student']}>
              <StudentProfile />
            </RoleRoute>
          }
        />
        <Route
          path="/activities/add"
          element={
            <RoleRoute roles={['student']}>
              <AddActivity />
            </RoleRoute>
          }
        />
        <Route
          path="/activities"
          element={
            <RoleRoute roles={['student']}>
              <ActivityList />
            </RoleRoute>
          }
        />
        <Route
          path="/activities/:id"
          element={
            <RoleRoute roles={['student']}>
              <ActivityDetail />
            </RoleRoute>
          }
        />

        {/* Faculty Routes */}
        <Route
          path="/faculty/dashboard"
          element={
            <RoleRoute roles={['faculty']}>
              <FacultyDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/faculty/review"
          element={
            <RoleRoute roles={['faculty']}>
              <FacultyReview />
            </RoleRoute>
          }
        />
        <Route
          path="/faculty/students"
          element={
            <RoleRoute roles={['faculty']}>
              <StudentsList />
            </RoleRoute>
          }
        />
        <Route
          path="/faculty/class/:id"
          element={
            <RoleRoute roles={['faculty']}>
              <ClassDetailPage />
            </RoleRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute roles={['admin']}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute roles={['admin']}>
              <UserManagement />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/departments"
          element={
            <RoleRoute roles={['admin']}>
              <DepartmentManagement />
            </RoleRoute>
          }
        />

        {/* Common Protected Routes */}
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <ReportsPage />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
