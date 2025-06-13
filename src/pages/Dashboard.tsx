import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import MapView from '../components/MapView';
import { useStats } from '../hooks/useStats';
import { useAlerts } from '../hooks/useAlerts';
import { useDisasters } from '../hooks/useDisasters';
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  Package, 
  Bell, 
  Eye, 
  LifeBuoy, 
  Droplets, 
  Flame,
  Download,
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  Target,
  Clock,
  MapPin,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { stats, loading: statsLoading } = useStats();
  const { alerts, loading: alertsLoading } = useAlerts();
  const { disasters, loading: disastersLoading } = useDisasters();
  const [generatingReport, setGeneratingReport] = useState(false);

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create CSV content
      const csvContent = generateReportCSV();
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `haven-dashboard-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Report generated and downloaded successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const generateReportCSV = () => {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    let content = '';

    // Report Header
    content += 'Haven Disaster Response Platform - Dashboard Report\n';
    content += `Generated on: ${timestamp}\n\n`;

    // Summary Statistics
    content += 'SUMMARY STATISTICS\n';
    content += '==================\n';
    content += `Active Alerts,${stats.activeAlerts}\n`;
    content += `Monitoring Stations,${stats.monitoringStations}\n`;
    content += `Available Resources,${stats.availableResources}\n`;
    content += `Response Teams,${stats.responseTeams}\n\n`;

    // Alerts by Type
    content += 'ALERTS BY TYPE\n';
    content += '=============\n';
    content += `Earthquake Alerts,${stats.alertsByType.earthquake}\n`;
    content += `Flood Alerts,${stats.alertsByType.flood}\n`;
    content += `Fire Alerts,${stats.alertsByType.fire}\n\n`;

    // Recent Alerts
    content += 'RECENT ALERTS\n';
    content += '============\n';
    content += 'Type,Severity,Description,Location,Created At,Status\n';
    alerts.slice(0, 10).forEach(alert => {
      content += `${alert.type},${alert.severity},"${alert.description}","${alert.location}",${format(new Date(alert.created_at), 'yyyy-MM-dd HH:mm:ss')},${alert.status}\n`;
    });

    return content;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="btn btn-primary flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            {generatingReport ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Alerts"
          value={stats.activeAlerts}
          change={12}
          icon={<Bell className="h-6 w-6 text-white" />}
          color="bg-alert-600"
        />
        <StatCard
          title="Monitoring Stations"
          value={stats.monitoringStations}
          change={-3}
          icon={<Eye className="h-6 w-6 text-white" />}
          color="bg-secondary-600"
        />
        <StatCard
          title="Available Resources"
          value={stats.availableResources}
          change={0}
          icon={<Package className="h-6 w-6 text-white" />}
          color="bg-success-600"
        />
        <StatCard
          title="Response Teams"
          value={stats.responseTeams}
          change={5}
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-primary-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-inter font-bold text-lg text-gray-900">Campus Disaster Monitoring</h2>
            </div>
            <div className="p-4">
              <MapView height="400px" disasters={disasters} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-inter font-bold text-lg text-gray-900">Recent Alerts</h2>
              <Link to="/monitoring" className="text-sm text-primary-600 hover:text-primary-800">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {alertsLoading ? (
                <div className="p-4 text-center text-gray-500">Loading alerts...</div>
              ) : alerts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No recent alerts</div>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="p-4 flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center
                        ${alert.type === 'earthquake' ? 'bg-red-100' : 
                          alert.type === 'flood' ? 'bg-blue-100' : 'bg-orange-100'}
                      `}>
                        {alert.type === 'earthquake' ? (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        ) : alert.type === 'flood' ? (
                          <Droplets className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Flame className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{alert.type} Alert</p>
                      <p className="text-sm text-gray-500">{alert.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(alert.created_at), 'PPp')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Predictive Analytics Section - Realistic for June Bengaluru */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-inter font-bold text-xl text-gray-900 flex items-center">
                <Brain className="h-6 w-6 mr-2 text-primary-600" />
                Advanced Predictive Analytics
              </h2>
              <p className="text-sm text-gray-600 mt-1">AI-powered disaster prediction for RV College of Engineering Campus - June 2024 (Monsoon Season)</p>
            </div>
            <Link to="/analytics" className="btn btn-secondary text-sm">
              View Detailed Analytics
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {/* Campus-specific Risk Assessment Cards - Realistic for June */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-900">Earthquake Risk</h3>
                </div>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">VERY LOW</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Probability:</span>
                  <span className="font-medium text-green-900">2%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '2%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-green-600">
                  <span>Seismic Zone II</span>
                  <span>Campus Wide</span>
                </div>
                <p className="text-xs text-green-700 mt-2">Bengaluru is in low seismic risk zone. Historical data shows very rare earthquake activity.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Droplets className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="font-semibold text-red-900">Flood Risk</h3>
                </div>
                <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full font-medium">HIGH</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-red-700">Probability:</span>
                  <span className="font-medium text-red-900">68%</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-red-600">
                  <span>Next 48h</span>
                  <span>Chemical Lab Area</span>
                </div>
                <p className="text-xs text-red-700 mt-2">June monsoon brings heavy rainfall. IMD warnings active for urban flooding in low-lying areas.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Flame className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-900">Fire Risk</h3>
                </div>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">LOW</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Probability:</span>
                  <span className="font-medium text-green-900">28%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-green-600">
                  <span>Next 72h</span>
                  <span>Library Building</span>
                </div>
                <p className="text-xs text-green-700 mt-2">Monsoon humidity significantly reduces fire risk. Only electrical hazards remain a concern.</p>
              </div>
            </div>
          </div>

          {/* AI Model Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
              <div className="flex items-center mb-4">
                <Zap className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="font-semibold text-purple-900">LSTM Model Performance</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700">Campus Prediction Accuracy</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-purple-900">94.2%</span>
                    <TrendingUp className="h-4 w-4 text-green-600 ml-1" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700">Model Confidence</span>
                  <span className="text-lg font-bold text-purple-900">87.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700">Data Sources</span>
                  <span className="text-sm font-medium text-purple-800">IMD + Campus Sensors</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-5 border border-indigo-200">
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 text-indigo-600 mr-2" />
                <h3 className="font-semibold text-indigo-900">Campus Monitoring System</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-indigo-700">Active Campus Sensors</span>
                  <span className="text-lg font-bold text-indigo-900">{stats.monitoringStations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-indigo-700">Response Time</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-indigo-900">2.3s</span>
                    <TrendingDown className="h-4 w-4 text-green-600 ml-1" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-indigo-700">Campus Coverage</span>
                  <span className="text-sm font-medium text-indigo-800">98.7%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Campus Predictions */}
          <div className="bg-gray-50 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-gray-600" />
                Recent Campus AI Predictions (June Monsoon Season)
              </h3>
              <span className="text-xs text-gray-500">Last updated: {format(new Date(), 'h:mm a')}</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Heavy Rainfall Alert - Chemical Lab</p>
                    <p className="text-xs text-gray-500">IMD warning: 50mm+ rainfall expected in next 6 hours</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Confidence: 89%</p>
                  <p className="text-xs text-gray-400">5 min ago</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Seismic Activity - Normal</p>
                    <p className="text-xs text-gray-500">All campus areas - No seismic activity detected</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Confidence: 98%</p>
                  <p className="text-xs text-gray-400">12 min ago</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Fire Risk Reduced - Monsoon Effect</p>
                    <p className="text-xs text-gray-500">High humidity levels suppress fire hazards campus-wide</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Confidence: 95%</p>
                  <p className="text-xs text-gray-400">18 min ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;