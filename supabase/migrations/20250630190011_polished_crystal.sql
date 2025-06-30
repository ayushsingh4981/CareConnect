/*
  # Seed sample data for development

  1. Sample Data
    - Create sample nurse profiles
    - Create sample appointments
    - Set up test users with different roles
*/

-- Insert sample nurse profiles (these will be created when nurses sign up)
-- This is just for reference - actual data will be created through the signup process

-- Sample nurses data that can be inserted after nurse users are created
DO $$
DECLARE
  nurse1_profile_id uuid;
  nurse2_profile_id uuid;
  nurse3_profile_id uuid;
BEGIN
  -- Note: These inserts will only work if the corresponding auth users exist
  -- In production, nurses will sign up through the frontend and this data will be created automatically
  
  -- You can uncomment and modify these if you want to create sample data
  -- Make sure to create the auth users first through Supabase Auth
  
  /*
  -- Get profile IDs for sample nurses (replace with actual profile IDs)
  SELECT id INTO nurse1_profile_id FROM profiles WHERE full_name = 'Sarah Johnson' LIMIT 1;
  SELECT id INTO nurse2_profile_id FROM profiles WHERE full_name = 'Michael Chen' LIMIT 1;
  SELECT id INTO nurse3_profile_id FROM profiles WHERE full_name = 'Emily Rodriguez' LIMIT 1;
  
  -- Insert nurse details if profiles exist
  IF nurse1_profile_id IS NOT NULL THEN
    INSERT INTO nurses (user_id, specialization, experience_years, location, availability_status)
    VALUES (nurse1_profile_id, 'Pediatric Care', 5, 'Downtown Medical Center', 'available')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  IF nurse2_profile_id IS NOT NULL THEN
    INSERT INTO nurses (user_id, specialization, experience_years, location, availability_status)
    VALUES (nurse2_profile_id, 'Geriatric Care', 8, 'Community Health Center', 'available')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  IF nurse3_profile_id IS NOT NULL THEN
    INSERT INTO nurses (user_id, specialization, experience_years, location, availability_status)
    VALUES (nurse3_profile_id, 'Home Health', 3, 'Mobile Care Unit', 'available')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  */
  
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_nurses_availability ON nurses(availability_status);
CREATE INDEX IF NOT EXISTS idx_nurses_specialization ON nurses(specialization);