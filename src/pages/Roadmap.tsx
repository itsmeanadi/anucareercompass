import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRole } from '@/lib/role-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  User,
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
  Calendar,
  Building,
  Award,
  CheckCircle,
  XCircle,
  BookText,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Globe,
  Share2
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

interface TimelineEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  duration: string;
  skill: string;
  description: string;
  mode: 'online' | 'offline';
  location?: string;
  rating: number;
  internshipOutcome: string;
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

// Mock timeline events
const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    title: 'React Masterclass',
    type: 'course',
    date: 'Jan 2023',
    duration: '6 weeks',
    skill: 'React',
    description: 'Comprehensive React course covering hooks, state management, and performance optimization',
    mode: 'online',
    rating: 4.8,
    internshipOutcome: 'Frontend Developer Intern at TechCorp'
  },
  {
    id: '2',
    title: 'AI/ML Bootcamp',
    type: 'workshop',
    date: 'Mar 2023',
    duration: '4 weeks',
    skill: 'Machine Learning',
    description: 'Hands-on workshop on neural networks and deep learning',
    mode: 'offline',
    location: 'Delhi',
    rating: 4.9,
    internshipOutcome: 'ML Intern at InnovateAI'
  },
  {
    id: '3',
    title: 'Hackathon 2023',
    type: 'event',
    date: 'May 2023',
    duration: '3 days',
    skill: 'Problem Solving',
    description: 'National level hackathon focusing on sustainability solutions',
    mode: 'offline',
    location: 'Mumbai',
    rating: 4.7,
    internshipOutcome: 'Won 2nd place - led to internship offer'
  }
];

export default function Roadmap() {
  const { user, signOut } = useAuth();
  const { userRole } = useRole();
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(mockOnboardingData);
  const [internships, setInternships] = useState<Internship[]>(mockInternships);
  const [userTimelineEvents, setUserTimelineEvents] = useState<TimelineEvent[]>(mockTimelineEvents);
  const [activeTab, setActiveTab] = useState<'timeline' | 'skills'>('timeline');
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading data from Firestore
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1f3445]"></div>
          <p className="mt-4 text-[#1f3445]">Loading roadmap...</p>
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
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">CareerCompass</span>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="border-slate-200 text-slate-600 hover:bg-slate-50">
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Personalized Learning Roadmap</h1>
          <p className="text-slate-500">Follow the path that successful seniors took to land internships</p>
        </div>

        {/* Student Details Section */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Your Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-slate-500">Full Name</Label>
              <Input
                value={profile.full_name}
                readOnly
                className="h-10 border-slate-200 text-slate-900 bg-slate-50 mt-1 w-full rounded-md px-3 border"
              />
            </div>
            <div>
              <Label className="text-slate-500">Email</Label>
              <Input
                value={profile.email}
                readOnly
                className="h-10 border-slate-200 text-slate-900 bg-slate-50 mt-1 w-full rounded-md px-3 border"
              />
            </div>
            <div>
              <Label className="text-slate-500">Year of Study</Label>
              <Input
                value={profile.year_of_study}
                readOnly
                className="h-10 border-slate-200 text-slate-900 bg-slate-50 mt-1 w-full rounded-md px-3 border"
              />
            </div>
            <div>
              <Label className="text-slate-500">CGPA Range</Label>
              <Input
                value={profile.cgpa_range}
                readOnly
                className="h-10 border-slate-200 text-slate-900 bg-slate-50 mt-1 w-full rounded-md px-3 border"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-slate-100">
          <div className="flex border-b border-slate-100 mb-6">
            <Button
              variant="ghost"
              className={`mr-2 rounded-t-lg rounded-b-none hover:bg-slate-50 ${activeTab === 'timeline' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
              onClick={() => setActiveTab('timeline')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Timeline
            </Button>
            <Button
              variant="ghost"
              className={`rounded-t-lg rounded-b-none hover:bg-slate-50 ${activeTab === 'skills' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
              onClick={() => setActiveTab('skills')}
            >
              <Target className="w-4 h-4 mr-2" />
              Skills Gap Analysis
            </Button>
          </div>

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Your Learning Journey</h3>
                <Button
                  variant="outline"
                  className="border-slate-200 text-slate-600 hover:bg-slate-50"
                  onClick={() => {
                    toast.info('Adding new roadmap items coming soon!');
                  }}
                >
                  Add New Item
                </Button>
              </div>

              <div className="relative pl-2">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-200 transform translate-x-0.5"></div>

                {userTimelineEvents.map((event, index) => (
                  <div key={event.id} className="relative flex gap-6 mb-8 group pl-2">
                    {/* Timeline dot */}
                    <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>

                    {/* Event card */}
                    <div className="flex-1 bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">{event.title}</h4>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                              {event.type}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{event.duration}</span>
                            </div>
                          </div>
                        </div>

                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                          {event.mode}
                        </Badge>
                      </div>

                      <p className="text-slate-600 mb-4 text-sm leading-relaxed">{event.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm border-t border-slate-50 pt-3">
                        <div className="flex items-center gap-1.5">
                          <Target className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-slate-700">Focus: {event.skill}</span>
                        </div>

                        {event.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">{event.location}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-slate-900">{event.rating}</span>
                        </div>
                      </div>

                      <div className="mt-3 bg-blue-50/50 rounded-lg p-3">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Result:</span> {event.internshipOutcome}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Skill Gap Analysis</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-900 font-bold">Your Current Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      {['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python'].map((skill, index) => (
                        <div key={skill} className="flex items-center justify-between">
                          <span className="text-slate-700 font-medium">{skill}</span>
                          <div className="flex items-center gap-3">
                            <Progress value={(index % 2 === 0 ? 80 : 60) - (index * 5)} className="w-32 h-2 [&>div]:bg-blue-600" />
                            <span className="text-sm text-slate-500 w-8 text-right">{(index % 2 === 0 ? 80 : 60) - (index * 5)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-900 font-bold">Skills Needed for Target Roles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      {['React', 'Advanced JavaScript', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'].map((skill, index) => (
                        <div key={skill} className="flex items-center justify-between">
                          <span className="text-slate-700 font-medium">{skill}</span>
                          <div className="flex items-center gap-3">
                            <Progress value={index < 4 ? 90 : 70} className="w-32 h-2 [&>div]:bg-green-600" />
                            <span className="text-sm text-slate-500 w-8 text-right">{index < 4 ? 90 : 70}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-blue-50/30">
                <CardHeader>
                  <CardTitle className="text-slate-900 font-bold flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" /> Recommended Learning Path
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <BookText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Advanced React Patterns</h4>
                        <p className="text-sm text-slate-600 mb-3">Learn advanced React patterns to improve your skills in the most in-demand framework</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">6 weeks</span>
                          <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">Online</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Share2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">System Design Fundamentals</h4>
                        <p className="text-sm text-slate-600 mb-3">Master the fundamentals of system design for senior developer roles</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">4 weeks</span>
                          <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium">Online</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Behavioral Interview Prep</h4>
                        <p className="text-sm text-slate-600 mb-3">Prepare for behavioral interviews with structured response techniques</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">2 weeks</span>
                          <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full font-medium">Workshop</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Recommended Internships */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recommended Internships</h2>
            <Button
              variant="outline"
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
              onClick={() => navigate('/dashboard')}
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {internships.slice(0, 2).map((internship) => (
              <div key={internship.id} className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start gap-2 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{internship.title}</h3>
                      {internship.featured && (
                        <Badge className="bg-blue-600 text-white border-none">
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
                        <span className="font-bold text-slate-900">₹{internship.stipend.toLocaleString()}/month</span>
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
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
                    <Button
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:bg-white"
                      onClick={() => navigate(`/internship/${internship.id}`)}
                    >
                      View Details
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>

                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-600/20"
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
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Add missing imports for the components used in the JSX
const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);

const Input = ({ value, readOnly, className, ...props }: React.ComponentProps<'input'>) => (
  <input
    value={value}
    readOnly={readOnly}
    className={className}
    {...props}
  />
);