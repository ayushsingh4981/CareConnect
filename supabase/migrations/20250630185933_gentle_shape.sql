/*
  # Create nurses table

  1. New Tables
    - `nurses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles.id)
      - `specialization` (text)
      - `experience_years` (integer)
      - `location` (text)
      - `availability_status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `nurses` table
    - Add policies for nurses to read/update their own data
    - Add policy for users to read available nurses
    - Add policy for admins to manage all nurses
*/

CREATE TABLE IF NOT EXISTS nurses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  specialization text NOT NULL DEFAULT 'General Care',
  experience_years integer DEFAULT 0,
  location text DEFAULT '',
  availability_status text DEFAULT 'available' CHECK (availability_status IN ('available', 'unavailable', 'busy')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE nurses ENABLE ROW LEVEL SECURITY;

-- Nurses can read and update their own data
CREATE POLICY "Nurses can read own data"
  ON nurses
  FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Nurses can update own data"
  ON nurses
  FOR UPDATE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Users can read available nurses for booking
CREATE POLICY "Users can read available nurses"
  ON nurses
  FOR SELECT
  TO authenticated
  USING (availability_status = 'available');

-- Admins can manage all nurses
CREATE POLICY "Admins can read all nurses"
  ON nurses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert nurses"
  ON nurses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all nurses"
  ON nurses
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete nurses"
  ON nurses
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_nurses_updated_at
  BEFORE UPDATE ON nurses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();