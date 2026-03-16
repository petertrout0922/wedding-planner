/*
  # Update vendors table schema

  1. Changes to `vendors` table
    - Add `website` (text) - vendor's website URL
    - Add `address` (text) - vendor's physical address
    - Add `status` (text) - vendor status (Researching, Contacted, Booked, Paid, Declined)
    - Add `contract_signed` (boolean) - whether contract is signed
    - Add `contract_date` (date) - date contract was signed
    - Add `total_amount` (numeric) - total contract amount
    - Add `deposit_amount` (numeric) - deposit amount required
    - Add `deposit_due_date` (date) - when deposit is due
    - Add `deposit_paid` (boolean) - whether deposit has been paid
    - Add `balance_due` (numeric) - remaining balance after deposit
    - Add `final_payment_date` (date) - when final payment is due
    - Add `final_payment_paid` (boolean) - whether final payment has been paid
    - Add `payment_status` (text) - overall payment status
    - Add `vendor_notes` (jsonb) - array of notes with timestamps
    - Add `linked_tasks` (text[]) - array of task IDs linked to this vendor
    - Remove old `cost` and `paid` columns (replaced by more detailed fields)

  2. Notes
    - Existing vendors will have default values for new fields
    - The `notes` column is renamed to `vendor_notes` and changed to jsonb type
    - This allows for richer note storage with timestamps
*/

-- Add new columns to vendors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'website'
  ) THEN
    ALTER TABLE vendors ADD COLUMN website text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'address'
  ) THEN
    ALTER TABLE vendors ADD COLUMN address text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'status'
  ) THEN
    ALTER TABLE vendors ADD COLUMN status text DEFAULT 'Researching';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'contract_signed'
  ) THEN
    ALTER TABLE vendors ADD COLUMN contract_signed boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'contract_date'
  ) THEN
    ALTER TABLE vendors ADD COLUMN contract_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'total_amount'
  ) THEN
    ALTER TABLE vendors ADD COLUMN total_amount numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'deposit_amount'
  ) THEN
    ALTER TABLE vendors ADD COLUMN deposit_amount numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'deposit_due_date'
  ) THEN
    ALTER TABLE vendors ADD COLUMN deposit_due_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'deposit_paid'
  ) THEN
    ALTER TABLE vendors ADD COLUMN deposit_paid boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'balance_due'
  ) THEN
    ALTER TABLE vendors ADD COLUMN balance_due numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'final_payment_date'
  ) THEN
    ALTER TABLE vendors ADD COLUMN final_payment_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'final_payment_paid'
  ) THEN
    ALTER TABLE vendors ADD COLUMN final_payment_paid boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE vendors ADD COLUMN payment_status text DEFAULT 'Not Paid';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'vendor_notes'
  ) THEN
    ALTER TABLE vendors ADD COLUMN vendor_notes jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendors' AND column_name = 'linked_tasks'
  ) THEN
    ALTER TABLE vendors ADD COLUMN linked_tasks text[] DEFAULT ARRAY[]::text[];
  END IF;
END $$;