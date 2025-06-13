import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  const getChangeColor = () => {
    if (!change) return 'text-gray-500';
    return change > 0 ? 'text-alert-600' : 'text-success-600';
  };

  const getChangeIcon = () => {
    if (!change) return <Minus className="h-4 w-4" />;
    return change > 0 ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );
  };

  return (
    <div className="card p-6 h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded-md ${color}`}>
          {icon}
        </div>
      </div>
      
      {change !== undefined && (
        <div className="mt-4 flex items-center">
          <span className={`mr-1 ${getChangeColor()}`}>
            {getChangeIcon()}
          </span>
          <span className={`text-sm ${getChangeColor()}`}>
            {Math.abs(change)}% {change > 0 ? 'increase' : 'decrease'}
          </span>
          <span className="text-sm text-gray-500 ml-1">from last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;