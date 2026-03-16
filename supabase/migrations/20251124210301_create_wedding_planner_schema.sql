/*
  # Wedding Planner Database Schema

  1. New Tables
    - `couples`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `partner1_name` (text)
      - `partner2_name` (text)
      - `wedding_date` (date)
      - `budget` (numeric)
      - `created_at` (timestamptz)
      
    - `tasks`
      - `id` (uuid, primary key)
      - `couple_id` (uuid, references couples)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `priority` (text)
      - `due_date` (date)
      - `completed` (boolean)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
      
    - `guests`
      - `id` (uuid, primary key)
      - `couple_id` (uuid, references couples)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `rsvp_status` (text)
      - `plus_one` (boolean)
      - `dietary_restrictions` (text)
      - `created_at` (timestamptz)
      
    - `vendors`
      - `id` (uuid, primary key)
      - `couple_id` (uuid, references couples)
      - `name` (text)
      - `category` (text)
      - `contact_name` (text)
      - `email` (text)
      - `phone` (text)
      - `cost` (numeric)
      - `paid` (boolean)
      - `notes` (text)
      - `created_at` (timestamptz)
      
    - `budget_items`
      - `id` (uuid, primary key)
      - `couple_id` (uuid, references couples)
      - `category` (text)
      - `item` (text)
      - `estimated_cost` (numeric)
      - `actual_cost` (numeric)
      - `paid` (boolean)
      - `created_at` (timestamptz)
      
    - `honeymoon_plans`
      - `id` (uuid, primary key)
      - `couple_id` (uuid, references couples)
      - `destination` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `budget` (numeric)
      - `notes` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own wedding data
*/

-- Create couples table
CREATE TABLE IF NOT EXISTS couples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  partner1_name text NOT NULL DEFAULT '',
  partner2_name text NOT NULL DEFAULT '',
  wedding_date date,
  budget numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE couples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own couple data"
  ON couples FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own couple data"
  ON couples FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own couple data"
  ON couples FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own couple data"
  ON couples FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT '',
  priority text DEFAULT 'medium',
  due_date date,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = tasks.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = tasks.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = tasks.couple_id
      AND couples.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = tasks.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = tasks.couple_id
      AND couples.user_id = auth.uid()
    )
  );

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  rsvp_status text DEFAULT 'pending',
  plus_one boolean DEFAULT false,
  dietary_restrictions text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own guests"
  ON guests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = guests.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own guests"
  ON guests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = guests.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own guests"
  ON guests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = guests.couple_id
      AND couples.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = guests.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own guests"
  ON guests FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = guests.couple_id
      AND couples.user_id = auth.uid()
    )
  );

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text DEFAULT '',
  contact_name text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  cost numeric DEFAULT 0,
  paid boolean DEFAULT false,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vendors"
  ON vendors FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = vendors.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own vendors"
  ON vendors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = vendors.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own vendors"
  ON vendors FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = vendors.couple_id
      AND couples.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = vendors.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own vendors"
  ON vendors FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = vendors.couple_id
      AND couples.user_id = auth.uid()
    )
  );

-- Create budget_items table
CREATE TABLE IF NOT EXISTS budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  category text DEFAULT '',
  item text NOT NULL,
  estimated_cost numeric DEFAULT 0,
  actual_cost numeric DEFAULT 0,
  paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budget items"
  ON budget_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = budget_items.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own budget items"
  ON budget_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = budget_items.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own budget items"
  ON budget_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = budget_items.couple_id
      AND couples.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = budget_items.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own budget items"
  ON budget_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = budget_items.couple_id
      AND couples.user_id = auth.uid()
    )
  );

-- Create honeymoon_plans table
CREATE TABLE IF NOT EXISTS honeymoon_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  destination text DEFAULT '',
  start_date date,
  end_date date,
  budget numeric DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE honeymoon_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own honeymoon plans"
  ON honeymoon_plans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = honeymoon_plans.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own honeymoon plans"
  ON honeymoon_plans FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = honeymoon_plans.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own honeymoon plans"
  ON honeymoon_plans FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = honeymoon_plans.couple_id
      AND couples.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = honeymoon_plans.couple_id
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own honeymoon plans"
  ON honeymoon_plans FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = honeymoon_plans.couple_id
      AND couples.user_id = auth.uid()
    )
  );