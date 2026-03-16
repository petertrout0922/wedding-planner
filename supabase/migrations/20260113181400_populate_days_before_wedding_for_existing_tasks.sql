/*
  # Populate days_before_wedding for existing tasks

  1. Changes
    - Calculate and populate `days_before_wedding` for all existing tasks
      - Uses the couple's wedding_date and the task's due_date to calculate the value
      - This allows tasks to automatically recalculate when the wedding date changes
    - Set `is_manual_date` to false for all existing system-generated tasks
      - This enables automatic date recalculation for these tasks
  
  2. Notes
    - Only updates tasks that currently have days_before_wedding = 0 and is_manual_date = true
    - This preserves any tasks that users may have manually updated since the feature was added
    - Calculation: days_before_wedding = (wedding_date - due_date) in days
*/

UPDATE tasks
SET 
  days_before_wedding = (
    SELECT (couples.wedding_date - tasks.due_date)
    FROM couples
    WHERE couples.id = tasks.couple_id
  ),
  is_manual_date = false
WHERE 
  days_before_wedding = 0 
  AND is_manual_date = true
  AND EXISTS (
    SELECT 1 FROM couples 
    WHERE couples.id = tasks.couple_id 
    AND couples.wedding_date IS NOT NULL
  );