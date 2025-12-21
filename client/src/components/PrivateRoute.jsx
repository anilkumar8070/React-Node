import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check account status only for students (admin and faculty are always approved)
    if (user && user.role === 'student') {
      const accountStatus = user.accountStatus || 'pending';
      if (accountStatus !== 'approved') {
        const statusMessages = {
          pending: 'Your account is pending approval. Please wait for admin approval.',
          rejected: 'Your account has been rejected. Please contact the administrator.'
        };
        toast.error(statusMessages[accountStatus] || 'Access denied');
        dispatch(logout());
      }
    }
  }, [user, dispatch]);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Double-check account status before allowing access (only for students)
  if (user.role === 'student') {
    const accountStatus = user.accountStatus || 'pending';
    if (accountStatus !== 'approved') {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
