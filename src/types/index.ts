
export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  nurseId: string;
  nurseName: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
}

export interface Nurse {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  available: boolean;
}

export interface BookingFormData {
  nurseId: string;
  date: string;
  time: string;
  notes: string;
}
