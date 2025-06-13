import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Download, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Brain,
  Zap,
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Droplets,
  Flame
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics: React.FC = () => {
  // Realistic campus-specific predictive data for RV College of Engineering, Bengaluru in June
  const earthquakeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Predicted Risk',
        data: [0.02, 0.02, 0.03, 0.03, 0.03, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02],
        borderColor: 'rgba(211, 47, 47, 1)',
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Actual Readings',
        data: [0.01, 0.01, 0.02, 0.02, 0.02, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        borderColor: 'rgba(25, 118, 210, 1)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  // Bangalore monsoon-adjusted flood predictions - High during June-September
  const floodData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Predicted Risk',
        data: [0.05, 0.08, 0.12, 0.15, 0.25, 0.68, 0.75, 0.80, 0.70, 0.35, 0.15, 0.08],
        borderColor: 'rgba(33, 150, 243, 1)',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Actual Readings',
        data: [0.03, 0.06, 0.10, 0.12, 0.22, 0.65, 0.72, 0.78, 0.68, 0.32, 0.12, 0.06],
        borderColor: 'rgba(13, 71, 161, 1)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  // Bangalore fire risk - Low during monsoon season (June-September)
  const fireData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Predicted Risk',
        data: [0.35, 0.45, 0.55, 0.65, 0.70, 0.28, 0.20, 0.18, 0.25, 0.40, 0.50, 0.40],
        borderColor: 'rgba(255, 152, 0, 1)',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Actual Readings',
        data: [0.32, 0.42, 0.52, 0.62, 0.67, 0.25, 0.18, 0.15, 0.22, 0.38, 0.48, 0.38],
        borderColor: 'rgba(230, 81, 0, 1)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  // Campus-specific disaster distribution - realistic for Bengaluru
  const disasterTypeData = {
    labels: ['Flood', 'Fire', 'Infrastructure', 'Weather', 'Earthquake', 'Security'],
    datasets: [
      {
        label: 'Number of Events (Historical)',
        data: [25, 8, 12, 15, 2, 3], // Floods most common, earthquakes very rare
        backgroundColor: [
          'rgba(33, 150, 243, 0.8)',
          'rgba(255, 152, 0, 0.8)',
          'rgba(121, 85, 72, 0.8)',
          'rgba(96, 125, 139, 0.8)',
          'rgba(211, 47, 47, 0.8)',
          'rgba(156, 39, 176, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.dataset.label + ': ' + (context.raw * 100).toFixed(1) + '% probability';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        title: {
          display: true,
          text: 'Risk Probability (0-1)'
        },
        ticks: {
          callback: function(value: any) {
            return (value * 100).toFixed(0) + '%';
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    }
  };

  const handleExportData = async () => {
    try {
      toast.loading('Generating analytics report...', { id: 'export' });
      
      // Simulate data processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const csvContent = generateAnalyticsCSV();
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `haven-analytics-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Analytics report exported successfully!', { id: 'export' });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export analytics data', { id: 'export' });
    }
  };

  const generateAnalyticsCSV = () => {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    let content = '';

    // Report Header
    content += 'Haven Analytics Report - RV College of Engineering Campus (June 2024)\n';
    content += `Generated on: ${timestamp}\n\n`;

    // Current Risk Assessment - Realistic for June in Bengaluru
    content += 'CURRENT RISK ASSESSMENT (JUNE - MONSOON SEASON)\n';
    content += '================================================\n';
    content += 'Risk Type,Current Probability,Risk Level,Location,Notes\n';
    content += 'Earthquake,2%,Very Low,Campus Wide,Bengaluru is in Seismic Zone II (low risk)\n';
    content += 'Flood,68%,High,Chemical Lab Area,Monsoon season - heavy rainfall expected\n';
    content += 'Fire,28%,Low,Library Building,Monsoon humidity reduces fire risk\n\n';

    // Sensor Data
    content += 'ACTIVE SENSOR READINGS\n';
    content += '=====================\n';
    content += 'Sensor ID,Type,Location,Last Reading,Status,Battery Level\n';
    content += 'EQ-001,Earthquake,Main Building,0.02,Active,92%\n';
    content += 'FL-001,Flood,Chemical Lab,12.3cm,Active,87%\n';
    content += 'FR-001,Fire,Library Building,Normal,Active,45%\n';
    content += 'EQ-002,Earthquake,Computer Center,0.01,Active,78%\n';
    content += 'FL-002,Flood,Campus Perimeter,8.5cm,Active,98%\n';
    content += 'FR-002,Fire,Main Gate,Normal,Active,89%\n\n';

    // Monthly Predictions
    content += 'MONTHLY RISK PREDICTIONS (REALISTIC FOR BENGALURU)\n';
    content += '=================================================\n';
    content += 'Month,Earthquake Risk,Flood Risk,Fire Risk\n';
    earthquakeData.labels.forEach((month, index) => {
      content += `${month},${(earthquakeData.datasets[0].data[index] * 100).toFixed(1)}%,${(floodData.datasets[0].data[index] * 100).toFixed(1)}%,${(fireData.datasets[0].data[index] * 100).toFixed(1)}%\n`;
    });
    content += '\n';

    // Model Performance
    content += 'MODEL PERFORMANCE METRICS\n';
    content += '========================\n';
    content += 'Metric,Value\n';
    content += 'Prediction Accuracy,94.2%\n';
    content += 'Model Confidence,87.5%\n';
    content += 'Response Time,2.3s\n';
    content += 'Coverage Area,98.7%\n';
    content += 'Active Sensors,24\n';
    content += 'Data Sources,IMD Weather + Campus Sensors + Historical Data\n';

    return content;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Predictive Analytics</h1>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={handleExportData}
            className="btn btn-secondary flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Enhanced Predictive Analytics Section */}
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
                  <span className="text-lg font-bold text-indigo-900">24</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-inter font-bold text-lg text-gray-900">Earthquake Risk Forecast</h2>
            <p className="text-sm text-gray-500">Very low seismic activity (Zone II)</p>
          </div>
          <div className="p-4">
            <Line data={earthquakeData} options={chartOptions} />
          </div>
        </div>

        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-inter font-bold text-lg text-gray-900">Flood Risk Forecast</h2>
            <p className="text-sm text-gray-500">Monsoon season analysis (June-September peak)</p>
          </div>
          <div className="p-4">
            <Line data={floodData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-inter font-bold text-lg text-gray-900">Fire Risk Forecast</h2>
            <p className="text-sm text-gray-500">Monsoon humidity reduces fire risk significantly</p>
          </div>
          <div className="p-4">
            <Line data={fireData} options={chartOptions} />
          </div>
        </div>

        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-inter font-bold text-lg text-gray-900">Campus Incident Distribution</h2>
            <p className="text-sm text-gray-500">Historical patterns (floods most common)</p>
          </div>
          <div className="p-4">
            <Bar 
              data={disasterTypeData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Events'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Incident Type'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-inter font-bold text-lg text-gray-900">Enhanced LSTM Model Predictions</h2>
          <p className="text-sm text-gray-500">Campus-specific risk assessment for RV College of Engineering (June 2024 - Monsoon Season)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campus Area
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Probability
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Chemical Lab Area
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Flood
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  68%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  6 hours
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  High
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    High
                  </span>
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Main Building
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Earthquake
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  N/A
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Very High
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Very Low
                  </span>
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Library Building
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Fire
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  28%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  12 hours
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Medium
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Low
                  </span>
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Computer Center
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Flood
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  45%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  8 hours
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Medium
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Medium
                  </span>
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Campus Perimeter
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Flood
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  55%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  10 hours
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  High
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Medium
                  </span>
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Main Gate Area
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Earthquake
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  1%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  N/A
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Very High
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Very Low
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;