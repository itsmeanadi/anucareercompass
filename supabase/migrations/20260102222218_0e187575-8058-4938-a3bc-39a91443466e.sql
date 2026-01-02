
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create onboarding_data table for storing all form responses
CREATE TABLE public.onboarding_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Section 1: Academic & Eligibility
  year_of_study TEXT,
  cgpa_range TEXT,
  active_backlogs TEXT,
  education_stream TEXT,
  university_name TEXT,
  degree_branch TEXT,
  
  -- Section 2: Domain & Skills
  target_industries TEXT[],
  primary_technical_strength TEXT,
  secondary_skills TEXT[],
  certification_status TEXT,
  certification_files TEXT[],
  project_experience_level TEXT,
  
  -- Section 3: Experience & Exposure
  has_previous_internships BOOLEAN DEFAULT false,
  internship_details JSONB,
  has_hackathon_experience BOOLEAN DEFAULT false,
  has_opensource_experience BOOLEAN DEFAULT false,
  interview_comfort INTEGER DEFAULT 3,
  aptitude_comfort INTEGER DEFAULT 3,
  
  -- Section 4: Logistics & Preferences
  internship_type_preference TEXT,
  preferred_duration TEXT,
  govt_internship_interest TEXT,
  relocation_readiness TEXT,
  
  -- Section 5: Career Intent
  primary_goal TEXT,
  target_companies TEXT[],
  weekly_commitment_hours INTEGER,
  learning_style TEXT,
  
  -- Section 6: Social & Guidance
  wants_senior_guidance BOOLEAN DEFAULT false,
  wants_peer_comparison BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for onboarding_data
CREATE POLICY "Users can view their own onboarding data" ON public.onboarding_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own onboarding data" ON public.onboarding_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own onboarding data" ON public.onboarding_data FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Trigger for auto-creating profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_onboarding_data_updated_at BEFORE UPDATE ON public.onboarding_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
