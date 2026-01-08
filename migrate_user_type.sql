-- Add user_type column to profiles table if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'applicant' 
CHECK (user_type IN ('applicant', 'recruiter'));