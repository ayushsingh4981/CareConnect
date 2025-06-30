import { useEffect, useState } from 'react';
import { supabase } from '../client';

interface Nurse {
  id: string;
  full_name: string;
  specialization: string;
  experience_years: number;
  location: string;
  availability_status: 'available' | 'unavailable' | 'busy';
}

export const useNurses = () => {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNurses();
  }, []);

  const fetchNurses = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('available_nurses')
        .select('*')
        .order('full_name');

      if (error) {
        console.error('Error fetching nurses:', error);
        return;
      }

      setNurses(data || []);
    } catch (error) {
      console.error('Error fetching nurses:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateNurseAvailability = async (nurseId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('nurses')
        .update({ availability_status: status })
        .eq('id', nurseId);

      if (error) throw error;

      // Refresh nurses list
      await fetchNurses();
    } catch (error) {
      console.error('Error updating nurse availability:', error);
      throw error;
    }
  };

  return {
    nurses,
    loading,
    updateNurseAvailability,
    refetch: fetchNurses,
  };
};