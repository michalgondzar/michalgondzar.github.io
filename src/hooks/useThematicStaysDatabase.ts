
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ThematicStay {
  id: string;
  stay_id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
  created_at?: string;
  updated_at?: string;
}

export const useThematicStaysDatabase = () => {
  const [stays, setStays] = useState<ThematicStay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStays = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('thematic_stays')
        .select('*')
        .order('stay_id');

      if (error) {
        console.error('Error fetching thematic stays:', error);
        throw error;
      }

      console.log('Fetched thematic stays from database:', data);
      
      // Transform the data to match our interface and handle the Json type properly
      const transformedStays = data?.map(stay => ({
        ...stay,
        features: Array.isArray(stay.features) ? stay.features as string[] : []
      })) || [];
      
      setStays(transformedStays);
      setError(null);
    } catch (err: any) {
      console.error('Error in fetchStays:', err);
      setError(err.message);
      toast.error('Chyba pri načítavaní tematických pobytov');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStay = useCallback(async (stayId: string, updates: Partial<ThematicStay>) => {
    try {
      console.log('Updating stay:', stayId, updates);
      
      const { data, error } = await supabase
        .from('thematic_stays')
        .update(updates)
        .eq('stay_id', stayId)
        .select()
        .single();

      if (error) {
        console.error('Error updating thematic stay:', error);
        throw error;
      }

      console.log('Updated stay in database:', data);
      
      // Refresh data to ensure synchronization
      await fetchStays();
      
      toast.success('Tematický pobyt bol úspešne aktualizovaný');
      return data;
    } catch (err: any) {
      console.error('Error in updateStay:', err);
      setError(err.message);
      toast.error('Chyba pri aktualizácii tematického pobytu');
      throw err;
    }
  }, [fetchStays]);

  // Set up real-time subscription for changes
  useEffect(() => {
    console.log('Setting up real-time subscription for thematic_stays');
    
    const channel = supabase
      .channel('thematic-stays-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'thematic_stays'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Refresh data when changes occur
          fetchStays();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [fetchStays]);

  // Initial fetch
  useEffect(() => {
    fetchStays();
  }, [fetchStays]);

  return {
    stays,
    loading,
    error,
    updateStay,
    refetch: fetchStays
  };
};
