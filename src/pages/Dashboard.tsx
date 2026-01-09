import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRole } from '@/lib/role-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase,
  Target,
  TrendingUp,
  Star,
  MapPin,
  Clock,
  IndianRupee,
  Users,
  BarChart3,
  MessageCircle,
  LogOut,
  ArrowLeft,
  Filter,
  ChevronDown,
  Search,
  ExternalLink,
  BookOpen,
  Calendar,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: number;
  type: string;
  skills: string[];
  description: string;
  requirements: string;
  rating: number;
  reviews: number;
  posted_date: string;
  application_deadline: string;
  match: number;
  featured: boolean;
}

interface UserProfile {
  full_name: string;
  email: string;
  year_of_study: string;
  cgpa_range: string;
  education_stream: string;
  target_industries: string[];
  primary_technical_strength: string;
  weekly_commitment_hours: number;
  learning_style: string;
}

interface OnboardingData {
  primary_goal: string;
  target_companies: string[];
  internship_type_preference: string;
  preferred_duration: string;
  wants_senior_guidance: boolean;
  wants_peer_comparison: boolean;
}

// Mock data for internships - in a real app, this would come from Firestore
const mockInternships: Internship[] = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    company: 'TechCorp',
    location: 'Bangalore',
    duration: '3 months',
    stipend: 35000,
    type: 'private',
    skills: ['React', 'TypeScript', 'Tailwind'],
    description: 'Develop responsive web applications using modern technologies.',
    requirements: 'Knowledge of React and JavaScript frameworks',
    rating: 4.5,
    reviews: 12,
    posted_date: '2024-01-15',
    application_deadline: '2024-02-20',
    match: 95,
    featured: true
  },
  {
    id: '2',
    title: 'Backend Engineer Intern',
    company: 'DataSystems',
    location: 'Remote',
    duration: '6 months',
    stipend: 40000,
    type: 'private',
    skills: ['Node.js', 'MongoDB', 'Express'],
    description: 'Build scalable backend systems and APIs.',
    requirements: 'Experience with server-side development',
    rating: 4.7,
    reviews: 8,
    posted_date: '2024-01-10',
    application_deadline: '2024-02-15',
    match: 87,
    featured: true
  },
  {
    id: '3',
    title: 'Data Science Intern',
    company: 'AnalyticsPro',
    location: 'Mumbai',
    duration: '4 months',
    stipend: 30000,
    type: 'private',
    skills: ['Python', 'Machine Learning', 'Pandas'],
    description: 'Analyze large datasets and build predictive models.',
    requirements: 'Strong background in statistics and Python',
    rating: 4.3,
    reviews: 15,
    posted_date: '2024-01-05',
    application_deadline: '2024-02-10',
    match: 92,
    featured: false
  },
  {
    id: '4',
    title: 'UX/UI Designer Intern',
    company: 'CreativeStudio',
    location: 'Delhi',
    duration: '3 months',
    stipend: 25000,
    type: 'private',
    skills: ['Figma', 'Prototyping', 'User Research'],
    description: 'Design intuitive user interfaces and experiences.',
    requirements: 'Portfolio showing design skills',
    rating: 4.8,
    reviews: 10,
    posted_date: '2024-01-20',
    application_deadline: '2024-02-25',
    match: 80,
    featured: false
  }
];

// Mock data for user profile and onboarding
const mockUserProfile: UserProfile = {
  full_name: 'John Doe',
  email: 'john.doe@example.com',
  year_of_study: '3rd Year',
  cgpa_range: '8.0-9.0',
  education_stream: 'Computer Science',
  target_industries: ['Technology', 'Finance'],
  primary_technical_strength: 'Frontend Development',
  weekly_commitment_hours: 20,
  learning_style: 'Visual Learner'
};

const mockOnboardingData: OnboardingData = {
  primary_goal: 'Get tech internship',
  target_companies: ['Google', 'Microsoft', 'Amazon'],
  internship_type_preference: 'Full-time',
  preferred_duration: '3-6 months',
  wants_senior_guidance: true,
  wants_peer_comparison: true
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { userRole, loading: roleLoading } = useRole();
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(mockOnboardingData);
  const [internships, setInternships] = useState<Internship[]>(mockInternships);
  const [sortOption, setSortOption] = useState<'stipend' | 'rating' | 'match' | 'duration'>('match');
  const [loading, setLoading] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterSkills, setFilterSkills] = useState<string[]>([]);

  const navigate = useNavigate();

  // Calculate readiness score based on profile completeness
  const readinessScore = Math.min(100,
    Object.values(mockUserProfile).filter(value => value).length * 8 +
    Object.values(mockOnboardingData).filter(value => value).length * 10
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Sort internships based on selected option
  useEffect(() => {
    const sorted = [...mockInternships].sort((a, b) => {
      switch (sortOption) {
        case 'stipend':
          return b.stipend - a.stipend;
        case 'rating':
          return b.rating - a.rating;
        case 'match':
          return b.match - a.match;
        case 'duration': {
          // Sort by duration (shorter first)
          const durationA = parseInt(a.duration.split(' ')[0]);
          const durationB = parseInt(b.duration.split(' ')[0]);
          return durationA - durationB;
        }
        default:
          return 0;
      }
    });
    setInternships(sorted);
  }, [sortOption]);

  // Apply filters
  useEffect(() => {
    let filtered = [...mockInternships];

    if (filterLocation) {
      filtered = filtered.filter(internship =>
        internship.location.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    if (filterSkills.length > 0) {
      filtered = filtered.filter(internship =>
        filterSkills.every(skill =>
          internship.skills.some((s: string) =>
            s.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    setInternships(filtered);
  }, [filterLocation, filterSkills]);

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1f3445]"></div>
          <p className="mt-4 text-[#1f3445]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1f3445] to-slate-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Perfect Placement</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {profile?.full_name || user?.email}
            </span>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{profile?.full_name?.split(' ')[0] || 'there'}</span>! 👋
          </h1>
          <p className="text-muted-foreground">Here's your personalized career dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Readiness Score */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1f3445]">Placement Readiness</h3>
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="text-4xl font-bold text-[#1f3445] mb-2">{readinessScore}%</div>
            <Progress value={readinessScore} className="h-2" />
            <p className="text-sm text-[#1f3445]/80 mt-2">
              {readinessScore >= 80 ? 'Excellent! You\'re well prepared.' :
                readinessScore >= 60 ? 'Good progress! Keep improving.' :
                  'Room for growth. Let\'s work on it!'}
            </p>
          </div>

          {/* Skill Gap */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1f3445]">Skill Gap Analysis</h3>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#1f3445]">React</span>
                <span className="font-bold text-[#1f3445]">85%</span>
              </div>
              <Progress value={85} className="h-1.5" />
              <div className="flex justify-between text-sm">
                <span className="text-[#1f3445]">TypeScript</span>
                <span className="font-bold text-[#1f3445]">70%</span>
              </div>
              <Progress value={70} className="h-1.5" />
              <div className="flex justify-between text-sm">
                <span className="text-[#1f3445]">Node.js</span>
                <span className="font-bold text-[#1f3445]">45%</span>
              </div>
              <Progress value={45} className="h-1.5" />
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1f3445]">Next Steps</h3>
              <BookOpen className="w-5 h-5 text-secondary" />
            </div>
            <ul className="space-y-2 text-sm text-[#1f3445]">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Complete onboarding
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Update profile
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                Apply to internships
              </li>
            </ul>
          </div>
        </div>

        {/* Internship Recommendations */}
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#1f3445]">Recommended Internships</h2>
              <p className="text-sm text-[#1f3445]">Sorted by highest match</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#1f3445] hidden sm:block">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'stipend' | 'rating' | 'match' | 'duration')}
                className="bg-background border border-[#1f3445]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f3445] focus:border-[#1f3445] text-[#1f3445] font-medium"
              >
                <option value="match">Match</option>
                <option value="stipend">Stipend</option>
                <option value="rating">Rating</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {(() => {
              // Sort internships based on selected option
              const sortedInternships = [...internships].sort((a, b) => {
                switch (sortOption) {
                  case 'stipend':
                    return b.stipend - a.stipend;
                  case 'rating':
                    return b.rating - a.rating;
                  case 'match':
                    return b.match - a.match;
                  case 'duration': {
                    // Sort by duration (shorter first)
                    const durationA = parseInt(a.duration.split(' ')[0]);
                    const durationB = parseInt(b.duration.split(' ')[0]);
                    return durationA - durationB;
                  }
                  default:
                    return 0;
                }
              });

              return sortedInternships.map((internship) => (
                <div
                  key={internship.id}
                  className="bg-white/50 rounded-xl p-6 border border-[#1f3445]/20 hover:border-[#1f3445]/40 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start gap-2 mb-2">
                        <h3 className="text-lg font-bold text-[#1f3445]">{internship.title}</h3>
                        {internship.featured && (
                          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                            Featured
                          </Badge>
                        )}
                        <Badge variant="secondary" className="bg-[#1f3445]/10 text-[#1f3445]">
                          {internship.type === 'govt' ? 'Government' : 'Private'}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#1f3445]/80 mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{internship.company}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{internship.location}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{internship.duration}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-4 h-4" />
                          <span className="font-bold">₹{internship.stipend.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {internship.skills.slice(0, 3).map((skill: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="border-[#1f3445]/30 text-[#1f3445]">
                            {skill}
                          </Badge>
                        ))}
                        {internship.skills.length > 3 && (
                          <Badge variant="outline" className="border-[#1f3445]/30 text-[#1f3445]">
                            +{internship.skills.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <p className="text-[#1f3445]/90 text-sm mb-3 line-clamp-2">{internship.description}</p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold">{internship.rating}</span>
                          <span className="text-sm text-[#1f3445]/70">({internship.reviews} reviews)</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="text-sm font-bold text-primary">{internship.match}% match</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
                      <Button
                        variant="outline"
                        className="border-[#1f3445] text-[#1f3445] hover:bg-[#1f3445]/10 font-medium"
                        onClick={() => navigate(`/internship/${internship.id}`)}
                      >
                        View Details
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>

                      <Button
                        className="bg-[#1f3445] hover:bg-[#1f3445]/90 text-white font-medium"
                        onClick={() => {
                          toast.success(`Applied to ${internship.title} at ${internship.company}`);
                          // In a real app, this would submit an application
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}