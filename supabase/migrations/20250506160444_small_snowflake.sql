/*
  # Remove avatar_url from profiles table
  
  1. Changes
    - Remove avatar_url column from profiles table
    
  2. Notes
    - This is a non-destructive change as we're only removing an optional column
    - No data migration needed since the column was not being used
*/

ALTER TABLE profiles DROP COLUMN IF EXISTS avatar_url;