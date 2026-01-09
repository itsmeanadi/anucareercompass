import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useRole } from '@/lib/role-context';
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
  match: number,
  skills: string[];
  rating: number;
  reviews: { id: string; author: string; content: string; rating: number; date: string }[];
}

// Mock internship data (would come from API in production)
const mockInternships: Internship[] = [
  { id: '1', title: 'Software Development Intern', company: 'Google India', location: 'Bangalore', duration: '3 months', stipend: 80000, type: 'private', match: 95, skills: ['Python', 'ML', 'DSA'], rating: 4.8, reviews: [
    { id: 'r1', author: 'Rahul K.', content: 'Great learning experience with excellent mentorship. Got to work on cutting-edge technologies.', rating: 5, date: '2024-01-15' },
    { id: 'r2', author: 'Priya S.', content: 'Challenging projects and good work-life balance. Helped me grow my technical skills significantly.', rating: 4, date: '2024-01-10' },
  ] },
  { id: '2', title: 'Data Science Intern', company: 'Microsoft', location: 'Hyderabad', duration: '6 months', stipend: 75000, type: 'private', match: 92, skills: ['Python', 'SQL', 'Tableau'], rating: 4.7, reviews: [
    { id: 'r3', author: 'Amit P.', content: 'Outstanding team and amazing learning opportunities. Got to work on real-world problems.', rating: 5, date: '2024-01-12' },
    { id: 'r4', author: 'Sneha M.', content: 'Good exposure to data science tools and methodologies. Mentors were very supportive.', rating: 4, date: '2024-01-08' },
  ] },
  { id: '3', title: 'Backend Engineering Intern', company: 'Amazon', location: 'Remote', duration: '3 months', stipend: 70000, type: 'private', match: 88, skills: ['Java', 'AWS', 'Microservices'], rating: 4.5, reviews: [
    { id: 'r5', author: 'Vikram R.', content: 'Fast-paced environment with great learning curve. Had to work on high-scale systems.', rating: 4, date: '2024-01-05' },
    { id: 'r6', author: 'Neha T.', content: 'Good experience overall. The code review process was very educational.', rating: 5, date: '2024-01-03' },
  ] },
  { id: '4', title: 'AI Research Intern', company: 'ISRO', location: 'Bangalore', duration: '6 months', stipend: 35000, type: 'govt', match: 85, skills: ['ML', 'Python', 'Research'], rating: 4.9, reviews: [
    { id: 'r7', author: 'Arjun P.', content: 'Fascinating work on space technology. Research environment was very collaborative.', rating: 5, date: '2024-01-07' },
    { id: 'r8', author: 'Kavya N.', content: 'Unique experience working on satellite data analysis. Highly recommended for research enthusiasts.', rating: 5, date: '2024-01-02' },
  ] },
  { id: '5', title: 'Product Management Intern', company: 'Flipkart', location: 'Bangalore', duration: '4 months', stipend: 60000, type: 'private', match: 82, skills: ['Analytics', 'Strategy', 'SQL'], rating: 4.4, reviews: [
    { id: 'r9', author: 'Rohit K.', content: 'Great exposure to e-commerce domain. Got to work on real product decisions.', rating: 4, date: '2024-01-09' },
    { id: 'r10', author: 'Ananya S.', content: 'Good mentorship and learning opportunities. Fast-paced environment.', rating: 5, date: '2024-01-04' },
  ] },
  { id: '6', title: 'Full Stack Developer Intern', company: 'Razorpay', location: 'Bangalore', duration: '3 months', stipend: 55000, type: 'private', match: 80, skills: ['React', 'Node.js', 'MongoDB'], rating: 4.6, reviews: [
    { id: 'r11', author: 'Siddharth M.', content: 'Great startup environment with hands-on experience. Team was very supportive.', rating: 5, date: '2024-01-11' },
    { id: 'r12', author: 'Pooja R.', content: 'Good learning experience. Got to work on payment systems which was exciting.', rating: 4, date: '2024-01-06' },
  ] },
  { id: '7', title: 'Cyber Security Intern', company: 'DRDO', location: 'Delhi', duration: '6 months', stipend: 30000, type: 'govt', match: 78, skills: ['Security', 'Networking', 'Python'], rating: 4.7, reviews: [
    { id: 'r13', author: 'Deepak K.', content: 'Unique experience in government security domain. Got to learn about national security aspects.', rating: 5, date: '2024-01-13' },
    { id: 'r14', author: 'Meera L.', content: 'Good technical exposure. Strict security protocols made it challenging but educational.', rating: 4, date: '2024-01-01' },
  ] },
  { id: '8', title: 'Cloud Engineering Intern', company: 'Infosys', location: 'Pune', duration: '3 months', stipend: 40000, type: 'private', match: 75, skills: ['AWS', 'Docker', 'Linux'], rating: 4.2, reviews: [
    { id: 'r15', author: 'Rajesh T.', content: 'Decent learning experience. Good exposure to enterprise cloud solutions.', rating: 4, date: '2024-01-14' },
    { id: 'r16', author: 'Swati G.', content: 'Structured learning path. Got to work on multiple cloud technologies.', rating: 4, date: '2023-12-28' },
  ] },
  { id: '9', title: 'Data Analyst Intern', company: 'NITI Aayog', location: 'Delhi', duration: '2 months', stipend: 25000, type: 'govt', match: 72, skills: ['Excel', 'Python', 'Statistics'], rating: 4.5, reviews: [
    { id: 'r17', author: 'Karan S.', content: 'Interesting work on policy analysis. Got to work with government data.', rating: 4, date: '2023-12-30' },
    { id: 'r18', author: 'Divya P.', content: 'Unique experience in policy domain. Good for understanding governance.', rating: 5, date: '2023-12-25' },
  ] },
  { id: '10', title: 'DevOps Intern', company: 'Paytm', location: 'Noida', duration: '4 months', stipend: 45000, type: 'private', match: 70, skills: ['CI/CD', 'Kubernetes', 'AWS'], rating: 4.3, reviews: [
    { id: 'r19', author: 'Alok J.', content: 'Good exposure to fintech DevOps practices. Learned about scaling systems.', rating: 4, date: '2023-12-29' },
    { id: 'r20', author: 'Riya M.', content: 'Hands-on experience with production systems. Great mentorship.', rating: 5, date: '2023-12-27' },
  ] },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { userRole, loading: roleLoading } = useRole();
  const [profile, setProfile] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visibleInternships, setVisibleInternships] = useState(10);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [newReview, setNewReview] = useState({ content: '', rating: 5 });
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [internships, setInternships] = useState<Internship[]>(mockInternships);
  const [sortOption, setSortOption] = useState<'stipend' | 'rating' | 'match' | 'duration'>('stipend');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    // Redirect recruiters to their dashboard
    if (user && userRole === 'recruiter') {
      navigate('/recruiter-dashboard');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, authLoading, userRole, navigate]);

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

  if (authLoading || roleLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
                <span className="text-[#1f3445]/90">Technical Skills</span>
                <span className="text-[#1f3445] font-bold">75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-[#1f3445]/90">Soft Skills</span>
                <span className="text-[#1f3445] font-bold">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </div>

          {/* Learning Roadmap */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1f3445]">Your Learning Roadmap</h3>
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-10" onClick={() => navigate('/roadmap')}>
                <BookOpen className="w-4 h-4 mr-2" /> View Personalized Roadmap
              </Button>
              <div className="text-sm text-[#1f3445]/80 mt-2">
                Follow your customized learning path
              </div>
            </div>
          </div>
        </div>

        {/* Internship Recommendations */}
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#1f3445]">Recommended Internships</h2>
              <p className="text-sm text-[#1f3445]">Sorted by highest stipend</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#1f3445] hidden sm:block">Sort by:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'stipend' | 'rating' | 'match' | 'duration')}
                className="bg-background border border-[#1f3445]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f3445] focus:border-[#1f3445] text-[#1f3445] font-medium"
              >
                <option value="stipend">Stipend</option>
                <option value="rating">Rating</option>
                <option value="match">Match</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {(() => {
              // Sort internships based on the selected option
              const sortedInternships = [...internships].sort((a, b) => {
                switch (sortOption) {
                  case 'stipend':
                    return b.stipend - a.stipend; // Highest stipend first
                  case 'rating':
                    return b.rating - a.rating; // Highest rating first
                  case 'match':
                    return b.match - a.match; // Highest match first
                  case 'duration':
                    // Sort by duration (convert to months for comparison)
                    const getDurationInMonths = (duration: string): number => {
                      const monthsMatch = duration.match(/(\d+)(?:-(\d+))?\s*months?/i);
                      if (monthsMatch) {
                        const min = parseInt(monthsMatch[1]);
                        const max = monthsMatch[2] ? parseInt(monthsMatch[2]) : min;
                        return (min + max) / 2; // Use average if range provided
                      }
                      return 0;
                    };
                    return getDurationInMonths(b.duration) - getDurationInMonths(a.duration);
                  default:
                    return b.stipend - a.stipend; // Default to stipend
                }
              });
              return sortedInternships.slice(0, visibleInternships).map((internship) => (
                <div 
                  key={internship.id} 
                  className="border border-border rounded-xl p-4 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={(e) => {
                    // Only navigate if the click was not on the rating button
                    if (!(e.target as HTMLElement).closest('button')) {
                      navigate(`/internship/${internship.id}`);
                    }
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[#1f3445]">{internship.title}</h3>
                        <Badge variant={internship.type === 'govt' ? 'secondary' : 'outline'} className="text-xs bg-[#1f3445]/10 text-[#1f3445]">
                          {internship.type === 'govt' ? 'Govt' : 'Private'}
                        </Badge>
                      </div>
                      <p className="text-[#1f3445]/90 text-sm">{internship.company}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 text-[#1f3445]/80">
                          <MapPin className="w-4 h-4 text-[#1f3445]/80" /> {internship.location}
                        </span>
                        <span className="flex items-center gap-1 text-[#1f3445]/80">
                          <Clock className="w-4 h-4 text-[#1f3445]/80" /> {internship.duration}
                        </span>
                        <span className="flex items-center gap-1 text-[#1f3445] font-bold">
                          <IndianRupee className="w-4 h-4 text-[#1f3445]" /> {internship.stipend.toLocaleString()}/mo
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {internship.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs bg-[#1f3445]/10 text-[#1f3445]">{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#1f3445]">{internship.match.toFixed(2)}%</div>
                        <div className="text-xs text-muted-foreground">Match</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedInternship(internship);
                          setShowReviewsModal(true);
                        }}
                        className="text-xs h-8 flex items-center gap-1 border-[#1f3445] text-[#1f3445] font-bold"
                      >
                        <Star className="h-3 w-3 text-[#1f3445]" />
                        {internship.rating.toFixed(2)}
                      </Button>
                    </div>
                  </div>

                  {internship.match < 80 && (
                    <div className="mt-3 p-2 rounded-lg bg-[#1f3445]/10 border border-[#1f3445]/30 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#1f3445]" />
                      <span className="text-xs text-[#1f3445]">Some eligibility requirements may not match</span>
                    </div>
                  )}
                </div>
              ))
            })()}
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
      
      {/* Reviews Modal */}
      {showReviewsModal && selectedInternship && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedInternship.title}</h3>
                  <p className="text-muted-foreground">{selectedInternship.company}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowReviewsModal(false)}
                  className="text-muted-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </Button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-2xl font-bold text-[#1f3445]">{selectedInternship.rating}</div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(selectedInternship.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-[#1f3445]/80">({selectedInternship.reviews.length} reviews)</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Add Review Form */}
                <div className="border border-border rounded-lg p-4 mb-6">
                  <h4 className="font-medium mb-3">Add Your Anonymous Review</h4>
                  <div className="mb-3">
                    <label className="text-sm text-muted-foreground mb-1 block">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          type="button"
                          onClick={() => setNewReview({...newReview, rating: star})}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`h-6 w-6 ${star <= newReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="text-sm text-muted-foreground mb-1 block">Your Review</label>
                    <textarea 
                      value={newReview.content}
                      onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground min-h-[80px]"
                      placeholder="Share your experience..."
                    />
                  </div>
                  <Button 
                    onClick={async () => {
                      if (newReview.content.trim() && selectedInternship) {
                        // Create a new review object
                        const newReviewObj = {
                          id: `r${Date.now()}`, // Generate a unique ID
                          author: 'Anonymous', // Keep it anonymous
                          content: newReview.content,
                          rating: newReview.rating,
                          date: new Date().toISOString().split('T')[0]
                        };
                        
                        // Update the selected internship with the new review
                        const updatedSelectedInternship = {
                          ...selectedInternship,
                          reviews: [newReviewObj, ...selectedInternship.reviews],
                          // Update the average rating, rounded to 2 decimal places
                          rating: Number(((selectedInternship.rating * selectedInternship.reviews.length + newReview.rating) / (selectedInternship.reviews.length + 1)).toFixed(2))
                        };
                        
                        // Update the internships list
                        const updatedInternships = internships.map(internship => 
                          internship.id === selectedInternship.id 
                            ? updatedSelectedInternship 
                            : internship
                        );
                        
                        // Update states
                        setInternships(updatedInternships);
                        setSelectedInternship(updatedSelectedInternship);
                        
                        // Reset the form
                        setNewReview({ content: '', rating: 5 });
                        toast.success('Review submitted successfully!');
                      } else {
                        toast.error('Please enter a review before submitting');
                      }
                    }}
                    className="w-full"
                  >
                    Submit Anonymous Review
                  </Button>
                </div>
                
                <h4 className="font-medium mb-3">Anonymous Reviews</h4>
                
                {selectedInternship.reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className={`h-4 w-4 ${review.rating >= 1 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                        <Star className={`h-4 w-4 ${review.rating >= 2 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                        <Star className={`h-4 w-4 ${review.rating >= 3 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                        <Star className={`h-4 w-4 ${review.rating >= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                        <Star className={`h-4 w-4 ${review.rating >= 5 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                        <span className="text-sm ml-1">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-[#1f3445]/90 mb-2">{review.content}</p>
                    <div className="text-xs text-[#1f3445]/70">{new Date(review.date).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
