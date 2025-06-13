import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Map, 
  FileText, 
  Package, 
  Settings, 
  X
} from 'lucide-react';
import HavenLogo from './HavenLogo';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavItem {
  name: string;
  to: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const navigation: NavItem[] = [
    { name: 'Dashboard', to: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Monitoring', to: '/monitoring', icon: <Map className="w-5 h-5" /> },
    { name: 'Analytics', to: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Resources', to: '/resources', icon: <Package className="w-5 h-5" /> },
    { name: 'Reports', to: '/reports', icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-primary-900 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 bg-primary-800 flex items-center justify-between px-4">
            <div className="flex items-center">
              <HavenLogo className="h-7 w-7 text-white" />
              <span className="ml-2 text-xl font-inter font-bold text-white">Haven</span>
            </div>
            <button
              className="md:hidden text-white hover:text-gray-200"
              onClick={() => setOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-800 text-white'
                        : 'text-gray-300 hover:bg-primary-800 hover:text-white'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-primary-800">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center w-full px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-800 text-white'
                    : 'text-gray-300 hover:bg-primary-800 hover:text-white'
                }`
              }
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;