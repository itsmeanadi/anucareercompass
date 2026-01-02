import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, LogOut, MapPin, Clock, IndianRupee, Star, 
  TrendingUp, AlertTriangle, ChevronRight, Loader2, Target,
  BookOpen, Users
} from 'lucide-react';
import { toast } from 'sonner';

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: number;
  type: 'govt' | 'private';
  rating: number;
  match: number;
  skills: string[];
}

// Mock internship data (would come from API in production)
const mockInternships: Internship[] = [
  { id: '1', title: 'Software Development Intern', company: 'Google India', location: 'Bangalore', duration: '3 months', stipend: 80000, type: 'private', rating: 4.8, match: 95, skills: ['Python', 'ML', 'DSA'] },
  { id: '2', title: 'Data Science Intern', company: 'Microsoft', location: 'Hyderabad', duration: '6 months', stipend: 75000, type: 'private', rating: 4.7, match: 92, skills: ['Python', 'SQL', 'Tableau'] },
  { id: '3', title: 'Backend Engineering Intern', company: 'Amazon', location: 'Remote', duration: '3 months', stipend: 70000, type: 'private', rating: 4.5, match: 88, skills: ['Java', 'AWS', 'Microservices'] },
  { id: '4', title: 'AI Research Intern', company: 'ISRO', location: 'Bangalore', duration: '6 months', stipend: 35000, type: 'govt', rating: 4.9, match: 85, skills: ['ML', 'Python', 'Research'] },
  { id: '5', title: 'Product Management Intern', company: 'Flipkart', location: 'Bangalore', duration: '4 months', stipend: 60000, type: 'private', rating: 4.4, match: 82, skills: ['Analytics', 'Strategy', 'SQL'] },
  { id: '6', title: 'Full Stack Developer Intern', company: 'Razorpay', location: 'Bangalore', duration: '3 months', stipend: 55000, type: 'private', rating: 4.6, match: 80, skills: ['React', 'Node.js', 'MongoDB'] },
  { id: '7', title: 'Cyber Security Intern', company: 'DRDO', location: 'Delhi', duration: '6 months', stipend: 30000, type: 'govt', rating: 4.7, match: 78, skills: ['Security', 'Networking', 'Python'] },
  { id: '8', title: 'Cloud Engineering Intern', company: 'Infosys', location: 'Pune', duration: '3 months', stipend: 40000, type: 'private', rating: 4.2, match: 75, skills: ['AWS', 'Docker', 'Linux'] },
  { id: '9', title: 'Data Analyst Intern', company: 'NITI Aayog', location: 'Delhi', duration: '2 months', stipend: 25000, type: 'govt', rating: 4.5, match: 72, skills: ['Excel', 'Python', 'Statistics'] },
  { id: '10', title: 'DevOps Intern', company: 'Paytm', location: 'Noida', duration: '4 months', stipend: 45000, type: 'private', rating: 4.3, match: 70, skills: ['CI/CD', 'Kubernetes', 'AWS'] },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visibleInternships, setVisibleInternships] = useState(10);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    try {
      const [profileRes, onboardingRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user!.id).single(),
        supabase.from('onboarding_data').select('*').eq('user_id', user!.id).single()
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (onboardingRes.data) setOnboardingData(onboardingRes.data);

      // Redirect to onboarding if not completed
      if (!profileRes.data?.onboarding_completed) {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const calculateReadinessScore = () => {
    if (!onboardingData) return 0;
    let score = 50;
    if (onboardingData.cgpa_range?.includes('9') || onboardingData.cgpa_range?.includes('8')) score += 15;
    if (onboardingData.has_previous_internships) score += 15;
    if (onboardingData.has_hackathon_experience) score += 10;
    if (onboardingData.certification_status?.includes('3+')) score += 10;
    return Math.min(score, 100);
  };

  const readinessScore = calculateReadinessScore();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CareerPath</span>
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
              <h3 className="font-semibold">Placement Readiness</h3>
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="text-4xl font-bold gradient-text mb-2">{readinessScore}%</div>
            <Progress value={readinessScore} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {readinessScore >= 80 ? 'Excellent! You\'re well prepared.' : 
               readinessScore >= 60 ? 'Good progress! Keep improving.' : 
               'Room for growth. Let\'s work on it!'}
            </p>
          </div>

          {/* Skill Gap */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Skill Gap Analysis</h3>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Technical Skills</span>
                <span className="text-primary font-medium">75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>Soft Skills</span>
                <span className="text-primary font-medium">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Quick Actions</h3>
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-10">
                <BookOpen className="w-4 h-4 mr-2" /> Learning Roadmap
              </Button>
              <Button variant="outline" className="w-full justify-start h-10">
                <Users className="w-4 h-4 mr-2" /> Find a Mentor
              </Button>
            </div>
          </div>
        </div>

        {/* Internship Recommendations */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Recommended Internships</h2>
              <p className="text-sm text-muted-foreground">Sorted by highest stipend</p>
            </div>
          </div>

          <div className="space-y-4">
            {mockInternships.slice(0, visibleInternships).map((internship) => (
              <div 
                key={internship.id} 
                className="border border-border rounded-xl p-4 hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{internship.title}</h3>
                      <Badge variant={internship.type === 'govt' ? 'secondary' : 'outline'} className="text-xs">
                        {internship.type === 'govt' ? 'Govt' : 'Private'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{internship.company}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {internship.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {internship.duration}
                      </span>
                      <span className="flex items-center gap-1 text-primary font-semibold">
                        <IndianRupee className="w-4 h-4" /> {internship.stipend.toLocaleString()}/mo
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {internship.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{internship.match}%</div>
                      <div className="text-xs text-muted-foreground">Match</div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{internship.rating}</span>
                    </div>
                  </div>
                </div>

                {internship.match < 80 && (
                  <div className="mt-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-yellow-500">Some eligibility requirements may not match</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {visibleInternships < mockInternships.length && (
            <Button 
              variant="outline" 
              className="w-full mt-6"
              onClick={() => setVisibleInternships(prev => prev + 10)}
            >
              Show More Internships
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
