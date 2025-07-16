'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  Settings, 
  FileText,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}

const AdminNavigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home size={20} />,
      href: '/admin',
      active: activeItem === 'dashboard'
    },
    {
      id: 'teams',
      label: 'Teams',
      icon: <Users size={20} />,
      href: '/admin/teams',
      active: activeItem === 'teams'
    },
    {
      id: 'challenges',
      label: 'Challenges',
      icon: <Trophy size={20} />,
      href: '/admin/challenges',
      active: activeItem === 'challenges'
    },
    {
      id: 'submissions',
      label: 'Submissions',
      icon: <FileText size={20} />,
      href: '/admin/submissions',
      active: activeItem === 'submissions'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 size={20} />,
      href: '/admin/analytics',
      active: activeItem === 'analytics'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      href: '/admin/settings',
      active: activeItem === 'settings'
    }
  ];

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold">OASIS Control</h2>
              <p className="text-sm text-gray-400">Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-amber-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed && (
          <div className="text-xs text-gray-400">
            <p>OASIS Protocol v1.0</p>
            <p>Admin Dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavigation;
