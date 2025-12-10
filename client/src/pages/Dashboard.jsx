import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      const roleRoutes = {
        student: '/profile',
        faculty: '/faculty/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(roleRoutes[user.role] || '/profile', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="spinner"></div>
    </div>
  );
};

export default Dashboard;
