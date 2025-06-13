import React, { useState } from 'react';
import { Package, Search, Filter, LifeBuoy, ShieldAlert, ChevronFirst as FirstAid, Truck, Users, PlusCircle, X, Edit, UserCheck, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

type ResourceType = 'all' | 'medical' | 'rescue' | 'food' | 'shelter' | 'transport';

interface Resource {
  id: string;
  name: string;
  type: 'medical' | 'rescue' | 'food' | 'shelter' | 'transport';
  location: string;
  quantity: number | string;
  status: 'available' | 'deployed' | 'maintenance';
  description?: string;
}

const Resources: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ResourceType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [resources, setResources] = useState<Resource[]>([
    {
      id: 'MED-001',
      name: 'First Aid Kits',
      type: 'medical',
      location: 'Central Warehouse',
      quantity: 42,
      status: 'available',
      description: 'Standard emergency first aid supplies'
    },
    {
      id: 'TEAM-002',
      name: 'Rescue Team Alpha',
      type: 'rescue',
      location: 'Eastern Station',
      quantity: '1 Team (8 people)',
      status: 'available',
      description: 'Specialized rescue operations team'
    },
    {
      id: 'FOOD-003',
      name: 'Emergency Food Supply',
      type: 'food',
      location: 'Southern Depot',
      quantity: 250,
      status: 'available',
      description: 'Emergency food packages for disaster relief'
    },
    {
      id: 'SHEL-004',
      name: 'Emergency Shelter',
      type: 'shelter',
      location: 'Central School',
      quantity: 'Capacity: 200',
      status: 'deployed',
      description: 'Temporary shelter facility'
    },
    {
      id: 'TRAN-005',
      name: 'Emergency Vehicles',
      type: 'transport',
      location: 'Western Garage',
      quantity: 8,
      status: 'available',
      description: 'Emergency response vehicles'
    },
    {
      id: 'MED-006',
      name: 'Medical Equipment',
      type: 'medical',
      location: 'Hospital North',
      quantity: 15,
      status: 'maintenance',
      description: 'Advanced medical equipment for emergencies'
    },
    {
      id: 'FOOD-007',
      name: 'Water Supplies',
      type: 'food',
      location: 'Distribution Center',
      quantity: 500,
      status: 'available',
      description: 'Emergency water bottles and purification tablets'
    },
    {
      id: 'RESCUE-008',
      name: 'Search & Rescue Dogs',
      type: 'rescue',
      location: 'K9 Unit Base',
      quantity: '3 Teams',
      status: 'available',
      description: 'Trained search and rescue dog teams'
    },
    {
      id: 'SHEL-009',
      name: 'Temporary Tents',
      type: 'shelter',
      location: 'Storage Facility A',
      quantity: 75,
      status: 'available',
      description: 'Weather-resistant emergency tents'
    },
    {
      id: 'TRAN-010',
      name: 'Ambulances',
      type: 'transport',
      location: 'Medical Center',
      quantity: 4,
      status: 'deployed',
      description: 'Emergency medical transport vehicles'
    },
    {
      id: 'MED-011',
      name: 'Oxygen Tanks',
      type: 'medical',
      location: 'Emergency Depot',
      quantity: 28,
      status: 'available',
      description: 'Portable oxygen supply units'
    },
    {
      id: 'RESCUE-012',
      name: 'Heavy Rescue Equipment',
      type: 'rescue',
      location: 'Fire Station 3',
      quantity: '2 Sets',
      status: 'maintenance',
      description: 'Heavy machinery for rescue operations'
    }
  ]);

  const [newResource, setNewResource] = useState({
    name: '',
    type: 'medical' as Resource['type'],
    location: '',
    quantity: '',
    status: 'available' as Resource['status'],
    description: ''
  });

  const itemsPerPage = 5;

  // Filter resources based on active filter and search term
  const filteredResources = resources.filter(resource => {
    const matchesFilter = activeFilter === 'all' || resource.type === activeFilter;
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Paginate filtered resources
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResources = filteredResources.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filter or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTerm]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return <FirstAid className="h-6 w-6 text-green-600" />;
      case 'rescue':
        return <LifeBuoy className="h-6 w-6 text-red-600" />;
      case 'food':
        return <Package className="h-6 w-6 text-orange-600" />;
      case 'shelter':
        return <ShieldAlert className="h-6 w-6 text-blue-600" />;
      case 'transport':
        return <Truck className="h-6 w-6 text-indigo-600" />;
      default:
        return <Package className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'deployed':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddResource = () => {
    if (!newResource.name || !newResource.location || !newResource.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const resource: Resource = {
      id: `${newResource.type.toUpperCase()}-${String(Date.now()).slice(-3)}`,
      ...newResource
    };

    setResources([...resources, resource]);
    setNewResource({
      name: '',
      type: 'medical',
      location: '',
      quantity: '',
      status: 'available',
      description: ''
    });
    setShowAddModal(false);
    toast.success('Resource added successfully!');
  };

  const handleEditResource = () => {
    if (!selectedResource) return;

    setResources(resources.map(resource => 
      resource.id === selectedResource.id ? selectedResource : resource
    ));
    setShowEditModal(false);
    setSelectedResource(null);
    toast.success('Resource updated successfully!');
  };

  const handleAssignResource = () => {
    if (!selectedResource) return;

    setResources(resources.map(resource => 
      resource.id === selectedResource.id 
        ? { ...resource, status: 'deployed' as Resource['status'] }
        : resource
    ));
    setShowAssignModal(false);
    setSelectedResource(null);
    toast.success('Resource assigned successfully!');
  };

  const openEditModal = (resource: Resource) => {
    setSelectedResource({ ...resource });
    setShowEditModal(true);
  };

  const openAssignModal = (resource: Resource) => {
    setSelectedResource(resource);
    setShowAssignModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Resource Management</h1>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary flex items-center"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Resource
          </button>
        </div>
      </div>
      
      <div className="card">
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2">
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${
              activeFilter === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            <Package className="w-4 h-4 mr-1" />
            <span>All</span>
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${
              activeFilter === 'medical' 
                ? 'bg-success-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setActiveFilter('medical')}
          >
            <FirstAid className="w-4 h-4 mr-1" />
            <span>Medical</span>
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${
              activeFilter === 'rescue' 
                ? 'bg-alert-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setActiveFilter('rescue')}
          >
            <LifeBuoy className="w-4 h-4 mr-1" />
            <span>Rescue</span>
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${
              activeFilter === 'food' 
                ? 'bg-warning-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setActiveFilter('food')}
          >
            <Package className="w-4 h-4 mr-1" />
            <span>Food & Water</span>
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${
              activeFilter === 'shelter' 
                ? 'bg-secondary-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setActiveFilter('shelter')}
          >
            <ShieldAlert className="w-4 h-4 mr-1" />
            <span>Shelter</span>
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${
              activeFilter === 'transport' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setActiveFilter('transport')}
          >
            <Truck className="w-4 h-4 mr-1" />
            <span>Transport</span>
          </button>
        </div>
        
        <div className="p-4 flex justify-between">
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilterModal(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedResources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No resources found matching your criteria
                  </td>
                </tr>
              ) : (
                paginatedResources.map((resource) => (
                  <tr key={resource.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                          <div className="text-sm text-gray-500">ID: {resource.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        resource.type === 'medical' ? 'bg-green-100 text-green-800' :
                        resource.type === 'rescue' ? 'bg-red-100 text-red-800' :
                        resource.type === 'food' ? 'bg-orange-100 text-orange-800' :
                        resource.type === 'shelter' ? 'bg-blue-100 text-blue-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {resource.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(resource.status)}`}>
                        {resource.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openAssignModal(resource)}
                        className="text-primary-600 hover:text-primary-900 mr-2"
                      >
                        Assign
                      </button>
                      <button 
                        onClick={() => openEditModal(resource)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredResources.length)}</span> of{' '}
                <span className="font-medium">{filteredResources.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'border-primary-300 bg-primary-50 text-primary-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Resource</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    value={newResource.name}
                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                    className="input mt-1"
                    placeholder="Resource name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type *</label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value as Resource['type'] })}
                    className="input mt-1"
                  >
                    <option value="medical">Medical</option>
                    <option value="rescue">Rescue</option>
                    <option value="food">Food & Water</option>
                    <option value="shelter">Shelter</option>
                    <option value="transport">Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location *</label>
                  <input
                    type="text"
                    value={newResource.location}
                    onChange={(e) => setNewResource({ ...newResource, location: e.target.value })}
                    className="input mt-1"
                    placeholder="Resource location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                  <input
                    type="text"
                    value={newResource.quantity}
                    onChange={(e) => setNewResource({ ...newResource, quantity: e.target.value })}
                    className="input mt-1"
                    placeholder="e.g., 50, 2 teams, Capacity: 100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={newResource.status}
                    onChange={(e) => setNewResource({ ...newResource, status: e.target.value as Resource['status'] })}
                    className="input mt-1"
                  >
                    <option value="available">Available</option>
                    <option value="deployed">Deployed</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    className="input mt-1"
                    rows={3}
                    placeholder="Optional description"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddResource}
                  className="btn btn-primary"
                >
                  Add Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Resource Modal */}
      {showEditModal && selectedResource && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Resource</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={selectedResource.name}
                    onChange={(e) => setSelectedResource({ ...selectedResource, name: e.target.value })}
                    className="input mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={selectedResource.location}
                    onChange={(e) => setSelectedResource({ ...selectedResource, location: e.target.value })}
                    className="input mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="text"
                    value={selectedResource.quantity}
                    onChange={(e) => setSelectedResource({ ...selectedResource, quantity: e.target.value })}
                    className="input mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={selectedResource.status}
                    onChange={(e) => setSelectedResource({ ...selectedResource, status: e.target.value as Resource['status'] })}
                    className="input mt-1"
                  >
                    <option value="available">Available</option>
                    <option value="deployed">Deployed</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={selectedResource.description || ''}
                    onChange={(e) => setSelectedResource({ ...selectedResource, description: e.target.value })}
                    className="input mt-1"
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="btn bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditResource}
                  className="btn btn-primary"
                >
                  Update Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Resource Modal */}
      {showAssignModal && selectedResource && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Assign Resource</h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mr-3">
                    {getResourceIcon(selectedResource.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedResource.name}</h4>
                    <p className="text-sm text-gray-500">{selectedResource.location}</p>
                    <p className="text-sm text-gray-500">Quantity: {selectedResource.quantity}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assign to Team/Location</label>
                  <select className="input mt-1">
                    <option value="">Select assignment...</option>
                    <option value="team-alpha">Response Team Alpha</option>
                    <option value="team-beta">Response Team Beta</option>
                    <option value="central-command">Central Command</option>
                    <option value="field-station-1">Field Station 1</option>
                    <option value="field-station-2">Field Station 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Assignment Notes</label>
                  <textarea
                    className="input mt-1"
                    rows={3}
                    placeholder="Optional notes about this assignment..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority Level</label>
                  <select className="input mt-1">
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="btn bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignResource}
                  className="btn btn-primary"
                >
                  Assign Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Advanced Filters</h3>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Available</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Deployed</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Maintenance</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <select className="input mt-1">
                    <option value="">All Locations</option>
                    <option value="central">Central District</option>
                    <option value="eastern">Eastern Region</option>
                    <option value="western">Western Area</option>
                    <option value="southern">Southern Zone</option>
                    <option value="northern">Northern Sector</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity Range</label>
                  <div className="mt-1 flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="input flex-1"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="input flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="btn bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowFilterModal(false);
                    toast.success('Filters applied successfully!');
                  }}
                  className="btn btn-primary"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;