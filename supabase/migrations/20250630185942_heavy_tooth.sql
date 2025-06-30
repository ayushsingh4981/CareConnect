/*
  # Create appointments table

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles.id)
      - `nurse_id` (uuid, foreign key to profiles.id)
      - `appointment_date` (date)
      - `appointment_time` (text)
      - `notes` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `appointments` table
    - Add policies for users to manage their own appointments
    - Add policies for nurses to view their assigned appointments
    - Add policies for admins to manage all appointments
*/

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  nurse_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  notes text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Users can read and create their own appointments
CREATE POLICY "Users can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Nurses can read appointments assigned to them
CREATE POLICY "Nurses can read assigned appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    nurse_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'nurse'
    )
  );

-- Nurses can update status of their assigned appointments
CREATE POLICY "Nurses can update assigned appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (
    nurse_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'nurse'
    )
  );

-- Admins can manage all appointments
CREATE POLICY "Admins can read all appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete appointments"
  ON appointments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_nurse_id ON appointments(nurse_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);