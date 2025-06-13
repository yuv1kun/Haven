import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import NewReportModal from './NewReportModal';

const EmergencyFAB: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        className="emergency-fab"
        onClick={() => setIsModalOpen(true)}
        aria-label="Report Emergency"
      >
        <AlertTriangle className="h-6 w-6" />
      </button>
      
      <NewReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default EmergencyFAB;