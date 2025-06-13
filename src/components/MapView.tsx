import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl, LayerGroup, Legend } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, DivIcon } from 'leaflet';
import { AlertTriangle, Droplets, Flame, Wifi, Thermometer, Shield, Activity } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Sensor {
  id: number;
  type: 'environmental' | 'security' | 'infrastructure';
  subtype: 'temperature' | 'humidity' | 'air_quality' | 'motion' | 'cctv' | 'structural' | 'network';
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'maintenance';
  lastReading: string;
  location: string;
  description: string;
}

interface MapViewProps {
  height?: string;
  disasters?: Disaster[];
  center?: [number, number];
  zoom?: number;
}

const MapView: React.FC<MapViewProps> = ({
  height = '500px',
  disasters = [],
  center = [12.9237, 77.4987], // RV College of Engineering coordinates
  zoom = 16, // Increased zoom level for campus view
}) => {
  const [sensors, setSensors] = useState<Sensor[]>([
    // Environmental Sensors
    {
      id: 1,
      type: 'environmental',
      subtype: 'temperature',
      latitude: 12.9237,
      longitude: 77.4987,
      status: 'active',
      lastReading: '28°C',
      location: 'Main Building',
      description: 'Temperature and humidity monitoring'
    },
    {
      id: 2,
      type: 'environmental',
      subtype: 'air_quality',
      latitude: 12.9240,
      longitude: 77.4990,
      status: 'active',
      lastReading: 'AQI: 75',
      location: 'Chemical Lab',
      description: 'Air quality monitoring station'
    },
    // Security Sensors
    {
      id: 3,
      type: 'security',
      subtype: 'motion',
      latitude: 12.9235,
      longitude: 77.4985,
      status: 'active',
      lastReading: 'Clear',
      location: 'Campus Perimeter',
      description: 'Motion detection sensor'
    },
    {
      id: 4,
      type: 'security',
      subtype: 'cctv',
      latitude: 12.9238,
      longitude: 77.4983,
      status: 'maintenance',
      lastReading: 'Offline',
      location: 'Main Gate',
      description: 'CCTV surveillance camera'
    },
    // Infrastructure Sensors
    {
      id: 5,
      type: 'infrastructure',
      subtype: 'structural',
      latitude: 12.9236,
      longitude: 77.4988,
      status: 'active',
      lastReading: 'Normal',
      location: 'Library Building',
      description: 'Structural health monitoring'
    },
    {
      id: 6,
      type: 'infrastructure',
      subtype: 'network',
      latitude: 12.9239,
      longitude: 77.4986,
      status: 'inactive',
      lastReading: 'No Signal',
      location: 'Computer Center',
      description: 'Network connectivity monitor'
    }
  ]);

  const getSensorIcon = (type: string, status: string) => {
    let color;
    let size = 30;
    let className = `sensor-marker ${type} ${status}`;

    // Determine color based on status
    switch (status) {
      case 'active':
        color = '#4CAF50';
        break;
      case 'inactive':
        color = '#F44336';
        break;
      case 'maintenance':
        color = '#FFC107';
        break;
      default:
        color = '#757575';
    }

    // Create custom HTML for different sensor types
    let html = '';
    switch (type) {
      case 'environmental':
        html = `<div class="${className}" style="width: ${size}px; height: ${size}px; border-radius: 50%; background-color: ${color}; display: flex; align-items: center; justify-center;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="${size/2}" height="${size/2}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 9a4 4 0 0 0-2 7.5"></path>
                    <path d="M12 3v2"></path>
                    <path d="m6.6 18.4-1.4 1.4"></path>
                    <path d="M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path>
                  </svg>
                </div>`;
        break;
      case 'security':
        html = `<div class="${className}" style="width: ${size}px; height: ${size}px; border-radius: 50%; background-color: ${color}; display: flex; align-items: center; justify-center;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="${size/2}" height="${size/2}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                  </svg>
                </div>`;
        break;
      case 'infrastructure':
        html = `<div class="${className}" style="width: ${size}px; height: ${size}px; border-radius: 50%; background-color: ${color}; display: flex; align-items: center; justify-center;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="${size/2}" height="${size/2}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>`;
        break;
    }

    return new DivIcon({
      html,
      className: '',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
    });
  };

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden shadow-md">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Environmental Sensors">
            <LayerGroup>
              {sensors
                .filter(sensor => sensor.type === 'environmental')
                .map(sensor => (
                  <Marker
                    key={sensor.id}
                    position={[sensor.latitude, sensor.longitude]}
                    icon={getSensorIcon(sensor.type, sensor.status)}
                  >
                    <Popup>
                      <div className="text-sm">
                        <h3 className="font-inter font-bold text-gray-900">{sensor.location}</h3>
                        <p className="text-gray-700 mt-1">{sensor.description}</p>
                        <p className="text-gray-600 mt-1">Last Reading: {sensor.lastReading}</p>
                        <p className="text-gray-500 mt-1">Status: <span className="capitalize font-medium">{sensor.status}</span></p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Security Sensors">
            <LayerGroup>
              {sensors
                .filter(sensor => sensor.type === 'security')
                .map(sensor => (
                  <Marker
                    key={sensor.id}
                    position={[sensor.latitude, sensor.longitude]}
                    icon={getSensorIcon(sensor.type, sensor.status)}
                  >
                    <Popup>
                      <div className="text-sm">
                        <h3 className="font-inter font-bold text-gray-900">{sensor.location}</h3>
                        <p className="text-gray-700 mt-1">{sensor.description}</p>
                        <p className="text-gray-600 mt-1">Last Reading: {sensor.lastReading}</p>
                        <p className="text-gray-500 mt-1">Status: <span className="capitalize font-medium">{sensor.status}</span></p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Infrastructure Sensors">
            <LayerGroup>
              {sensors
                .filter(sensor => sensor.type === 'infrastructure')
                .map(sensor => (
                  <Marker
                    key={sensor.id}
                    position={[sensor.latitude, sensor.longitude]}
                    icon={getSensorIcon(sensor.type, sensor.status)}
                  >
                    <Popup>
                      <div className="text-sm">
                        <h3 className="font-inter font-bold text-gray-900">{sensor.location}</h3>
                        <p className="text-gray-700 mt-1">{sensor.description}</p>
                        <p className="text-gray-600 mt-1">Last Reading: {sensor.lastReading}</p>
                        <p className="text-gray-500 mt-1">Status: <span className="capitalize font-medium">{sensor.status}</span></p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        {/* Legend */}
        <div className="leaflet-bottom leaflet-right">
          <div className="leaflet-control leaflet-bar bg-white p-3 rounded-lg shadow-md m-4">
            <h4 className="font-medium text-gray-900 mb-2">Sensor Types</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="ml-2 text-sm text-gray-700">Inactive</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="ml-2 text-sm text-gray-700">Maintenance</span>
              </div>
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default MapView;