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
  Building,
  Menu,
  Home,
  UserCircle
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNavigate, Link } from 'react-router-dom';
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
    // Simulate loading for better UX just for a moment, or rely on role loading
    // In real app, we would fetch data here
    setLoading(false);
  }, []);

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

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">CareerCompass</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm font-medium text-blue-600">
                Dashboard
              </Link>
              <Link to="/roadmap" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Roadmap
              </Link>
              <Link to="/recruiter-dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Recruiter View
              </Link>
            </nav>

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 hidden sm:block">
                {profile?.full_name || user?.email}
              </span>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-slate-500 hover:text-red-600 hidden md:flex">
                <LogOut className="w-5 h-5" />
              </Button>

              {/* Mobile Menu Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden text-slate-700">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-6">
                    <Link to="/dashboard" className="flex items-center gap-2 text-lg font-medium text-blue-600">
                      <Briefcase className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link to="/roadmap" className="flex items-center gap-2 text-lg font-medium text-slate-600 hover:text-blue-600">
                      <MapPin className="w-5 h-5" /> Roadmap
                    </Link>
                    <Link to="/recruiter-dashboard" className="flex items-center gap-2 text-lg font-medium text-slate-600 hover:text-blue-600">
                      <Users className="w-5 h-5" /> Recruiter View
                    </Link>
                    <Link to="/role-selection" className="flex items-center gap-2 text-lg font-medium text-slate-600 hover:text-blue-600">
                      <UserCircle className="w-5 h-5" /> Switch Role
                    </Link>
                    <Link to="/" className="flex items-center gap-2 text-lg font-medium text-slate-600 hover:text-blue-600">
                      <Home className="w-5 h-5" /> Home
                    </Link>
                    <div className="h-px bg-slate-100 my-2"></div>
                    <button onClick={handleSignOut} className="flex items-center gap-2 text-lg font-medium text-red-600">
                      <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">
            Welcome back, <span className="text-blue-600">{profile?.full_name?.split(' ')[0] || 'there'}</span>! 👋
          </h1>
          <p className="text-slate-500">Here's your personalized career dashboard</p>
        </div>

        {/* Quick Links Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => navigate('/roadmap')}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-3 backdrop-blur-sm">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-white text-lg">Roadmap</h3>
              <p className="text-sm text-blue-100 mt-1">View your learning path</p>
            </div>

            <div
              onClick={() => navigate('/recruiter-dashboard')}
              className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-3 backdrop-blur-sm">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-white text-lg">Recruiter View</h3>
              <p className="text-sm text-purple-100 mt-1">Switch to hiring mode</p>
            </div>

            <div
              onClick={() => navigate('/role-selection')}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-3 backdrop-blur-sm">
                <UserCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-white text-lg">Switch Role</h3>
              <p className="text-sm text-emerald-100 mt-1">Change your persona</p>
            </div>

            <div
              onClick={() => navigate('/')}
              className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-3 backdrop-blur-sm">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-white text-lg">Home</h3>
              <p className="text-sm text-orange-100 mt-1">Go to landing page</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Readiness Score */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-t-4 border-t-blue-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
            <div className="flex items-center justify-between mb-4 relative">
              <h3 className="font-bold text-slate-700">Placement Readiness</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-900 mb-2 relative">{readinessScore}%</div>
            <Progress value={readinessScore} className="h-2 bg-slate-100 [&>div]:bg-blue-500" />
            <p className="text-sm text-slate-500 mt-2 relative">
              {readinessScore >= 80 ? 'Excellent! You\'re well prepared.' :
                readinessScore >= 60 ? 'Good progress! Keep improving.' :
                  'Room for growth. Let\'s work on it!'}
            </p>
          </div>

          {/* Skill Gap */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-t-4 border-t-indigo-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
            <div className="flex items-center justify-between mb-4 relative">
              <h3 className="font-bold text-slate-700">Skill Gap Analysis</h3>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="space-y-3 relative">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">React</span>
                <span className="font-bold text-slate-900">85%</span>
              </div>
              <Progress value={85} className="h-1.5 bg-slate-100 [&>div]:bg-indigo-500" />
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">TypeScript</span>
                <span className="font-bold text-slate-900">70%</span>
              </div>
              <Progress value={70} className="h-1.5 bg-slate-100 [&>div]:bg-indigo-500" />
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Node.js</span>
                <span className="font-bold text-slate-900">45%</span>
              </div>
              <Progress value={45} className="h-1.5 bg-slate-100 [&>div]:bg-indigo-500" />
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-t-4 border-t-emerald-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
            <div className="flex items-center justify-between mb-4 relative">
              <h3 className="font-bold text-slate-700">Recommended Actions</h3>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Star className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <ul className="space-y-3 relative">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                <span className="text-sm text-slate-600">Complete React Advanced certification</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                <span className="text-sm text-slate-600">Build 2 more full-stack projects</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                <span className="text-sm text-slate-600">Update GitHub profile README</span>
              </li>
            </ul>
            <Button variant="ghost" className="w-full mt-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 relative">
              View All Actions
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          </div>
        </div>
        {/* Internship Recommendations */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recommended Internships</h2>
              <p className="text-sm text-slate-500">Sorted by highest match</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 hidden sm:block">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'stipend' | 'rating' | 'match' | 'duration')}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-700 font-medium"
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
                  className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{internship.title}</h3>
                        {internship.featured && (
                          <Badge className="bg-blue-600 text-white hover:bg-blue-700 border-none">
                            Featured
                          </Badge>
                        )}
                        <Badge variant="secondary" className="bg-white text-slate-700 border border-slate-200">
                          {internship.type === 'govt' ? 'Government' : 'Private'}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4 text-slate-400" />
                          <span>{internship.company}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>{internship.location}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{internship.duration}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-4 h-4 text-slate-400" />
                          <span className="font-bold text-slate-900">₹{internship.stipend.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {internship.skills.slice(0, 3).map((skill: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="border-slate-200 text-slate-600 bg-white">
                            {skill}
                          </Badge>
                        ))}
                        {internship.skills.length > 3 && (
                          <Badge variant="outline" className="border-slate-200 text-slate-600 bg-white">
                            +{internship.skills.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">{internship.description}</p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-slate-900">{internship.rating}</span>
                          <span className="text-sm text-slate-500">({internship.reviews} reviews)</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-bold text-blue-600">{internship.match}% match</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
                      <Button
                        variant="outline"
                        className="border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                        onClick={() => navigate(`/internship/${internship.id}`)}
                      >
                        View Details
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>

                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-600/20"
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