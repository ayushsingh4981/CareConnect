
import { Appointment, Nurse } from '../types';

export const mockNurses: Nurse[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@careconnect.com',
    specialization: 'Pediatric Care',
    experience: 5,
    available: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@careconnect.com',
    specialization: 'Geriatric Care',
    experience: 8,
    available: true
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@careconnect.com',
    specialization: 'Home Health',
    experience: 3,
    available: true
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@careconnect.com',
    specialization: 'Critical Care',
    experience: 10,
    available: false
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    nurseId: '1',
    nurseName: 'Sarah Johnson',
    date: '2024-01-15',
    time: '10:00',
    notes: 'Regular checkup and medication review',
    status: 'pending',
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    userName: 'John Doe',
    nurseId: '2',
    nurseName: 'Michael Chen',
    date: '2024-01-20',
    time: '14:30',
    notes: 'Physical therapy session',
    status: 'approved',
    createdAt: '2024-01-08T15:30:00Z'
  },
  {
    id: '3',
    userId: '5',
    userName: 'Alice Brown',
    nurseId: '1',
    nurseName: 'Sarah Johnson',
    date: '2024-01-18',
    time: '09:00',
    notes: 'Wound care and dressing change',
    status: 'completed',
    createdAt: '2024-01-05T09:00:00Z'
  }
];
