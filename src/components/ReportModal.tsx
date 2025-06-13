import React, { useState } from 'react';
import { Camera, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const getUserLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocating(false);
          toast.success('Location acquired');
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocating(false);
          toast.error('Could not get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to report an emergency');
      return;
    }
    
    if (description.trim() === '') {
      toast.error('Please provide a description');
      return;
    }
    
    if (location.latitude === 0 && location.longitude === 0) {
      toast.error('Please share your location');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.from('reports').insert({
        user_id: user.id,
        description,
        latitude: location.latitude,
        longitude: location.longitude,
        status: 'pending',
      });
      
      if (error) throw error;
      
      toast.success('Emergency reported successfully');
      setDescription('');
      setLocation({ latitude: 0, longitude: 0 });
      onClose();
    } catch (error) {
      console.error('Error reporting emergency:', error);
      toast.error('Failed to report emergency');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-alert-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-alert-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-inter font-bold text-gray-900">
                Report Emergency
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Provide details about the emergency situation. Your report will be sent to nearby responders.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 sm:mt-4">
            <div className="mt-3">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="input mt-1"
                placeholder="Describe the emergency situation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <button
                type="button"
                onClick={getUserLocation}
                className="mt-1 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={locating}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {locating ? 'Getting location...' : 'Share my location'}
              </button>
              {location.latitude !== 0 && location.longitude !== 0 && (
                <p className="mt-1 text-sm text-green-600">
                  Location acquired: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              )}
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">
                Add Photo (Optional)
              </label>
              <button
                type="button"
                className="mt-1 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled
              >
                <Camera className="mr-2 h-4 w-4" />
                Add Photo
              </button>
              <p className="mt-1 text-xs text-gray-500">
                Photo upload will be available in a future update
              </p>
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-alert-600 text-base font-medium text-white hover:bg-alert-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alert-500 sm:col-start-2 sm:text-sm"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Report'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;