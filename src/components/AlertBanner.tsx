import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

// In a real app, this would come from your alert system
const MOCK_ALERTS = [
  { id: 1, type: 'critical', message: 'Earthquake warning: 4.5 magnitude detected near Central District' },
  { id: 2, type: 'warning', message: 'Flood alert: Water levels rising in Eastern Region' },
  { id: 3, type: 'info', message: 'System test: Ignore this notification' },
];

const AlertBanner: React.FC = () => {
  const [currentAlert, setCurrentAlert] = useState<typeof MOCK_ALERTS[0] | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Simulate receiving new alerts
    const randomIndex = Math.floor(Math.random() * MOCK_ALERTS.length);
    setCurrentAlert(MOCK_ALERTS[randomIndex]);
    setVisible(true);

    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!currentAlert || !visible) return null;

  return (
    <div className={`alert-banner ${currentAlert.type} slide-down`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{currentAlert.message}</span>
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;