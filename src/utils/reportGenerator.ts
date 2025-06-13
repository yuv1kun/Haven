import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

interface ReportData {
  stats: {
    activeAlerts: number;
    monitoringStations: number;
    availableResources: number;
    responseTeams: number;
    alertsByType: {
      earthquake: number;
      flood: number;
      fire: number;
    };
  };
  alerts: any[];
  resources: any[];
}

export async function generateReport(): Promise<Blob> {
  try {
    // Fetch all required data
    const data = await fetchReportData();
    
    // Generate CSV content
    const csvContent = generateCSVContent(data);
    
    // Create Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return blob;
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error('Failed to generate report');
  }
}

async function fetchReportData(): Promise<ReportData> {
  const [
    { data: alerts },
    { data: resources },
    { count: activeAlerts },
    { count: monitoringStations },
    { count: availableResources },
    { count: responseTeams }
  ] = await Promise.all([
    supabase.from('alerts').select('*').eq('status', 'active'),
    supabase.from('resources').select('*'),
    supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('sensors').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('resources').select('*', { count: 'exact', head: true }).eq('status', 'available'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'responder')
  ]);

  // Calculate alerts by type
  const alertsByType = {
    earthquake: 0,
    flood: 0,
    fire: 0
  };

  alerts?.forEach(alert => {
    alertsByType[alert.type as keyof typeof alertsByType]++;
  });

  return {
    stats: {
      activeAlerts: activeAlerts || 0,
      monitoringStations: monitoringStations || 0,
      availableResources: availableResources || 0,
      responseTeams: responseTeams || 0,
      alertsByType
    },
    alerts: alerts || [],
    resources: resources || []
  };
}

function generateCSVContent(data: ReportData): string {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  let content = '';

  // Report Header
  content += 'Haven Disaster Response Platform - Status Report\n';
  content += `Generated on: ${timestamp}\n\n`;

  // Summary Statistics
  content += 'SUMMARY STATISTICS\n';
  content += '==================\n';
  content += `Active Alerts: ${data.stats.activeAlerts}\n`;
  content += `Monitoring Stations: ${data.stats.monitoringStations}\n`;
  content += `Available Resources: ${data.stats.availableResources}\n`;
  content += `Response Teams: ${data.stats.responseTeams}\n\n`;

  // Alerts by Type
  content += 'ALERTS BY TYPE\n';
  content += '=============\n';
  content += `Earthquake Alerts: ${data.stats.alertsByType.earthquake}\n`;
  content += `Flood Alerts: ${data.stats.alertsByType.flood}\n`;
  content += `Fire Alerts: ${data.stats.alertsByType.fire}\n\n`;

  // Active Alerts Details
  content += 'ACTIVE ALERTS\n';
  content += '============\n';
  content += 'Type,Severity,Location,Description,Created At\n';
  data.alerts.forEach(alert => {
    content += `${alert.type},${alert.severity},${alert.latitude},${alert.longitude},"${alert.description}",${format(new Date(alert.created_at), 'yyyy-MM-dd HH:mm:ss')}\n`;
  });
  content += '\n';

  // Resources Status
  content += 'RESOURCES STATUS\n';
  content += '===============\n';
  content += 'Name,Type,Quantity,Status,Location\n';
  data.resources.forEach(resource => {
    content += `${resource.name},${resource.type},${resource.quantity},${resource.status},${JSON.stringify(resource.location)}\n`;
  });

  return content;
}