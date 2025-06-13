import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  activeAlerts: number;
  monitoringStations: number;
  availableResources: number;
  responseTeams: number;
  alertsByType: {
    earthquake: number;
    flood: number;
    fire: number;
  };
  resourcesByStatus: {
    available: number;
    deployed: number;
    maintenance: number;
  };
}

export function useStats() {
  const [stats, setStats] = useState<DashboardStats>({
    activeAlerts: 0,
    monitoringStations: 0,
    availableResources: 0,
    responseTeams: 0,
    alertsByType: {
      earthquake: 0,
      flood: 0,
      fire: 0
    },
    resourcesByStatus: {
      available: 0,
      deployed: 0,
      maintenance: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get active alerts count
        const { count: activeAlerts } = await supabase
          .from('alerts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Get active monitoring stations count
        const { count: monitoringStations } = await supabase
          .from('sensors')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Get available resources count
        const { count: availableResources } = await supabase
          .from('resources')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'available');

        // Get response teams count (responders)
        const { count: responseTeams } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'responder');

        // Get alerts by type
        const { data: alertsByType } = await supabase
          .from('alerts')
          .select('type')
          .eq('status', 'active');

        const alertTypes = {
          earthquake: 0,
          flood: 0,
          fire: 0
        };

        alertsByType?.forEach(alert => {
          alertTypes[alert.type as keyof typeof alertTypes]++;
        });

        // Get resources by status
        const { data: resourcesByStatus } = await supabase
          .from('resources')
          .select('status');

        const resourceStatus = {
          available: 0,
          deployed: 0,
          maintenance: 0
        };

        resourcesByStatus?.forEach(resource => {
          resourceStatus[resource.status as keyof typeof resourceStatus]++;
        });

        setStats({
          activeAlerts: activeAlerts || 0,
          monitoringStations: monitoringStations || 0,
          availableResources: availableResources || 0,
          responseTeams: responseTeams || 0,
          alertsByType: alertTypes,
          resourcesByStatus: resourceStatus
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up real-time subscriptions
    const alertsSubscription = supabase
      .channel('alerts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, fetchStats)
      .subscribe();

    const sensorsSubscription = supabase
      .channel('sensors-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sensors' }, fetchStats)
      .subscribe();

    const resourcesSubscription = supabase
      .channel('resources-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resources' }, fetchStats)
      .subscribe();

    return () => {
      alertsSubscription.unsubscribe();
      sensorsSubscription.unsubscribe();
      resourcesSubscription.unsubscribe();
    };
  }, []);

  return { stats, loading, error };
}