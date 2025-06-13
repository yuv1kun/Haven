import React, { useState } from 'react';
import MapView from '../components/MapView';
import { AlertTriangle, Search, Filter, Droplets, Flame, RefreshCw } from 'lucide-react';

interface Sensor {
  id: string;
  name: string;
  type: 'earthquake' | 'flood' | 'fire';
  status: 'active' | 'inactive' | 'maintenance';
  lastReading: string;
  batteryLevel: number;
  location: string;
}

const Monitoring: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Mock sensor data
  const allSensors: Sensor[] = [
    // Earthquake sensors
    {
      id: 'EQ-001',
      name: 'SW-420-N1',
      type: 'earthquake',
      status: 'active',
      lastReading: '243',
      batteryLevel: 92,
      location: 'Central District'
    },
    {
      id: 'EQ-002',
      name: 'SW-420-W4',
      type: 'earthquake',
      status: 'inactive',
      lastReading: 'N/A',
      batteryLevel: 0,
      location: 'Western Heights'
    },
    {
      id: 'EQ-003',
      name: 'SW-420-E7',
      type: 'earthquake',
      status: 'active',
      lastReading: '156',
      batteryLevel: 78,
      location: 'Eastern District'
    },
    {
      id: 'EQ-004',
      name: 'SW-420-S2',
      type: 'earthquake',
      status: 'maintenance',
      lastReading: '189',
      batteryLevel: 65,
      location: 'Southern Area'
    },
    // Flood sensors
    {
      id: 'FL-001',
      name: 'HC-SR04-E2',
      type: 'flood',
      status: 'active',
      lastReading: '2.3 cm',
      batteryLevel: 87,
      location: 'Eastern River'
    },
    {
      id: 'FL-002',
      name: 'HC-SR04-N5',
      type: 'flood',
      status: 'active',
      lastReading: '0.8 cm',
      batteryLevel: 98,
      location: 'Northern Canal'
    },
    {
      id: 'FL-003',
      name: 'HC-SR04-W3',
      type: 'flood',
      status: 'active',
      lastReading: '4.1 cm',
      batteryLevel: 73,
      location: 'Western Dam'
    },
    {
      id: 'FL-004',
      name: 'HC-SR04-S6',
      type: 'flood',
      status: 'maintenance',
      lastReading: '1.5 cm',
      batteryLevel: 45,
      location: 'Southern Reservoir'
    },
    // Fire sensors
    {
      id: 'FR-001',
      name: 'IR-FLAME-S3',
      type: 'fire',
      status: 'active',
      lastReading: '720',
      batteryLevel: 45,
      location: 'Forest Area South'
    },
    {
      id: 'FR-002',
      name: 'IR-FLAME-N8',
      type: 'fire',
      status: 'active',
      lastReading: '425',
      batteryLevel: 89,
      location: 'Industrial Zone North'
    },
    {
      id: 'FR-003',
      name: 'IR-FLAME-E4',
      type: 'fire',
      status: 'inactive',
      lastReading: 'N/A',
      batteryLevel: 0,
      location: 'Residential East'
    },
    {
      id: 'FR-004',
      name: 'IR-FLAME-W9',
      type: 'fire',
      status: 'active',
      lastReading: '312',
      batteryLevel: 67,
      location: 'Commercial West'
    }
  ];

  // Filter sensors based on active filter
  const filteredSensors = activeFilter === 'all' 
    ? allSensors 
    : allSensors.filter(sensor => sensor.type === activeFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'earthquake':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'flood':
        return <Droplets className="h-5 w-5 text-blue-600" />;
      case 'fire':
        return <Flame className="h-5 w-5 text-orange-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Monitoring</h1>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${
              activeFilter === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            <span>All</span>
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${
              activeFilter === 'earthquake' 
                ? 'bg-alert-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setActiveFilter('earthquake')}
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>Earthquakes</span>
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${
              activeFilter === 'flood' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setActiveFilter('flood')}
          >
            <Droplets className="w-4 h-4 mr-1" />
            <span>Floods</span>
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${
              activeFilter === 'fire' 
                ? 'bg-orange-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setActiveFilter('fire')}
          >
            <Flame className="w-4 h-4 mr-1" />
            <span>Fires</span>
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 card p-4">
          <div className="mb-4 flex justify-between items-center">
            <div className="relative flex-1 max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10"
                placeholder="Search locations..."
              />
            </div>
            <div className="flex items-center ml-2">
              <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <Filter className="h-5 w-5" />
              </button>
              <button className="p-2 ml-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 animate-spin-slow">
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
          <MapView height="600px" />
        </div>
        
        <div className="md:w-80 card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-inter font-bold text-lg text-gray-900">
              Sensor Status 
              {activeFilter !== 'all' && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({activeFilter} sensors)
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredSensors.length} of {allSensors.length} sensors
            </p>
          </div>
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {filteredSensors.map((sensor) => (
              <div key={sensor.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {getSensorIcon(sensor.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{sensor.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{sensor.type} Sensor</p>
                      <p className="text-xs text-gray-400">{sensor.location}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sensor.status)}`}>
                    {sensor.status}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Last Reading:</span>
                    <span className="ml-1 font-medium">{sensor.lastReading}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Battery:</span>
                    <span className={`ml-1 font-medium ${
                      sensor.batteryLevel > 70 ? 'text-green-600' :
                      sensor.batteryLevel > 30 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {sensor.batteryLevel}%
                    </span>
                  </div>
                </div>
                {sensor.batteryLevel > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          sensor.batteryLevel > 70 ? 'bg-green-500' :
                          sensor.batteryLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${sensor.batteryLevel}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;