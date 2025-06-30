import { useEffect, useState } from 'react';
import { supabase } from '../client';
import { useAuth } from './useAuth';

interface Appointment {
  id: string;
  user_id: string;
  nurse_id: string;
  appointment_date: string;
  appointment_time: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
}

interface AppointmentWithDetails extends Appointment {
  user_name: string;
  nurse_name: string;
  specialization?: string;
  experience_years?: number;
}

export const useAppointments = () => {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchAppointments();
    }
  }, [user, profile]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('appointments_with_details')
        .select('*')
        .order('appointment_date', { ascending: false });

      // Filter based on user role
      if (profile?.role === 'user') {
        query = query.eq('user_auth_id', user?.id);
      } else if (profile?.role === 'nurse') {
        query = query.eq('nurse_auth_id', user?.id);
      }
      // Admin can see all appointments (no filter)

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (
    nurseProfileId: string,
    appointmentDate: string,
    appointmentTime: string,
    notes: string = ''
  ) => {
    try {
      const { data, error } = await supabase.rpc('create_appointment', {
        nurse_profile_id: nurseProfileId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        notes: notes,
      });

      if (error) throw error;

      // Refresh appointments
      await fetchAppointments();
      
      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { data, error } = await supabase.rpc('update_appointment_status', {
        appointment_id: appointmentId,
        new_status: status,
      });

      if (error) throw error;

      // Refresh appointments
      await fetchAppointments();
      
      return data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  };

  return {
    appointments,
    loading,
    createAppointment,
    updateAppointmentStatus,
    refetch: fetchAppointments,
  };
};