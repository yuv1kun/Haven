import React, { useState } from 'react';
import { Bell, Menu, User, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAlerts } from '../hooks/useAlerts';
import HavenLogo from './HavenLogo';
import { format } from 'date-fns';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const { alerts } = useAlerts();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const userEmail = user?.email || 'User';
  const initials = userEmail.charAt(0).toUpperCase();
  
  // Get unread notifications (active alerts)
  const unreadAlerts = alerts.filter(alert => alert.status === 'active').slice(0, 5);
  const hasUnread = unreadAlerts.length > 0;
  
  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="ml-2 md:ml-0 flex items-center">
                <HavenLogo className="h-8 w-8 text-primary-600" />
                <h1 className="ml-2 text-xl font-inter font-bold text-primary-900">Haven</h1>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 relative"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                  {hasUnread && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-alert-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {unreadAlerts.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-inter font-semibold text-gray-900">Notifications</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {unreadAlerts.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p>No new notifications</p>
                        </div>
                      ) : (
                        unreadAlerts.map((alert) => (
                          <div key={alert.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 mr-3 ${
                                alert.severity === 'critical' ? 'bg-alert-600' :
                                alert.severity === 'high' ? 'bg-warning-600' :
                                alert.severity === 'medium' ? 'bg-secondary-600' : 'bg-success-600'
                              }`} />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 capitalize">
                                  {alert.type} Alert - {alert.severity}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {alert.description}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {format(new Date(alert.created_at), 'MMM d, h:mm a')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {unreadAlerts.length > 0 && (
                      <div className="p-3 border-t border-gray-200">
                        <button className="w-full text-center text-sm text-primary-600 hover:text-primary-800 font-medium">
                          View All Notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="ml-3 relative flex items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white font-medium">
                    {initials}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                    {userEmail}
                  </span>
                </div>
                
                <button 
                  onClick={() => signOut()}
                  className="ml-4 text-sm text-gray-600 hover:text-primary-700 font-medium"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay for mobile notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </>
  );
};

export default Header;