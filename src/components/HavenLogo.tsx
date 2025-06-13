import React from 'react';

interface HavenLogoProps {
  className?: string;
}

const HavenLogo: React.FC<HavenLogoProps> = ({ className = "h-12 w-12" }) => {
  return (
    <img 
      src="https://cdn-icons-png.flaticon.com/512/17664/17664436.png"
      alt="Haven Logo"
      className={className}
    />
  );
};

export default HavenLogo;