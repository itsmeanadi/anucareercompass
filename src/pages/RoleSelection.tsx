import { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/lib/role-context';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';
import { signInWithGoogle } from '@/lib/firebase';

interface FormData {
  fullName: string;
  companyName: string;
  designation: string;
  email: string;
  password: string;
}

interface ApplicantFormData {
  fullName: string;
  email: string;
  password: string;
}

export default function RoleSelection() {
  const { setUserRole } = useRole();
  const [selectedRole, setSelectedRole] = useState<'applicant' | 'recruiter' | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    companyName: '',
    designation: '',
    email: '',
    password: '',
  });
  const [isLogin, setIsLogin] = useState<boolean>(true);
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

  const [applicantIsLogin, setApplicantIsLogin] = useState<boolean>(true);
  const [applicantFormData, setApplicantFormData] = useState<ApplicantFormData>({
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
      // For login, sign in the user with Firebase
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          applicantFormData.email,
          applicantFormData.password
        );
        const user = userCredential.user;

        // Check onboarding status from Firestore
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        let userRole = 'applicant';
        let onboardingCompleted = false;

        if (userSnap.exists()) {
          const userData = userSnap.data();
          userRole = userData.role || 'applicant';
          onboardingCompleted = userData.onboardingCompleted || false;
        }

        // Set user role
        await setUserRole(userRole as 'applicant' | 'recruiter');

        // Navigate based on onboarding status
        if (!onboardingCompleted) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        let message = 'Login failed';
        if (error instanceof Error) {
          message += ': ' + error.message;
        }
        toast.error(message);
      }
    } else {
      // For signup, create a new user with Firebase
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          applicantFormData.email,
          applicantFormData.password
        );
        const user = userCredential.user;

        // Create profile in Firestore
        const { setDoc, doc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          fullName: applicantFormData.fullName,
          role: 'applicant',
          createdAt: new Date(),
          onboardingCompleted: false
        });

        // Set user role as applicant
        await setUserRole('applicant');

        // Navigate to onboarding for new users
        navigate('/onboarding');
      } catch (error) {
        let message = 'Signup failed';
        if (error instanceof Error) {
          message += ': ' + error.message;
        }
        toast.error(message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Sign in with Firebase Google Auth
      const userData = await signInWithGoogle();

      // Check if user already exists in Firestore
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const userRef = doc(db, 'users', userData.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // User exists, get their role from Firestore
        const userDataFromDB = userSnap.data();
        const userRole = userDataFromDB.role || 'applicant';
        const onboardingCompleted = userDataFromDB.onboardingCompleted || false;

        await setUserRole(userRole as 'applicant' | 'recruiter');

        // Navigate based on role and onboarding status
        if (userRole === 'recruiter') {
          navigate('/recruiter-dashboard');
        } else if (!onboardingCompleted) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      } else {
        // New user, create profile in Firestore
        const { setDoc } = await import('firebase/firestore');
        await setDoc(userRef, {
          uid: userData.uid,
          email: userData.email,
          fullName: userData.displayName || '',
          role: 'applicant', // Default to applicant
          photoURL: userData.photoURL,
          createdAt: new Date(),
          onboardingCompleted: false
        });

        await setUserRole('applicant');
        navigate('/onboarding'); // Send new users to onboarding
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      let message = 'Google sign-in failed';
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
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

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-[#1f3445]/30 text-[#1f3445] font-bold hover:bg-[#1f3445]/5 flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
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
        <h2 className="text-2xl font-bold text-[#1f3445] mb-4">Welcome to Perfect Placement</h2>
        <p className="text-[#1f3445]/70 mb-6">Select your role to continue</p>
        <p className="text-[#1f3445]/60 text-sm">Choose whether you are looking for internships or hiring talent</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-600">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Half - Role Selection (Static) */}
          <div className="flex flex-col justify-center">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">Perfect Placement</h1>
              <p className="text-lg text-blue-100 font-medium">Connecting talent with opportunity</p>
            </div>

            <div className="space-y-6">
              <Card
                className={`bg-white/90 border-white/20 hover:bg-white hover:scale-[1.02] transition-all cursor-pointer shadow-xl ${selectedRole === 'applicant' ? 'ring-4 ring-blue-300' : ''}`}
                onClick={() => setSelectedRole('applicant')}
              >
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold text-slate-900">Are you an Applicant?</CardTitle>
                  <p className="text-slate-600 mt-2">Find your dream internship and grow your career</p>
                </CardContent>
              </Card>

              <Card
                className={`bg-white/90 border-white/20 hover:bg-white hover:scale-[1.02] transition-all cursor-pointer shadow-xl ${selectedRole === 'recruiter' ? 'ring-4 ring-purple-300' : ''}`}
                onClick={() => setSelectedRole('recruiter')}
              >
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold text-slate-900">Are you a Recruiter?</CardTitle>
                  <p className="text-slate-600 mt-2">Find the best talent for your organization</p>
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