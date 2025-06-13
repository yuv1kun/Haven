import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Disaster {
  id: string;
  type: 'earthquake' | 'flood' | 'fire';
  severity: 'low' | 'medium' | 'high' | 'critical';
  latitude: number;
  longitude: number;
  description: string;
  created_at: string;
}

export function useDisasters() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const { data, error } = await supabase
          .from('alerts')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDisasters(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasters();

    const subscription = supabase
      .channel('disasters-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, fetchDisasters)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { disasters, loading, error };
}