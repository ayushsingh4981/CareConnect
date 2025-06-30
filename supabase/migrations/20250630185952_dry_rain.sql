/*
  # Create views and functions for easier data access

  1. Views
    - `appointments_with_details` - Join appointments with user and nurse details
    - `available_nurses` - List of available nurses with their details

  2. Functions
    - `get_user_appointments` - Get appointments for current user
    - `get_nurse_appointments` - Get appointments for current nurse
    - `create_appointment` - Create new appointment with validation
    - `update_appointment_status` - Update appointment status
*/

-- Create view for appointments with user and nurse details
CREATE OR REPLACE VIEW appointments_with_details AS
SELECT 
  a.id,
  a.appointment_date,
  a.appointment_time,
  a.notes,
  a.status,
  a.created_at,
  a.updated_at,
  u.full_name as user_name,
  u.user_id as user_auth_id,
  n.full_name as nurse_name,
  n.user_id as nurse_auth_id,
  nurse_data.specialization,
  nurse_data.experience_years
FROM appointments a
JOIN profiles u ON a.user_id = u.id
JOIN profiles n ON a.nurse_id = n.id
LEFT JOIN nurses nurse_data ON n.id = nurse_data.user_id;

-- Create view for available nurses
CREATE OR REPLACE VIEW available_nurses AS
SELECT 
  p.id,
  p.full_name,
  n.specialization,
  n.experience_years,
  n.location,
  n.availability_status
FROM profiles p
JOIN nurses n ON p.id = n.user_id
WHERE p.role = 'nurse' AND n.availability_status = 'available';

-- Function to get appointments for current user
CREATE OR REPLACE FUNCTION get_user_appointments()
RETURNS TABLE (
  id uuid,
  appointment_date date,
  appointment_time text,
  notes text,
  status text,
  nurse_name text,
  specialization text,
  created_at timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.appointment_date,
    a.appointment_time,
    a.notes,
    a.status,
    n.full_name as nurse_name,
    nurse_data.specialization,
    a.created_at
  FROM appointments a
  JOIN profiles u ON a.user_id = u.id
  JOIN profiles n ON a.nurse_id = n.id
  LEFT JOIN nurses nurse_data ON n.id = nurse_data.user_id
  WHERE u.user_id = auth.uid()
  ORDER BY a.appointment_date DESC, a.appointment_time DESC;
END;
$$;

-- Function to get appointments for current nurse
CREATE OR REPLACE FUNCTION get_nurse_appointments()
RETURNS TABLE (
  id uuid,
  appointment_date date,
  appointment_time text,
  notes text,
  status text,
  user_name text,
  created_at timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.appointment_date,
    a.appointment_time,
    a.notes,
    a.status,
    u.full_name as user_name,
    a.created_at
  FROM appointments a
  JOIN profiles u ON a.user_id = u.id
  JOIN profiles n ON a.nurse_id = n.id
  WHERE n.user_id = auth.uid()
  ORDER BY a.appointment_date ASC, a.appointment_time ASC;
END;
$$;

-- Function to create appointment with validation
CREATE OR REPLACE FUNCTION create_appointment(
  nurse_profile_id uuid,
  appointment_date date,
  appointment_time text,
  notes text DEFAULT ''
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile_id uuid;
  appointment_id uuid;
  nurse_available boolean;
BEGIN
  -- Get current user's profile id
  SELECT id INTO user_profile_id
  FROM profiles
  WHERE user_id = auth.uid();
  
  IF user_profile_id IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  -- Check if nurse is available
  SELECT (n.availability_status = 'available') INTO nurse_available
  FROM nurses n
  JOIN profiles p ON n.user_id = p.id
  WHERE p.id = nurse_profile_id;
  
  IF NOT nurse_available THEN
    RAISE EXCEPTION 'Selected nurse is not available';
  END IF;
  
  -- Check for appointment date in the past
  IF appointment_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Cannot book appointments in the past';
  END IF;
  
  -- Create the appointment
  INSERT INTO appointments (user_id, nurse_id, appointment_date, appointment_time, notes)
  VALUES (user_profile_id, nurse_profile_id, appointment_date, appointment_time, notes)
  RETURNING id INTO appointment_id;
  
  RETURN appointment_id;
END;
$$;

-- Function to update appointment status (for admins and nurses)
CREATE OR REPLACE FUNCTION update_appointment_status(
  appointment_id uuid,
  new_status text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
  is_assigned_nurse boolean := false;
BEGIN
  -- Get current user's role
  SELECT role INTO user_role
  FROM profiles
  WHERE user_id = auth.uid();
  
  -- Check if user is the assigned nurse
  SELECT EXISTS(
    SELECT 1 FROM appointments a
    JOIN profiles p ON a.nurse_id = p.id
    WHERE a.id = appointment_id AND p.user_id = auth.uid()
  ) INTO is_assigned_nurse;
  
  -- Only admins or assigned nurses can update status
  IF user_role != 'admin' AND NOT is_assigned_nurse THEN
    RAISE EXCEPTION 'Insufficient permissions to update appointment status';
  END IF;
  
  -- Validate status
  IF new_status NOT IN ('pending', 'approved', 'rejected', 'completed') THEN
    RAISE EXCEPTION 'Invalid status value';
  END IF;
  
  -- Update the appointment
  UPDATE appointments
  SET status = new_status, updated_at = now()
  WHERE id = appointment_id;
  
  RETURN FOUND;
END;
$$;