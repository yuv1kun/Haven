/*
  # Initial Schema Setup for Haven Platform

  1. New Tables
    - `profiles`
      - Extended user profile information
      - Linked to auth.users via user_id
      - Includes name, avatar_url, and role
    
    - `sensors`
      - IoT sensor information and readings
      - Includes location, type, and status
    
    - `alerts`
      - Disaster alerts and notifications
      - Includes type, severity, and location
    
    - `resources`
      - Emergency resources and inventory
      - Includes type, quantity, and location
    
    - `reports`
      - User-submitted emergency reports
      - Includes description, location, and status
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for specific roles (admin, responder)
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text,
  avatar_url text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'responder', 'admin')),
  phone_number text,
  location jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create sensors table
CREATE TABLE IF NOT EXISTS sensors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('earthquake', 'flood', 'fire')),
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  last_reading jsonb,
  battery_level integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('earthquake', 'flood', 'fire')),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  description text NOT NULL,
  sensor_id uuid REFERENCES sensors(id),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  status text DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved'))
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('medical', 'rescue', 'food', 'shelter', 'transport')),
  quantity integer NOT NULL DEFAULT 0,
  status text DEFAULT 'available' CHECK (status IN ('available', 'deployed', 'maintenance')),
  location jsonb,
  assigned_to uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('emergency', 'damage', 'resource_request')),
  description text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  images text[],
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved')),
  assigned_to uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Sensors Policies
CREATE POLICY "Sensors are viewable by all authenticated users"
  ON sensors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify sensors"
  ON sensors
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Alerts Policies
CREATE POLICY "Alerts are viewable by all authenticated users"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Responders and admins can create alerts"
  ON alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role IN ('responder', 'admin')
    )
  );

-- Resources Policies
CREATE POLICY "Resources are viewable by all authenticated users"
  ON resources
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify resources"
  ON resources
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Reports Policies
CREATE POLICY "Reports are viewable by all authenticated users"
  ON reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS sensors_type_idx ON sensors (type);
CREATE INDEX IF NOT EXISTS sensors_status_idx ON sensors (status);
CREATE INDEX IF NOT EXISTS alerts_type_idx ON alerts (type);
CREATE INDEX IF NOT EXISTS alerts_severity_idx ON alerts (severity);
CREATE INDEX IF NOT EXISTS alerts_status_idx ON alerts (status);
CREATE INDEX IF NOT EXISTS resources_type_idx ON resources (type);
CREATE INDEX IF NOT EXISTS resources_status_idx ON resources (status);
CREATE INDEX IF NOT EXISTS reports_type_idx ON reports (type);
CREATE INDEX IF NOT EXISTS reports_status_idx ON reports (status);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sensors_updated_at
  BEFORE UPDATE ON sensors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();