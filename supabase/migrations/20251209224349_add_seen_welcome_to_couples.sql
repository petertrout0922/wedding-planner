/*
  # Add Welcome Tracking to Couples Table

  1. Changes
    - Add `seen_welcome` boolean column to `couples` table
      - Defaults to `false` to trigger welcome on first login
      - Used to track if user has seen the welcome avatar
  
  2. Purpose
    - Track whether a couple has seen the welcome avatar
    - Ensure welcome only shows once per couple account
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'seen_welcome'
  ) THEN
    ALTER TABLE couples ADD COLUMN seen_welcome boolean DEFAULT false;
  END IF;
END $$;