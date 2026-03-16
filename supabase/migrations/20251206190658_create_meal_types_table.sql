/*
  # Create meal_types table

  1. New Tables
    - `meal_types`
      - `id` (uuid, primary key)
      - `couple_id` (uuid, foreign key to couples)
      - `name` (text) - Name of the meal type
      - `display_order` (integer) - Order in which meal types appear
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `meal_types` table
    - Add policy for authenticated users to read their own meal types
    - Add policy for authenticated users to insert their own meal types
    - Add policy for authenticated users to update their own meal types
    - Add policy for authenticated users to delete their own meal types

  3. Important Notes
    - Each couple can have up to 10 meal types
    - Default meal types will be created for new couples
    - Meal types are ordered by display_order field
*/

CREATE TABLE IF NOT EXISTS meal_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE meal_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own meal types"
  ON meal_types
  FOR SELECT
  TO authenticated
  USING (
    couple_id IN (
      SELECT id FROM couples WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own meal types"
  ON meal_types
  FOR INSERT
  TO authenticated
  WITH CHECK (
    couple_id IN (
      SELECT id FROM couples WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own meal types"
  ON meal_types
  FOR UPDATE
  TO authenticated
  USING (
    couple_id IN (
      SELECT id FROM couples WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    couple_id IN (
      SELECT id FROM couples WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own meal types"
  ON meal_types
  FOR DELETE
  TO authenticated
  USING (
    couple_id IN (
      SELECT id FROM couples WHERE user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS meal_types_couple_id_idx ON meal_types(couple_id);
CREATE INDEX IF NOT EXISTS meal_types_display_order_idx ON meal_types(couple_id, display_order);