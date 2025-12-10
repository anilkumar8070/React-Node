import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { logout } from '../redux/slices/authSlice';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
              >
                {sidebarOpen ? <X /> : <Menu />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-md flex items-center justify-center text-white font-bold">
                  SAP
                </div>
                <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
                  Student Activity Platform
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 hover:bg-gray-100 rounded-full transition"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
