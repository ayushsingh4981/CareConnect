
import React from 'react';
import { useAuthStore } from '../store/authStore';
import { UserDashboard } from '../components/dashboard/UserDashboard';
import { NurseDashboard } from '../components/dashboard/NurseDashboard';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'user':
        return <UserDashboard />;
      case 'nurse':
        return <NurseDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="md:pl-64 pt-16">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {renderDashboard()}
        </div>
      </main>
    </div>
  );
};
