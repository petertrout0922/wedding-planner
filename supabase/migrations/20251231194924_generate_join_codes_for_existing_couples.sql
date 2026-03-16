/*
  # Generate Join Codes for Existing Couples

  1. Changes
    - Generate and assign join codes to all couples that don't have one
    - Ensures all existing couples can invite their partners
    
  2. Implementation
    - Uses a PL/pgSQL function to generate random 6-character codes
    - Only updates couples where join_code is NULL
    - Ensures uniqueness by checking against existing codes
    
  3. Notes
    - This is a one-time migration to backfill existing data
    - New couples will automatically get join codes during registration
*/

-- Function to generate a random 6-character join code
CREATE OR REPLACE FUNCTION generate_unique_join_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer;
  code_exists boolean;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..6 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM couples WHERE join_code = result) INTO code_exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN result;
END;
$$;

-- Update all couples that don't have a join code
-- Only update if they don't have a partner2_user_id (haven't been joined yet)
UPDATE couples
SET join_code = generate_unique_join_code()
WHERE join_code IS NULL
  AND partner2_user_id IS NULL;

-- Drop the temporary function
DROP FUNCTION IF EXISTS generate_unique_join_code();