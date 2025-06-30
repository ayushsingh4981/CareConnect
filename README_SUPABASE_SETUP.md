# CareConnect Supabase Backend Setup

This document provides instructions for setting up the Supabase backend for the CareConnect nursing care appointment platform.

## 🚀 Quick Setup

### 1. Database Migrations

Run the following migrations in order in your Supabase SQL editor:

1. `001_create_profiles_table.sql` - Creates user profiles and auto-signup trigger
2. `002_create_nurses_table.sql` - Creates nurses table with specializations
3. `003_create_appointments_table.sql` - Creates appointments with RLS policies
4. `004_create_views_and_functions.sql` - Creates helper views and functions
5. `005_seed_sample_data.sql` - Creates indexes and sample data structure

### 2. Authentication Setup

The backend uses Supabase Auth with email/password authentication. When users sign up:

- A profile is automatically created in the `profiles` table
- The user's role is set based on signup data (default: 'user')
- Nurses get additional entries in the `nurses` table

### 3. Row Level Security (RLS)

All tables have RLS enabled with the following access patterns:

**Profiles:**
- Users can read/update their own profile
- Admins can read all profiles

**Nurses:**
- Nurses can read/update their own data
- Users can read available nurses
- Admins can manage all nurses

**Appointments:**
- Users can read/create their own appointments
- Nurses can read/update appointments assigned to them
- Admins can manage all appointments

## 📊 Database Schema

### Tables

1. **profiles** - User profile information
   - Links to `auth.users`
   - Stores role (user/nurse/admin)
   - Auto-created on signup

2. **nurses** - Nurse-specific information
   - Specialization, experience, location
   - Availability status
   - Links to profiles table

3. **appointments** - Appointment bookings
   - Links users to nurses
   - Date, time, notes, status
   - Status tracking (pending/approved/rejected/completed)

### Views

- **appointments_with_details** - Appointments with user/nurse names
- **available_nurses** - List of available nurses

### Functions

- **create_appointment()** - Create appointment with validation
- **update_appointment_status()** - Update appointment status
- **get_user_appointments()** - Get user's appointments
- **get_nurse_appointments()** - Get nurse's appointments

## 🔌 Frontend Integration

The frontend can use the provided React hooks:

```typescript
import { useAuth, useAppointments, useNurses } from '@/integrations/supabase/hooks';

// Authentication
const { user, profile, signIn, signUp, signOut } = useAuth();

// Appointments
const { appointments, createAppointment, updateAppointmentStatus } = useAppointments();

// Nurses
const { nurses, updateNurseAvailability } = useNurses();
```

## 🔐 Security Features

- **Row Level Security** on all tables
- **Role-based access control** (user/nurse/admin)
- **Input validation** in database functions
- **Automatic profile creation** on signup
- **Secure function execution** with SECURITY DEFINER

## 📝 API Endpoints

The backend exposes data through:

1. **Direct table access** via Supabase client (with RLS)
2. **Custom functions** for complex operations
3. **Views** for optimized queries
4. **Edge functions** for additional logic (if needed)

## 🧪 Testing

To test the backend:

1. Create test users with different roles
2. Sign up nurses and verify nurse table entries
3. Create appointments and test status updates
4. Verify RLS policies work correctly

## 🚀 Deployment

The backend is ready for production with:

- Proper indexing for performance
- RLS policies for security
- Error handling in functions
- Optimized queries through views

## 📞 Support

For issues with the backend setup:

1. Check Supabase logs for errors
2. Verify RLS policies are working
3. Test functions in SQL editor
4. Check authentication flow

The backend is designed to work seamlessly with the existing frontend without requiring any changes to the React components.