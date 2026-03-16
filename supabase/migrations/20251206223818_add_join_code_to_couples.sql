/*
  # Add Join Code Feature

  1. Changes
    - Add `join_code` column to `couples` table
      - Type: text, nullable, unique
      - Used for partner invitation/linking
      - 6-character alphanumeric code (uppercase)
    
  2. Security
    - Add unique constraint to prevent duplicate codes
    - Add index for fast lookups during registration
  
  3. Notes
    - Codes are generated on-demand by users in Settings
    - Codes expire after use (set to null after partner joins)
    - Format: ABC123 (6 uppercase alphanumeric characters)
*/

-- Add join_code column to couples table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'join_code'
  ) THEN
    ALTER TABLE couples ADD COLUMN join_code text UNIQUE;
  END IF;
END $$;

-- Create index for fast join code lookups
CREATE INDEX IF NOT EXISTS idx_couples_join_code ON couples(join_code) WHERE join_code IS NOT NULL;