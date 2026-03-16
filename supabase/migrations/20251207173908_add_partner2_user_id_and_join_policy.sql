/*
  # Add Partner2 User ID and Join Policy

  1. Schema Changes
    - Add `partner2_user_id` column to couples table
      - Type: uuid, nullable, references auth.users
      - Stores the auth user ID of the second partner
      - Allows both partners to have their own login credentials
  
  2. Policy Changes
    - Add RLS policy to allow partner2 to join via join code
    - Add RLS policies for partner2 to access their couple data
  
  3. Security Notes
    - Join policy only works when join_code exists and partner2_user_id is NULL
    - After joining, partner2 can access the couple data
    - Both partners have equal access to wedding data
*/

-- Add partner2_user_id column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'partner2_user_id'
  ) THEN
    ALTER TABLE couples ADD COLUMN partner2_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add policy to allow partner joining via join code
CREATE POLICY "Users can join couple via join code"
  ON couples FOR UPDATE
  TO authenticated
  USING (
    join_code IS NOT NULL
    AND partner2_user_id IS NULL
  )
  WITH CHECK (
    partner2_user_id = auth.uid()
  );

-- Add policy for partner2 to view couple data
CREATE POLICY "Partner2 can view couple data"
  ON couples FOR SELECT
  TO authenticated
  USING (auth.uid() = partner2_user_id);

-- Add policy for partner2 to update couple data
CREATE POLICY "Partner2 can update couple data"
  ON couples FOR UPDATE
  TO authenticated
  USING (auth.uid() = partner2_user_id)
  WITH CHECK (auth.uid() = partner2_user_id OR auth.uid() = user_id);

-- Update task policies to include partner2
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = tasks.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = tasks.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = tasks.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;
CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = tasks.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

-- Update guest policies to include partner2
DROP POLICY IF EXISTS "Users can view own guests" ON guests;
CREATE POLICY "Users can view own guests"
  ON guests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = guests.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own guests" ON guests;
CREATE POLICY "Users can insert own guests"
  ON guests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = guests.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own guests" ON guests;
CREATE POLICY "Users can update own guests"
  ON guests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = guests.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete own guests" ON guests;
CREATE POLICY "Users can delete own guests"
  ON guests FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = guests.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

-- Update vendor policies to include partner2
DROP POLICY IF EXISTS "Users can view own vendors" ON vendors;
CREATE POLICY "Users can view own vendors"
  ON vendors FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = vendors.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own vendors" ON vendors;
CREATE POLICY "Users can insert own vendors"
  ON vendors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = vendors.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own vendors" ON vendors;
CREATE POLICY "Users can update own vendors"
  ON vendors FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = vendors.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete own vendors" ON vendors;
CREATE POLICY "Users can delete own vendors"
  ON vendors FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = vendors.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

-- Update budget_items policies to include partner2
DROP POLICY IF EXISTS "Users can view own budget items" ON budget_items;
CREATE POLICY "Users can view own budget items"
  ON budget_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = budget_items.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own budget items" ON budget_items;
CREATE POLICY "Users can insert own budget items"
  ON budget_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = budget_items.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own budget items" ON budget_items;
CREATE POLICY "Users can update own budget items"
  ON budget_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = budget_items.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete own budget items" ON budget_items;
CREATE POLICY "Users can delete own budget items"
  ON budget_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = budget_items.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

-- Update honeymoon_plans policies to include partner2
DROP POLICY IF EXISTS "Users can view own honeymoon plans" ON honeymoon_plans;
CREATE POLICY "Users can view own honeymoon plans"
  ON honeymoon_plans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = honeymoon_plans.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own honeymoon plans" ON honeymoon_plans;
CREATE POLICY "Users can insert own honeymoon plans"
  ON honeymoon_plans FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = honeymoon_plans.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own honeymoon plans" ON honeymoon_plans;
CREATE POLICY "Users can update own honeymoon plans"
  ON honeymoon_plans FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = honeymoon_plans.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete own honeymoon plans" ON honeymoon_plans;
CREATE POLICY "Users can delete own honeymoon plans"
  ON honeymoon_plans FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = honeymoon_plans.couple_id
      AND (couples.user_id = auth.uid() OR couples.partner2_user_id = auth.uid())
    )
  );