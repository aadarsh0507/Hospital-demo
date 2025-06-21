import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Calendar,
  UserCheck,
  Stethoscope,
  Pill,
  CreditCard,
  FileText,
  Home
} from 'lucide-react';

interface SidebarItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  permission?: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();

  const sidebarItems: SidebarItem[] = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <Home size={20} />
    },
    {
      path: '/patient-entry',
      label: 'Patient Entry',
      icon: <Users size={20} />,
      permission: 'patient_management'
    },
    {
      path: '/appointments',
      label: 'Appointments',
      icon: <Calendar size={20} />,
      permission: 'appointments'
    },
    {
      path: '/doctor-visit',
      label: 'Doctor Visit',
      icon: <UserCheck size={20} />,
      permission: 'consultation'
    },
    {
      path: '/consultation',
      label: 'Consultation',
      icon: <Stethoscope size={20} />,
      permission: 'consultation'
    },
    {
      path: '/pharmacy',
      label: 'Pharmacy',
      icon: <Pill size={20} />,
      permission: 'pharmacy'
    },
    {
      path: '/checkout',
      label: 'Checkout',
      icon: <CreditCard size={20} />,
      permission: 'billing'
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: <FileText size={20} />,
      permission: 'reports'
    }
  ];

  const filteredItems = sidebarItems.filter(item => 
    !item.permission || hasPermission(item.permission) || hasPermission('all')
  );

  return (
    <aside className="bg-white shadow-md border-r border-gray-200 w-64 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <span className={isActive ? 'text-blue-700' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;