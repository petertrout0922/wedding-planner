/*
  # Add Registration Fields to Couples Table

  1. Changes to `couples` Table
    - Add `partner1_first_name` (text) - Bride's first name
    - Add `partner1_last_name` (text) - Bride's last name
    - Add `partner1_email` (text) - Bride's email address
    - Add `partner2_first_name` (text) - Groom's first name
    - Add `partner2_last_name` (text) - Groom's last name
    - Add `partner2_email` (text) - Groom's email address
    - Add `wedding_type` (text) - Type of wedding selected
    - Keep existing `partner1_name` and `partner2_name` for backward compatibility
  
  2. Notes
    - All new fields have default values to ensure safe migration
    - No data is lost from existing schema
    - Fields can be updated through the application after registration
*/

-- Add new columns to couples table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'partner1_first_name'
  ) THEN
    ALTER TABLE couples ADD COLUMN partner1_first_name text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'partner1_last_name'
  ) THEN
    ALTER TABLE couples ADD COLUMN partner1_last_name text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'partner1_email'
  ) THEN
    ALTER TABLE couples ADD COLUMN partner1_email text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'partner2_first_name'
  ) THEN
    ALTER TABLE couples ADD COLUMN partner2_first_name text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'partner2_last_name'
  ) THEN
    ALTER TABLE couples ADD COLUMN partner2_last_name text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'partner2_email'
  ) THEN
    ALTER TABLE couples ADD COLUMN partner2_email text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'wedding_type'
  ) THEN
    ALTER TABLE couples ADD COLUMN wedding_type text DEFAULT '';
  END IF;
END $$;
