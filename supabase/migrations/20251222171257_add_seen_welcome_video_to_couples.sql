/*
  # Add Welcome Video Tracking to Couples Table

  1. Changes
    - Add `seen_welcome_video` column to `couples` table
      - Boolean field to track if user has viewed the welcome video
      - Defaults to false for new users
      - Set to false for existing users (they'll see the video on next dashboard visit)
  
  2. Notes
    - This enables showing a welcome video modal to first-time users on the Dashboard
    - Users can dismiss the modal, which will update this field to true
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'seen_welcome_video'
  ) THEN
    ALTER TABLE couples ADD COLUMN seen_welcome_video boolean DEFAULT false;
  END IF;
END $$;