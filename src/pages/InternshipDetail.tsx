import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRole } from '@/lib/role-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  Users,
  Star,
  Target,
  BookOpen,
  Calendar,
  Building,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Award,
  CheckCircle,
  XCircle,
  LogOut
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

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
    description: 'Develop responsive web applications using modern technologies. Work with cross-functional teams to design, develop, and maintain high-quality software products.',
    requirements: 'Knowledge of React and JavaScript frameworks, understanding of REST APIs, and experience with version control systems like Git.',
    rating: 4.5,
    reviews: 12,
    posted_date: '2024-01-15',
    application_deadline: '2024-02-20',
    match: 95,
    featured: true,
    benefits: ['Flexible work hours', 'Mentorship program', 'Learning allowance', 'Health insurance'],
    responsibilities: [
      'Develop responsive web applications',
      'Collaborate with designers and backend engineers',
      'Write clean, maintainable code',
      'Participate in code reviews'
    ],
    about_company: 'TechCorp is a leading technology company focused on building innovative solutions for enterprise clients worldwide.',
    contact_person: 'HR Department',
    contact_email: 'careers@techcorp.com',
    contact_phone: '+91 98765 43210'
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
    description: 'Build scalable backend systems and APIs. Design and implement robust solutions for complex business problems.',
    requirements: 'Experience with server-side development, knowledge of database design, and understanding of system architecture.',
    rating: 4.7,
    reviews: 8,
    posted_date: '2024-01-10',
    application_deadline: '2024-02-15',
    match: 87,
    featured: true,
    benefits: ['Remote work', 'Performance bonus', 'Conference attendance', 'Stock options'],
    responsibilities: [
      'Design and implement scalable APIs',
      'Optimize database queries',
      'Ensure security and data protection',
      'Collaborate with frontend teams'
    ],
    about_company: 'DataSystems specializes in big data analytics and cloud infrastructure solutions.',
    contact_person: 'Engineering Team',
    contact_email: 'engineering@datasystems.com',
    contact_phone: '+91 87654 32109'
  }
];

// Mock data for user profile and onboarding
const mockUserProfile = {
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

const mockOnboardingData = {
  primary_goal: 'Get tech internship',
  target_companies: ['Google', 'Microsoft', 'Amazon'],
  internship_type_preference: 'Full-time',
  preferred_duration: '3-6 months',
  wants_senior_guidance: true,
  wants_peer_comparison: true,
  secondary_skills: ['JavaScript', 'Python', 'React'],
  primary_technical_strength: 'Frontend Development'
};

interface DetailedInternship {
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
  benefits?: string[];
  responsibilities?: string[];
  about_company?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
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

interface UserOnboardingData {
  primary_goal: string;
  target_companies: string[];
  internship_type_preference: string;
  preferred_duration: string;
  wants_senior_guidance: boolean;
  wants_peer_comparison: boolean;
  secondary_skills: string[];
  primary_technical_strength: string;
}

export default function InternshipDetail() {
  const { user, signOut } = useAuth();
  const { userRole } = useRole();
  const { id } = useParams();
  const [internship, setInternship] = useState<DetailedInternship | null>(null);
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [onboardingData, setOnboardingData] = useState<UserOnboardingData>(mockOnboardingData);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'apply' | 'reviews'>('details');
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<DetailedInternship | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>(mockOnboardingData.secondary_skills || []);
  const [primarySkill, setPrimarySkill] = useState<string>(mockOnboardingData.primary_technical_strength || '');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    // Find the internship by ID
    const foundInternship = mockInternships.find(i => i.id === id);
    if (foundInternship) {
      setInternship(foundInternship);
      setSelectedInternship(foundInternship);
    }
    setLoading(false);
  }, [id]);

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

  const handleApply = () => {
    toast.success(`Successfully applied to ${internship?.title} at ${internship?.company}`);
    // In a real app, this would submit an application to Firestore
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1f3445]"></div>
          <p className="mt-4 text-[#1f3445]">Loading internship details...</p>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1f3445]">Internship not found</h2>
          <Button
            variant="outline"
            className="mt-4 border-[#1f3445] text-[#1f3445] hover:bg-[#1f3445]/10"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const allUserSkills = primarySkill ? [...userSkills, primarySkill] : userSkills;

  // Important points about the internship
  const importantPoints = [
    `Application Deadline: ${internship.application_deadline}`,
    `Eligibility: Typically requires ${internship.match}% match or higher`,
    `Duration: ${internship.duration} - Plan your academic schedule accordingly`,
    `Stipend: ₹${internship.stipend.toLocaleString()}/month - Consider cost of living at location`,
    `Skills Required: ${internship.skills.join(', ')} - Focus on improving these areas`,
    `Interview Process: Usually includes technical rounds and behavioral interviews`
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1f3445] to-slate-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Perfect Placement</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {profile?.full_name || user?.email}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-muted-foreground"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button for mobile */}
        <Button
          variant="outline"
          className="mb-6 md:hidden w-full justify-start"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-[#1f3445]">{internship.title}</h1>
                {internship.featured && (
                  <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                    Featured
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-[#1f3445]/10 text-[#1f3445]">
                  {internship.type === 'govt' ? 'Government' : 'Private'}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[#1f3445]/80 mb-4">
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
            </div>

            <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
              <Button
                variant="outline"
                className="border-[#1f3445] text-[#1f3445] hover:bg-[#1f3445]/10 font-medium"
                onClick={handleApply}
              >
                Apply Now
              </Button>

              <Button
                className="bg-[#1f3445] hover:bg-[#1f3445]/90 text-white font-medium"
                onClick={() => {
                  toast.success(`Saved ${internship.title} to your favorites`);
                  // In a real app, this would save to user's favorites in Firestore
                }}
              >
                Save for Later
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#1f3445]">{internship.rating}</div>
              <div className="flex justify-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(internship.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <div className="text-xs text-[#1f3445]/70 mt-1">{internship.reviews} reviews</div>
            </div>

            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#1f3445]">{internship.match}%</div>
              <div className="text-sm text-[#1f3445] font-medium mt-1">Match</div>
              <div className="text-xs text-[#1f3445]/70 mt-1">with your profile</div>
            </div>

            <div className="glass rounded-xl p-4 text-center">
              <div className="text-lg font-bold text-[#1f3445]">{internship.duration}</div>
              <div className="text-sm text-[#1f3445] font-medium mt-1">Duration</div>
              <div className="text-xs text-[#1f3445]/70 mt-1">Full-time</div>
            </div>

            <div className="glass rounded-xl p-4 text-center">
              <div className="text-lg font-bold text-[#1f3445]">₹{internship.stipend.toLocaleString()}</div>
              <div className="text-sm text-[#1f3445] font-medium mt-1">Monthly Stipend</div>
              <div className="text-xs text-[#1f3445]/70 mt-1">Competitive</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {internship.skills.map((skill: string, idx: number) => (
              <Badge key={idx} variant="outline" className="border-[#1f3445]/30 text-[#1f3445]">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex border-b border-[#1f3445]/20 mb-6">
            <Button
              variant="ghost"
              className={`mr-2 ${activeTab === 'details' ? 'border-b-2 border-[#1f3445] text-[#1f3445]' : 'text-[#1f3445]/70 hover:text-[#1f3445]'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </Button>
            <Button
              variant="ghost"
              className={`mr-2 ${activeTab === 'apply' ? 'border-b-2 border-[#1f3445] text-[#1f3445]' : 'text-[#1f3445]/70 hover:text-[#1f3445]'}`}
              onClick={() => setActiveTab('apply')}
            >
              How to Apply
            </Button>
            <Button
              variant="ghost"
              className={`${activeTab === 'reviews' ? 'border-b-2 border-[#1f3445] text-[#1f3445]' : 'text-[#1f3445]/70 hover:text-[#1f3445]'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </Button>
          </div>

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#1f3445] mb-2">About the Role</h3>
                <p className="text-[#1f3445]/90">{internship.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1f3445] mb-2">Requirements</h3>
                <p className="text-[#1f3445]/90">{internship.requirements}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1f3445] mb-2">Responsibilities</h3>
                <ul className="space-y-2">
                  {internship.responsibilities.map((resp: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-[#1f3445]/90">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1f3445] mb-2">Benefits</h3>
                <ul className="space-y-2">
                  {internship.benefits.map((benefit: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-[#1f3445]/90">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1f3445] mb-2">About the Company</h3>
                <p className="text-[#1f3445]/90">{internship.about_company}</p>
              </div>
            </div>
          )}

          {activeTab === 'apply' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#1f3445] mb-2">Application Process</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Submit your application through our portal</li>
                  <li>Complete the online assessment (if applicable)</li>
                  <li>Technical screening round</li>
                  <li>HR interview</li>
                  <li>Final decision notification</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1f3445] mb-2">Required Documents</h3>
                <ul className="space-y-2">
                  <li>Resume (PDF format)</li>
                  <li>Cover letter (optional but recommended)</li>
                  <li>Academic transcripts</li>
                  <li>Portfolio links (if applicable)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1f3445] mb-2">Important Dates</h3>
                <ul className="space-y-2">
                  <li>Application Deadline: {internship.application_deadline}</li>
                  <li>Assessment Round: Starting {new Date(new Date(internship.application_deadline).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</li>
                  <li>Interviews: Starting {new Date(new Date(internship.application_deadline).getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</li>
                  <li>Start Date: {new Date(new Date().setMonth(new Date().getMonth() + 2)).toLocaleDateString()}</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#1f3445] mb-2">Recent Reviews</h3>
                <div className="space-y-4">
                  {[
                    { id: 1, name: 'Alice Johnson', rating: 5, comment: 'Great learning experience! The mentorship was excellent.', date: '2023-12-15' },
                    { id: 2, name: 'Bob Smith', rating: 4, comment: 'Good work-life balance and supportive team.', date: '2023-11-22' },
                    { id: 3, name: 'Carol Davis', rating: 5, comment: 'Amazing opportunity to work on cutting-edge projects.', date: '2023-10-30' }
                  ].map(review => (
                    <Card key={review.id} className="border-[#1f3445]/20">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-[#1f3445]">{review.name}</CardTitle>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-[#1f3445]/60">{review.date}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#1f3445]/80">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1f3445] mb-2">Add Your Review</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-[#1f3445] font-bold">Rating</Label>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Button
                          key={star}
                          variant="ghost"
                          size="sm"
                          className={`w-10 h-10 p-0 ${star <= reviewRating ? 'text-yellow-400' : 'text-[#1f3445]/40'}`}
                          onClick={() => setReviewRating(star)}
                        >
                          <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : ''}`} />
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reviewText" className="text-[#1f3445] font-bold">Your Review</Label>
                    <Textarea
                      id="reviewText"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience..."
                      className="border-[#1f3445]/30 text-[#1f3445] min-h-[100px]"
                    />
                  </div>

                  <Button
                    className="bg-[#1f3445] hover:bg-[#1f3445]/90 text-white"
                    onClick={() => {
                      toast.success('Review submitted successfully!');
                      setReviewText('');
                      setReviewRating(5);
                    }}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Application Checklist */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-[#1f3445] mb-4">Application Checklist</h3>
          <div className="space-y-3">
            {importantPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${idx < 4 ? 'bg-green-500/20 text-green-700' : 'bg-yellow-500/20 text-yellow-700'
                  }`}>
                  {idx < 4 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                </div>
                <p className={`text-[#1f3445]/90 ${idx < 4 ? 'font-medium' : ''}`}>{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-bold text-[#1f3445] mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-[#1f3445]/5 rounded-lg">
              <Mail className="w-5 h-5 text-[#1f3445]" />
              <div>
                <p className="text-sm text-[#1f3445]/70">Email</p>
                <p className="text-[#1f3445] font-medium">{internship.contact_email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#1f3445]/5 rounded-lg">
              <Phone className="w-5 h-5 text-[#1f3445]" />
              <div>
                <p className="text-sm text-[#1f3445]/70">Phone</p>
                <p className="text-[#1f3445] font-medium">{internship.contact_phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#1f3445]/5 rounded-lg">
              <Globe className="w-5 h-5 text-[#1f3445]" />
              <div>
                <p className="text-sm text-[#1f3445]/70">Company</p>
                <p className="text-[#1f3445] font-medium">{internship.company}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#1f3445]/5 rounded-lg">
              <Users className="w-5 h-5 text-[#1f3445]" />
              <div>
                <p className="text-sm text-[#1f3445]/70">Contact Person</p>
                <p className="text-[#1f3445] font-medium">{internship.contact_person}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}