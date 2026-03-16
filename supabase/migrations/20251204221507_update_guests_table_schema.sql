/*
  # Update guests table schema

  1. Changes to `guests` table
    - Add `first_name` (text) - Guest's first name
    - Add `last_name` (text) - Guest's last name  
    - Add `address` (text) - Guest's mailing address
    - Add `category` (text) - Guest category (Family, Friends, etc.)
    - Add `response_date` (timestamptz) - Date guest responded to invitation
    - Add `plus_one_allowed` (boolean) - Whether guest can bring a plus one
    - Add `plus_one_name` (text) - Name of guest's plus one
    - Add `number_in_party` (integer) - Total number of people in this invitation (default 1)
    - Add `meal_choice` (text) - Guest's meal selection
    - Add `plus_one_meal_choice` (text) - Plus one's meal selection
    - Add `table_number` (integer) - Assigned table number
    - Add `special_notes` (text) - Special notes about the guest
    - Add `gift_received` (boolean) - Whether a gift was received
    - Add `thank_you_sent` (boolean) - Whether thank you note was sent
    - Remove old `name` field (will be replaced by first_name/last_name)
    - Update `rsvp_status` to use correct values ('Not Sent', 'Invited', 'Confirmed', 'Declined', 'Maybe')

  2. Important Notes
    - The `number_in_party` field is critical for accurate guest counts
    - It represents the total number of people covered by one invitation
    - All statistics should sum this field, not count records
*/

-- Add new columns to guests table
DO $$
BEGIN
  -- Add first_name if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE guests ADD COLUMN first_name text DEFAULT '';
  END IF;

  -- Add last_name if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE guests ADD COLUMN last_name text DEFAULT '';
  END IF;

  -- Add address if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'address'
  ) THEN
    ALTER TABLE guests ADD COLUMN address text DEFAULT '';
  END IF;

  -- Add category if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'category'
  ) THEN
    ALTER TABLE guests ADD COLUMN category text DEFAULT '';
  END IF;

  -- Add response_date if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'response_date'
  ) THEN
    ALTER TABLE guests ADD COLUMN response_date timestamptz;
  END IF;

  -- Add plus_one_allowed if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'plus_one_allowed'
  ) THEN
    ALTER TABLE guests ADD COLUMN plus_one_allowed boolean DEFAULT false;
  END IF;

  -- Add plus_one_name if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'plus_one_name'
  ) THEN
    ALTER TABLE guests ADD COLUMN plus_one_name text DEFAULT '';
  END IF;

  -- Add number_in_party if it doesn't exist (critical for accurate counts)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'number_in_party'
  ) THEN
    ALTER TABLE guests ADD COLUMN number_in_party integer DEFAULT 1;
  END IF;

  -- Add meal_choice if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'meal_choice'
  ) THEN
    ALTER TABLE guests ADD COLUMN meal_choice text DEFAULT '';
  END IF;

  -- Add plus_one_meal_choice if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'plus_one_meal_choice'
  ) THEN
    ALTER TABLE guests ADD COLUMN plus_one_meal_choice text DEFAULT '';
  END IF;

  -- Add table_number if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'table_number'
  ) THEN
    ALTER TABLE guests ADD COLUMN table_number integer;
  END IF;

  -- Add special_notes if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'special_notes'
  ) THEN
    ALTER TABLE guests ADD COLUMN special_notes text DEFAULT '';
  END IF;

  -- Add gift_received if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'gift_received'
  ) THEN
    ALTER TABLE guests ADD COLUMN gift_received boolean DEFAULT false;
  END IF;

  -- Add thank_you_sent if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'thank_you_sent'
  ) THEN
    ALTER TABLE guests ADD COLUMN thank_you_sent boolean DEFAULT false;
  END IF;
END $$;

-- Migrate existing data from 'name' field to first_name if name exists and first_name is empty
UPDATE guests 
SET first_name = name 
WHERE name IS NOT NULL AND name != '' AND (first_name IS NULL OR first_name = '');

-- Drop the old 'name' column if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guests' AND column_name = 'name'
  ) THEN
    ALTER TABLE guests DROP COLUMN name;
  END IF;
END $$;