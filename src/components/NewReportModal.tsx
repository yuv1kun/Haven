import React, { useState } from 'react';
import { Camera, MapPin, X, AlertTriangle, FileText, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewReportModal: React.FC<NewReportModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: 'emergency' as 'emergency' | 'damage' | 'resource_request',
    description: '',
    latitude: 0,
    longitude: 0,
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const getUserLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to submit a report');
      return;
    }
    
    if (formData.description.trim() === '') {
      toast.error('Please provide a description');
      return;
    }
    
    if (formData.latitude === 0 && formData.longitude === 0) {
      toast.error('Please share your location');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, you would upload images to storage first
      const imageUrls: string[] = [];
      
      const { error } = await supabase.from('reports').insert({
        user_id: user.id,
        type: formData.type,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        images: imageUrls,
        status: 'pending',
      });
      
      if (error) throw error;
      
      toast.success('Report submitted successfully');
      setFormData({
        type: 'emergency',
        description: '',
        latitude: 0,
        longitude: 0,
        priority: 'medium'
      });
      setImages([]);
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'damage':
        return <FileText className="w-5 h-5 text-orange-600" />;
      case 'resource_request':
        return <Package className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'border-red-300 bg-red-50 hover:bg-red-100';
      case 'damage':
        return 'border-orange-300 bg-orange-50 hover:bg-orange-100';
      case 'resource_request':
        return 'border-blue-300 bg-blue-50 hover:bg-blue-100';
      default:
        return 'border-gray-300 bg-gray-50 hover:bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg leading-6 font-inter font-bold text-gray-900">
                  Submit New Report
                </h3>
                <p className="text-sm text-gray-500">
                  Report an incident or request assistance
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Report Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'emergency', label: 'Emergency', description: 'Immediate assistance needed' },
                  { value: 'damage', label: 'Damage Report', description: 'Infrastructure or property damage' },
                  { value: 'resource_request', label: 'Resource Request', description: 'Need supplies or equipment' }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value as any })}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.type === type.value
                        ? `${getTypeColor(type.value)} border-opacity-100`
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      {getTypeIcon(type.value)}
                      <span className="ml-2 font-medium text-gray-900">{type.label}</span>
                    </div>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="low">Low - Non-urgent situation</option>
                <option value="medium">Medium - Moderate urgency</option>
                <option value="high">High - Urgent attention needed</option>
                <option value="critical">Critical - Immediate response required</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Provide detailed information about the situation..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={getUserLocation}
                  disabled={locating}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {locating ? 'Getting location...' : 'Use my location'}
                </button>
                {formData.latitude !== 0 && formData.longitude !== 0 && (
                  <div className="flex-1">
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Location acquired
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach Photos (Optional)
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB (max 5 files)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || formData.latitude === 0}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewReportModal;