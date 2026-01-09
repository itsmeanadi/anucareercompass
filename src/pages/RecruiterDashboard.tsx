import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  BarChart3, 
  Search, 
  Plus, 
  Calendar,
  MessageCircle,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PostInternshipForm } from '@/components/recruiter/PostInternshipForm';

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState<'internships' | 'applicants' | 'analytics'>('internships');
  const [showPostForm, setShowPostForm] = useState(false);
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchInternships();
  }, []);
  
  const fetchInternships = async () => {
    try {
      const { data, error } = await supabase
        .from('internships' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setInternships(data || []);
    } catch (error) {
      console.error('Error fetching internships:', error);
      // Set empty array if table doesn't exist yet
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for applicants
  const applicants = [
    {
      id: '101',
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      internship: 'Software Development Intern',
      status: 'Reviewed',
      appliedDate: '2024-01-15'
    },
    {
      id: '102',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      internship: 'Data Science Intern',
      status: 'Pending',
      appliedDate: '2024-01-16'
    },
    {
      id: '103',
      name: 'Amit Patel',
      email: 'amit@example.com',
      internship: 'Software Development Intern',
      status: 'Shortlisted',
      appliedDate: '2024-01-17'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f3445]/10 to-blue-950/20">
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
            Welcome back, <span className="text-[#1f3445]">Tech Corp</span>! 👋
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
            <div className="text-4xl font-bold text-[#1f3445] mb-2">2</div>
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
            <div className="text-4xl font-bold text-[#1f3445] mb-2">85</div>
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
              From applications to offers
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeTab === 'internships' ? 'default' : 'outline'}
            className={`px-6 py-3 font-bold ${
              activeTab === 'internships' 
                ? 'bg-[#1f3445] text-white hover:bg-[#1f3445]/90' 
                : 'border-[#1f3445] text-[#1f3445] hover:bg-[#1f3445]/10'
            }`}
            onClick={() => setActiveTab('internships')}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Manage Internships
          </Button>
          <Button
            variant={activeTab === 'applicants' ? 'default' : 'outline'}
            className={`px-6 py-3 font-bold ${
              activeTab === 'applicants' 
                ? 'bg-[#1f3445] text-white hover:bg-[#1f3445]/90' 
                : 'border-[#1f3445] text-[#1f3445] hover:bg-[#1f3445]/10'
            }`}
            onClick={() => setActiveTab('applicants')}
          >
            <Users className="w-4 h-4 mr-2" />
            Applicants
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'outline'}
            className={`px-6 py-3 font-bold ${
              activeTab === 'analytics' 
                ? 'bg-[#1f3445] text-white hover:bg-[#1f3445]/90' 
                : 'border-[#1f3445] text-[#1f3445] hover:bg-[#1f3445]/10'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'internships' && (
          <div className="glass rounded-2xl p-6">
            {showPostForm ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="border-[#1f3445] text-[#1f3445] hover:bg-[#1f3445]/10"
                      onClick={() => setShowPostForm(false)}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                      <h2 className="text-xl font-bold text-[#1f3445]">Post New Internship</h2>
                      <p className="text-sm text-[#1f3445]/80 font-medium">Create a new internship opportunity</p>
                    </div>
                  </div>
                </div>
                <PostInternshipForm 
                  onCancel={() => setShowPostForm(false)} 
                  onPostSuccess={fetchInternships} 
                />
              </>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#1f3445]">Your Internships</h2>
                    <p className="text-sm text-[#1f3445]/80 font-medium">Manage your posted opportunities</p>
                  </div>
                  <Button 
                    className="bg-[#1f3445] hover:bg-[#1f3445]/90 text-white font-bold h-12"
                    onClick={() => setShowPostForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Internship
                  </Button>
                </div>

                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-2 text-[#1f3445]">
                        <div className="w-4 h-4 bg-[#1f3445] rounded-full animate-bounce"></div>
                        <div className="w-4 h-4 bg-[#1f3445] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-4 h-4 bg-[#1f3445] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        <span className="ml-2 font-medium">Loading internships...</span>
                      </div>
                    </div>
                  ) : internships.length === 0 ? (
                    <div className="text-center py-8 text-[#1f3445]/60">
                      <p className="font-medium">No internships posted yet</p>
                      <p className="text-sm mt-1">Click "Post New Internship" to create your first opportunity</p>
                    </div>
                  ) : (
                    <>
                      {internships.map((internship) => (
                        <div 
                          key={internship.id} 
                          className="border border-[#1f3445]/30 rounded-xl p-4 hover:border-[#1f3445]/50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-[#1f3445]">{internship.title}</h3>
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs bg-[#1f3445]/10 text-[#1f3445] font-bold"
                                >
                                  {internship.type === 'govt' ? 'Government' : 'Private'}
                                </Badge>
                              </div>
                              <p className="text-[#1f3445]/90 text-sm mb-2">{internship.company}</p>
                              
                              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1 text-[#1f3445]/80 font-medium">
                                  <Users className="w-4 h-4 text-[#1f3445]/80" /> 0 applicants {/* TODO: Get actual applicant count */}
                                </span>
                                <span className="flex items-center gap-1 text-[#1f3445]/80 font-medium">
                                  <Calendar className="w-4 h-4 text-[#1f3445]/80" /> Deadline: {new Date(internship.application_deadline).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                              <Badge 
                                className={`text-xs px-3 py-1 font-bold ${
                                  internship.status === 'active' 
                                    ? 'bg-green-500/20 text-green-700' 
                                    : 'bg-red-500/20 text-red-700'
                                }`}
                              >
                                {internship.status === 'active' ? 'Active' : 'Inactive'}
                              </Badge>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs h-8 border-[#1f3445] text-[#1f3445] font-bold hover:bg-[#1f3445]/10"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'applicants' && (
          <div className="glass rounded-2xl p-6">
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
                    className="pl-10 pr-4 py-2 border border-[#1f3445]/30 rounded-lg bg-white/50 text-[#1f3445] focus:outline-none focus:ring-2 focus:ring-[#1f3445] focus:border-[#1f3445]"
                  />
                </div>
                <Button variant="outline" className="border-[#1f3445] text-[#1f3445] hover:bg-[#1f3445]/10">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {applicants.map((applicant) => (
                <div 
                  key={applicant.id} 
                  className="border border-[#1f3445]/30 rounded-xl p-4 hover:border-[#1f3445]/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[#1f3445]">{applicant.name}</h3>
                        <Badge 
                          className={`text-xs px-3 py-1 font-bold ${
                            applicant.status === 'Shortlisted' 
                              ? 'bg-blue-500/20 text-blue-700' 
                              : applicant.status === 'Reviewed'
                              ? 'bg-green-500/20 text-green-700'
                              : 'bg-yellow-500/20 text-yellow-700'
                          }`}
                        >
                          {applicant.status}
                        </Badge>
                      </div>
                      <p className="text-[#1f3445]/90 text-sm mb-1">{applicant.email}</p>
                      <p className="text-[#1f3445]/80 text-sm">{applicant.internship}</p>
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
          <div className="glass rounded-2xl p-6">
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
      </main>
    </div>
  );
}