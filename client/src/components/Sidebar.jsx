import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Home,
  User,
  FileText,
  Award,
  CheckCircle,
  BarChart3,
  Settings,
  Users,
  Building2,
  Activity,
  BookOpen,
  PlusCircle,
  UserCheck,
  GraduationCap,
  Calendar,
  Clock,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);

  const studentLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/activities', icon: FileText, label: 'My Activities' },
    { to: '/activities/add', icon: PlusCircle, label: 'Add Activity' },
    { to: '/timetable', icon: Clock, label: 'Timetable' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
    { to: '/notifications', icon: Award, label: 'Notifications' },
  ];

  const facultyLinks = [
    { to: '/faculty/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/faculty/students', icon: Users, label: 'Students' },
    { to: '/faculty/review', icon: CheckCircle, label: 'Review Activities' },
    { to: '/faculty/messages', icon: Award, label: 'Class Messages' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'User Management' },
    { to: '/admin/faculty', icon: UserCheck, label: 'Faculty Management' },
    { to: '/admin/students', icon: GraduationCap, label: 'Student Management' },
    { to: '/admin/meetings', icon: Calendar, label: 'Meetings' },
    { to: '/admin/departments', icon: Building2, label: 'Departments' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
    { to: '/notifications', icon: Award, label: 'Notifications' },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'student':
        return studentLinks;
      case 'faculty':
        return facultyLinks;
      case 'admin':
        return adminLinks;
      default:
        return studentLinks;
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <nav className="p-4 space-y-2 overflow-y-auto h-full">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
