/*
  # Add Budget Fields to Tasks Table

  1. Changes
    - Add `budget_allocated` column to store the budgeted amount for the task
    - Add `budget_actual` column to store the actual/committed amount spent
    - Add `paid_to_date` column to track how much has been paid so far
    - Add `deposit_amount` column to track deposit payments
    - Add `deposit_date` column to track when deposit was paid
    - Add `balance_due` column to track remaining balance
    - Add `payment_status` column to track payment state
    - Add `vendor` column to link task to vendor name
    - Add `assigned_to` column to track who is responsible

  2. Notes
    - All budget fields use numeric type for precision
    - Default values set to 0 for numeric fields
    - Fields are nullable to support tasks without budget tracking
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'budget_allocated'
  ) THEN
    ALTER TABLE tasks ADD COLUMN budget_allocated numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'budget_actual'
  ) THEN
    ALTER TABLE tasks ADD COLUMN budget_actual numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'paid_to_date'
  ) THEN
    ALTER TABLE tasks ADD COLUMN paid_to_date numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'deposit_amount'
  ) THEN
    ALTER TABLE tasks ADD COLUMN deposit_amount numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'deposit_date'
  ) THEN
    ALTER TABLE tasks ADD COLUMN deposit_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'balance_due'
  ) THEN
    ALTER TABLE tasks ADD COLUMN balance_due numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE tasks ADD COLUMN payment_status text DEFAULT 'Not Paid';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'vendor'
  ) THEN
    ALTER TABLE tasks ADD COLUMN vendor text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'assigned_to'
  ) THEN
    ALTER TABLE tasks ADD COLUMN assigned_to text;
  END IF;
END $$;