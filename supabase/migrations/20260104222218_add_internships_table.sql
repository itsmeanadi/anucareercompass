-- Create internships table for recruiter postings
CREATE TABLE public.internships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  duration TEXT,
  stipend INTEGER DEFAULT 0,
  type TEXT DEFAULT 'private',
  skills TEXT[],
  description TEXT,
  requirements TEXT,
  application_deadline DATE,
  contact_email TEXT,
  posted_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'active'
);

-- Enable RLS
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for internships
CREATE POLICY "Users can view all internships" ON public.internships FOR SELECT USING (true);
CREATE POLICY "Recruiters can insert internships" ON public.internships FOR INSERT WITH CHECK (
  (SELECT user_type FROM profiles WHERE user_id = auth.uid()) = 'recruiter'
);
CREATE POLICY "Recruiters can update their own internships" ON public.internships FOR UPDATE USING (
  (SELECT user_type FROM profiles WHERE user_id = auth.uid()) = 'recruiter' AND posted_by = auth.uid()
);
CREATE POLICY "Recruiters can delete their own internships" ON public.internships FOR DELETE USING (
  (SELECT user_type FROM profiles WHERE user_id = auth.uid()) = 'recruiter' AND posted_by = auth.uid()
);

-- Insert sample internships
INSERT INTO public.internships (
    title,
    company,
    location,
    duration,
    stipend,
    type,
    skills,
    description,
    requirements,
    application_deadline,
    contact_email,
    status
) VALUES 
(
    'Software Development Intern',
    'Tech Innovations Pvt Ltd',
    'Bangalore, Remote',
    '3 months',
    25000,
    'private',
    ARRAY['JavaScript', 'React', 'Node.js'],
    'Join our development team to work on cutting-edge web applications and enhance your skills in modern technologies.',
    'Pursuing B.Tech/M.Tech in Computer Science or related field with good knowledge of JavaScript and React.',
    '2024-02-29',
    'careers@techinnovations.com',
    'active'
),
(
    'Data Science Intern',
    'Data Insights Co.',
    'Mumbai',
    '6 months',
    30000,
    'private',
    ARRAY['Python', 'Machine Learning', 'Pandas', 'SQL'],
    'Work with our data science team on real-world projects involving machine learning and data analysis.',
    'Strong background in mathematics and statistics, proficiency in Python, and experience with data analysis libraries.',
    '2024-02-15',
    'hr@datainsights.co',
    'active'
),
(
    'Marketing Intern',
    'BrandBoost Solutions',
    'Delhi',
    '3 months',
    15000,
    'private',
    ARRAY['Digital Marketing', 'Social Media', 'Content Creation', 'Analytics'],
    'Assist in developing marketing campaigns and analyzing their effectiveness across various channels.',
    'Marketing or business degree preferred with knowledge of social media platforms and basic analytics tools.',
    '2024-02-20',
    'jobs@brandboost.com',
    'active'
),
(
    'Research Intern - AI',
    'National Research Lab',
    'Hyderabad',
    '4 months',
    20000,
    'govt',
    ARRAY['Python', 'TensorFlow', 'Research', 'AI'],
    'Contribute to groundbreaking research in artificial intelligence and machine learning algorithms.',
    'Pursuing Master''s or PhD in Computer Science, AI, or related field with research experience.',
    '2024-02-10',
    'research@nrl.gov.in',
    'active'
);