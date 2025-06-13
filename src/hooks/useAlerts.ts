import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Alert {
  id: string;
  type: 'environmental' | 'security' | 'infrastructure';
  subtype: 'temperature' | 'humidity' | 'air_quality' | 'motion' | 'cctv' | 'structural' | 'network';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  sensor_id: string;
  created_at: string;
  status: 'active' | 'investigating' | 'resolved';
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'environmental',
      subtype: 'temperature',
      severity: 'high',
      description: 'High temperature detected in Chemical Lab',
      location: 'Chemical Lab',
      sensor_id: '2',
      created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      status: 'active'
    },
    {
      id: '2',
      type: 'security',
      subtype: 'motion',
      severity: 'medium',
      description: 'Unexpected motion detected after hours',
      location: 'Campus Perimeter',
      sensor_id: '3',
      created_at: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      status: 'investigating'
    },
    {
      id: '3',
      type: 'infrastructure',
      subtype: 'network',
      severity: 'critical',
      description: 'Network connectivity loss in Computer Center',
      location: 'Computer Center',
      sensor_id: '6',
      created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      status: 'active'
    },
    {
      id: '4',
      type: 'environmental',
      subtype: 'air_quality',
      severity: 'medium',
      description: 'Elevated air particulate levels',
      location: 'Chemical Lab',
      sensor_id: '2',
      created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      status: 'resolved'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const subscription = supabase
      .channel('alerts-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, (payload) => {
        // Update alerts when new data arrives
        setAlerts(currentAlerts => {
          const newAlert = payload.new as Alert;
          switch (payload.eventType) {
            case 'INSERT':
              return [newAlert, ...currentAlerts];
            case 'UPDATE':
              return currentAlerts.map(alert => 
                alert.id === newAlert.id ? newAlert : alert
              );
            case 'DELETE':
              return currentAlerts.filter(alert => alert.id !== payload.old.id);
            default:
              return currentAlerts;
          }
        });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { alerts, loading, error };
}