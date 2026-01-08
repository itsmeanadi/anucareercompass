import { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/lib/role-context';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function RoleSelection() {
  const { setUserRole } = useRole();
  const [selectedRole, setSelectedRole] = useState<'applicant' | 'recruiter' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    designation: '',
    email: '',
    password: '',
  });
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRole === 'applicant') {
      // For applicant, we'll redirect to the applicant dashboard
      navigate('/dashboard');
    } else if (selectedRole === 'recruiter') {
      // Set user role as recruiter
      await setUserRole('recruiter');
      // Handle recruiter login/signup
      navigate('/recruiter-dashboard');
    }
  };

  const [applicantIsLogin, setApplicantIsLogin] = useState(true);
  const [applicantFormData, setApplicantFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleApplicantInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplicantFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplicantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (applicantIsLogin) {
      // For login, sign in the user
      const { error } = await supabase.auth.signInWithPassword({
        email: applicantFormData.email,
        password: applicantFormData.password,
      });
      
      if (error) {
        toast.error('Login failed: ' + error.message);
        return;
      }
      
      // Set user role as applicant
      await setUserRole('applicant');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } else {
      // For signup, create a new user
      const { error, data } = await supabase.auth.signUp({
        email: applicantFormData.email,
        password: applicantFormData.password,
        options: {
          data: {
            full_name: applicantFormData.fullName,
          }
        }
      });
      
      if (error) {
        toast.error('Signup failed: ' + error.message);
        return;
      }
      
      if (data.user) {
        // Create profile in the database
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            user_id: data.user.id,
            full_name: applicantFormData.fullName,
            email: applicantFormData.email,
            role: 'applicant',
            onboarding_completed: false
          }]);
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
          toast.error('Error creating profile');
        }
        
        // Set user role as applicant
        await setUserRole('applicant');
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
    }
  };

  const renderRightPanel = () => {
    if (selectedRole === 'applicant') {
      return (
        <form onSubmit={handleApplicantSubmit} className="bg-white/90 rounded-2xl shadow-lg p-8 border border-[#1f3445]/30">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#1f3445]">
              {applicantIsLogin ? 'Applicant Login' : 'Create Applicant Account'}
            </h2>
            <p className="text-[#1f3445]/70 mt-2">
              {applicantIsLogin ? 'Access your account to continue your journey' : 'Create your account to get started'}
            </p>
          </div>
          
          <div className="space-y-4">
            {!applicantIsLogin && (
              <div>
                <Label htmlFor="applicant-fullName" className="text-[#1f3445] font-bold">Full Name</Label>
                <Input 
                  id="applicant-fullName" 
                  name="fullName" 
                  value={applicantFormData.fullName}
                  onChange={handleApplicantInputChange}
                  className="h-12 border-[#1f3445]/30 text-[#1f3445]"
                  required={!applicantIsLogin}
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="applicant-email" className="text-[#1f3445] font-bold">Email Address</Label>
              <Input 
                id="applicant-email" 
                name="email" 
                type="email" 
                value={applicantFormData.email}
                onChange={handleApplicantInputChange}
                className="h-12 border-[#1f3445]/30 text-[#1f3445]"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="applicant-password" className="text-[#1f3445] font-bold">Password</Label>
              <Input 
                id="applicant-password" 
                name="password" 
                type="password" 
                value={applicantFormData.password}
                onChange={handleApplicantInputChange}
                className="h-12 border-[#1f3445]/30 text-[#1f3445]"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#1f3445] hover:bg-[#1f3445]/90 text-white font-bold"
            >
              {applicantIsLogin ? 'Login as Applicant' : 'Create Applicant Account'}
            </Button>
            
            <div className="text-center mt-4">
              <Button 
                type="button" 
                variant="link" 
                className="text-[#1f3445] font-bold hover:text-[#1f3445]/80"
                onClick={() => setApplicantIsLogin(!applicantIsLogin)}
              >
                {applicantIsLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
              </Button>
            </div>
          </div>
        </form>
      );
    }
    
    if (selectedRole === 'recruiter') {
      return (
        <form onSubmit={handleSubmit} className="bg-white/90 rounded-2xl shadow-lg p-8 border border-[#1f3445]/30">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#1f3445]">
              {isLogin ? 'Recruiter Login' : 'Recruiter Sign Up'}
            </h2>
            <p className="text-[#1f3445]/70 mt-2">
              {isLogin ? 'Access your recruiter account' : 'Create your recruiter account'}
            </p>
          </div>
          
          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="fullName" className="text-[#1f3445] font-bold">Full Name</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="h-12 border-[#1f3445]/30 text-[#1f3445]"
                    required={!isLogin}
                  />
                </div>
                
                <div>
                  <Label htmlFor="companyName" className="text-[#1f3445] font-bold">Company Name</Label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="h-12 border-[#1f3445]/30 text-[#1f3445]"
                    required={!isLogin}
                  />
                </div>
                
                <div>
                  <Label htmlFor="designation" className="text-[#1f3445] font-bold">Designation</Label>
                  <Input 
                    id="designation" 
                    name="designation" 
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="h-12 border-[#1f3445]/30 text-[#1f3445]"
                    required={!isLogin}
                  />
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email" className="text-[#1f3445] font-bold">Official Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email}
                onChange={handleInputChange}
                className="h-12 border-[#1f3445]/30 text-[#1f3445]"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-[#1f3445] font-bold">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={formData.password}
                onChange={handleInputChange}
                className="h-12 border-[#1f3445]/30 text-[#1f3445]"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#1f3445] hover:bg-[#1f3445]/90 text-white font-bold"
            >
              {isLogin ? 'Login as Recruiter' : 'Sign Up as Recruiter'}
            </Button>
            
            <div className="text-center mt-4">
              <Button 
                type="button" 
                variant="link" 
                className="text-[#1f3445] font-bold hover:text-[#1f3445]/80"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
              </Button>
            </div>
          </div>
        </form>
      );
    }
    
    // Default content when no role is selected
    return (
      <div className="bg-white/90 rounded-2xl shadow-lg p-8 border border-[#1f3445]/30 text-center">
        <h2 className="text-2xl font-bold text-[#1f3445] mb-4">Welcome to CareerPath</h2>
        <p className="text-[#1f3445]/70 mb-6">Select your role to continue</p>
        <p className="text-[#1f3445]/60 text-sm">Choose whether you are looking for internships or hiring talent</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f3445]/10 to-blue-950/20">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Half - Role Selection (Static) */}
          <div className="flex flex-col justify-center">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-[#1f3445] mb-4">CareerPath</h1>
              <p className="text-lg text-[#1f3445]/80 font-medium">Connecting talent with opportunity</p>
            </div>
            
            <div className="space-y-6">
              <Card 
                className={`bg-white/90 border-[#1f3445]/30 hover:border-[#1f3445] transition-colors cursor-pointer ${selectedRole === 'applicant' ? 'border-[#1f3445] bg-white/95' : ''}`}
                onClick={() => setSelectedRole('applicant')}
              >
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold text-[#1f3445]">Are you an Applicant?</CardTitle>
                  <p className="text-[#1f3445]/70 mt-2">Find your dream internship and grow your career</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`bg-white/90 border-[#1f3445]/30 hover:border-[#1f3445] transition-colors cursor-pointer ${selectedRole === 'recruiter' ? 'border-[#1f3445] bg-white/95' : ''}`}
                onClick={() => setSelectedRole('recruiter')}
              >
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold text-[#1f3445]">Are you a Recruiter?</CardTitle>
                  <p className="text-[#1f3445]/70 mt-2">Find the best talent for your organization</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Right Half - Dynamic Content */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {renderRightPanel()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
