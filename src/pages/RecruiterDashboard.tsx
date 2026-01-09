import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRole } from '@/lib/role-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Users,
  BarChart3,
  MessageCircle,
  LogOut,
  ArrowLeft,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Star,
  MapPin,
  Clock,
  IndianRupee,
  Building,
  User,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PostInternshipForm } from '@/components/recruiter/PostInternshipForm';

// Mock data for internships - in a real app, this would come from Firestore
const mockInternships = [
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
    status: 'active',
    applicants: 45
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
    status: 'active',
    applicants: 23
  }
];

// Mock data for applicants
const mockApplicants = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    status: 'Pending',
    appliedDate: '2024-01-16',
    internship: 'Frontend Developer Intern',
    university: 'Delhi University',
    cgpa: '8.5',
    skills: ['React', 'JavaScript', 'TypeScript']
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'Reviewed',
    appliedDate: '2024-01-15',
    internship: 'Backend Engineer Intern',
    university: 'IIT Delhi',
    cgpa: '9.0',
    skills: ['Node.js', 'Python', 'MongoDB']
  },
  {
    id: '3',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@example.com',
    status: 'Shortlisted',
    appliedDate: '2024-01-14',
    internship: 'Frontend Developer Intern',
    university: 'NSIT',
    cgpa: '8.2',
    skills: ['React', 'CSS', 'HTML']
  }
];

interface RecruiterInternship {
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
  status: string;
  applicants: number;
}

interface Applicant {
  id: string;
  name: string;
  email: string;
  status: string;
  appliedDate: string;
  internship: string;
  university: string;
  cgpa: string;
  skills: string[];
}

export default function RecruiterDashboard() {
  const { user, signOut } = useAuth();
  const { userRole } = useRole();
  const [activeTab, setActiveTab] = useState<'internships' | 'applicants' | 'analytics'>('internships');
  const [internships, setInternships] = useState<RecruiterInternship[]>(mockInternships);
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);
  const [showPostForm, setShowPostForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

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

  const handlePostInternship = () => {
    setShowPostForm(false);
    toast.success('Internship posted successfully!');
    // Refresh internships list in a real app
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || applicant.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (loading) {
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
            <span className="text-xl font-bold text-[#1f3445]">Perfect Placement</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#1f3445]/80 font-medium hidden sm:block">
              Recruiter Account
            </span>
            <Button variant="outline" size="icon" className="border-[#1f3445] text-[#1f3445] hover:bg-[#1f3445]/10">
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1f3445] mb-2">
            Welcome back, <span className="text-[#1f3445]">TechCorp</span>! 👋
          </h1>
          <p className="text-[#1f3445]/80 font-medium">
            Manage your internships and applicants
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Internships */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1f3445]">Active Internships</h3>
              <Briefcase className="w-5 h-5 text-[#1f3445]" />
            </div>
            <div className="text-4xl font-bold text-[#1f3445] mb-2">{internships.length}</div>
            <p className="text-sm text-[#1f3445]/80 font-medium">
              Currently accepting applications
            </p>
          </div>

          {/* Total Applicants */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1f3445]">Total Applicants</h3>
              <Users className="w-5 h-5 text-[#1f3445]" />
            </div>
            <div className="text-4xl font-bold text-[#1f3445] mb-2">
              {applicants.length}
            </div>
            <p className="text-sm text-[#1f3445]/80 font-medium">
              Across all internships
            </p>
          </div>

          {/* Conversion Rate */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1f3445]">Hiring Success</h3>
              <BarChart3 className="w-5 h-5 text-[#1f3445]" />
            </div>
            <div className="text-4xl font-bold text-[#1f3445] mb-2">24%</div>
            <p className="text-sm text-[#1f3445]/80 font-medium">
              Compared to 15% last month
            </p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="glass rounded-2xl p-6">
          {/* Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex space-x-2">
              <Button
                variant={activeTab === 'internships' ? 'default' : 'ghost'}
                className={`${activeTab === 'internships' ? 'bg-[#1f3445] hover:bg-[#1f3445]' : 'text-[#1f3445] hover:text-[#1f3445]/80'}`}
                onClick={() => setActiveTab('internships')}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Internships
              </Button>
              <Button
                variant={activeTab === 'applicants' ? 'default' : 'ghost'}
                className={`${activeTab === 'applicants' ? 'bg-[#1f3445] hover:bg-[#1f3445]' : 'text-[#1f3445] hover:text-[#1f3445]/80'}`}
                onClick={() => setActiveTab('applicants')}
              >
                <Users className="w-4 h-4 mr-2" />
                Applicants
              </Button>
              <Button
                variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                className={`${activeTab === 'analytics' ? 'bg-[#1f3445] hover:bg-[#1f3445]' : 'text-[#1f3445] hover:text-[#1f3445]/80'}`}
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeTab === 'internships' && (
                <Button
                  className="bg-[#1f3445] hover:bg-[#1f3445]/90 text-white"
                  onClick={() => setShowPostForm(true)}
                >
                  Post New Internship
                </Button>
              )}
              <Button variant="outline" className="border-[#1f3445] text-[#1f3445] hover:bg-[#1f3445]/10">
                Export Data
              </Button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'internships' && (
            <div className="space-y-6">
              {showPostForm ? (
                <PostInternshipForm
                  onPostSuccess={handlePostInternship}
                  onCancel={() => setShowPostForm(false)}
                />
              ) : (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#1f3445]">Your Internships</h2>
                    <p className="text-sm text-[#1f3445]/80 font-medium">Manage your posted internships</p>
                  </div>

                  <div className="space-y-4">
                    {internships.map((internship) => (
                      <div key={internship.id} className="bg-white/50 rounded-xl p-6 border border-[#1f3445]/20">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start gap-2 mb-2">
                              <h3 className="text-lg font-bold text-[#1f3445]">{internship.title}</h3>
                              <Badge variant="secondary" className="bg-[#1f3445]/10 text-[#1f3445]">
                                {internship.type === 'govt' ? 'Government' : 'Private'}
                              </Badge>
                              <Badge className="bg-green-500/20 text-green-700">Active</Badge>
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
                                <span className="font-bold">₹{internship.stipend.toLocaleString()}/month</span>
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
                                <Users className="w-4 h-4 text-primary" />
                                <span className="text-sm font-bold text-primary">{internship.applicants} applicants</span>
                              </div>

                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-[#1f3445]" />
                                <span className="text-sm text-[#1f3445]">Deadline: {internship.application_deadline}</span>
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
                              variant="outline"
                              className="border-[#1f3445] text-[#1f3445] hover:bg-[#1f3445]/10 font-medium"
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'applicants' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1f3445]">Applicants</h2>
                  <p className="text-sm text-[#1f3445]/80 font-medium">Review and manage applications</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1f3445]/60" />
                    <input
                      type="text"
                      placeholder="Search applicants..."
                      className="pl-10 pr-4 py-2 border border-[#1f3445]/30 rounded-lg text-[#1f3445] focus:outline-none focus:ring-2 focus:ring-[#1f3445] focus:border-[#1f3445]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="pl-3 pr-8 py-2 border border-[#1f3445]/30 rounded-lg text-[#1f3445] focus:outline-none focus:ring-2 focus:ring-[#1f3445] focus:border-[#1f3445] appearance-none"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#1f3445]/60" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredApplicants.map((applicant) => (
                  <div key={applicant.id} className="bg-white/50 rounded-xl p-6 border border-[#1f3445]/20">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-[#1f3445]/10 flex items-center justify-center">
                          <User className="w-6 h-6 text-[#1f3445]" />
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-[#1f3445]">{applicant.name}</h3>
                            <Badge className={`${applicant.status === 'Shortlisted'
                                ? 'bg-blue-500/20 text-blue-700'
                                : applicant.status === 'Reviewed'
                                  ? 'bg-green-500/20 text-green-700'
                                  : 'bg-yellow-500/20 text-yellow-700'
                              }`}>
                              {applicant.status}
                            </Badge>
                          </div>
                          <p className="text-[#1f3445]/90 text-sm mb-1">{applicant.email}</p>
                          <p className="text-[#1f3445]/80 text-sm">{applicant.internship}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-3">
                        <div className="text-sm text-[#1f3445]/80 font-medium">
                          Applied: {applicant.appliedDate}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 border-[#1f3445] text-[#1f3445] font-bold hover:bg-[#1f3445]/10"
                        >
                          Review Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#1f3445]">Analytics Dashboard</h2>
                <p className="text-sm text-[#1f3445]/80 font-medium">Track your hiring performance</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-[#1f3445]/30">
                  <CardHeader>
                    <CardTitle className="text-[#1f3445] font-bold">Application Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-[#1f3445]/5 rounded-lg">
                      <p className="text-[#1f3445]/60 font-medium">Analytics Chart Placeholder</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#1f3445]/30">
                  <CardHeader>
                    <CardTitle className="text-[#1f3445] font-bold">Top Applied Roles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-[#1f3445]/5 rounded-lg">
                      <p className="text-[#1f3445]/60 font-medium">Analytics Chart Placeholder</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-[#1f3445]/30">
                  <CardHeader>
                    <CardTitle className="text-[#1f3445] font-bold">Avg. Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#1f3445]">3.2 days</div>
                    <p className="text-[#1f3445]/80 text-sm mt-2">Faster than industry average</p>
                  </CardContent>
                </Card>

                <Card className="border-[#1f3445]/30">
                  <CardHeader>
                    <CardTitle className="text-[#1f3445] font-bold">Acceptance Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#1f3445]">18%</div>
                    <p className="text-[#1f3445]/80 text-sm mt-2">Compared to 15% last month</p>
                  </CardContent>
                </Card>

                <Card className="border-[#1f3445]/30">
                  <CardHeader>
                    <CardTitle className="text-[#1f3445] font-bold">Satisfaction Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#1f3445]">4.7/5</div>
                    <p className="text-[#1f3445]/80 text-sm mt-2">Based on feedback</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}