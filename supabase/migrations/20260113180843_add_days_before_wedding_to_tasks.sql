/*
  # Add date tracking fields to tasks table

  1. Changes
    - Add `days_before_wedding` column to tasks table
      - Stores the number of days before the wedding this task is due
      - Used to automatically recalculate due dates when wedding date changes
      - Defaults to 0 for existing tasks
    - Add `is_manual_date` column to tasks table
      - Tracks whether the user manually set the due date
      - If true, the due date will not be automatically recalculated
      - Defaults to true for existing tasks (to preserve current behavior)

  2. Notes
    - Existing tasks will have `is_manual_date` set to true to prevent unexpected date changes
    - New tasks created by the system will have proper values set
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'days_before_wedding'
  ) THEN
    ALTER TABLE tasks ADD COLUMN days_before_wedding integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'is_manual_date'
  ) THEN
    ALTER TABLE tasks ADD COLUMN is_manual_date boolean DEFAULT true;
  END IF;
END $$;