
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FormInput } from '../components/ui/FormInput';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { mockNurses } from '../data/mockData';
import { useAuthStore } from '../store/authStore';
import { BookingFormData } from '../types';
import { Label } from '../components/ui/label';
import toast from 'react-hot-toast';

export const BookAppointment: React.FC = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    nurseId: '',
    date: '',
    time: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const availableNurses = mockNurses.filter(nurse => nurse.available);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nurseId) {
      newErrors.nurseId = 'Please select a nurse';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Please select a future date';
      }
    }
    
    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Appointment booked successfully! Waiting for approval.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="md:pl-64 pt-16">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>
            <p className="text-gray-600">Schedule your nursing care appointment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Select Nurse <span className="text-red-500">*</span>
                      </Label>
                      <select
                        value={formData.nurseId}
                        onChange={(e) => setFormData(prev => ({ ...prev, nurseId: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.nurseId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Choose a nurse</option>
                        {availableNurses.map((nurse) => (
                          <option key={nurse.id} value={nurse.id}>
                            {nurse.name} - {nurse.specialization}
                          </option>
                        ))}
                      </select>
                      {errors.nurseId && <p className="text-sm text-red-500">{errors.nurseId}</p>}
                    </div>

                    <FormInput
                      label="Appointment Date"
                      type="date"
                      value={formData.date}
                      onChange={(value) => setFormData(prev => ({ ...prev, date: value }))}
                      required
                      error={errors.date}
                    />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Appointment Time <span className="text-red-500">*</span>
                      </Label>
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.time ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select time</option>
                        {getTimeSlots().map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Additional Notes
                      </Label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any specific requirements or health concerns..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <LoadingSpinner size="sm" />
                            <span>Booking...</span>
                          </div>
                        ) : (
                          'Book Appointment'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Available Nurses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availableNurses.map((nurse) => (
                      <div
                        key={nurse.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          formData.nurseId === nurse.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, nurseId: nurse.id }))}
                      >
                        <h4 className="font-medium text-gray-900">{nurse.name}</h4>
                        <p className="text-sm text-gray-600">{nurse.specialization}</p>
                        <p className="text-sm text-gray-500">{nurse.experience} years experience</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
