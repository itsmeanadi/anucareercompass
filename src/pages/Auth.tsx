import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useRole } from '@/lib/role-context';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';

export default function Auth() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { setUserRole } = useRole();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Determine user role from Firestore
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

        await setUserRole(userRole as 'applicant' | 'recruiter');

        // Redirect based on role and onboarding status
        if (userRole === 'recruiter') {
          navigate('/recruiter-dashboard');
        } else if (!onboardingCompleted) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Check if passwords match
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }

        // Create new user with Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user profile in Firestore
        const { setDoc, doc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          role: 'applicant',
          createdAt: new Date(),
          onboardingCompleted: false
        });

        await setUserRole('applicant');
        navigate('/onboarding');
      }
    } catch (error) {
      console.error(isLogin ? 'Login' : 'Signup', 'error:', error);
      let message = isLogin ? 'Login failed' : 'Signup failed';
      if (error instanceof Error) {
        message += ': ' + error.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { signInWithGoogle } = await import('@/lib/firebase');
      const userData = await signInWithGoogle();

      // Check if user already exists in Firestore
      const { doc, getDoc, setDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const userRef = doc(db, 'users', userData.uid);
      const userSnap = await getDoc(userRef);

      let userRole = 'applicant';
      let onboardingCompleted = false;

      if (userSnap.exists()) {
        const userDataFromDB = userSnap.data();
        userRole = userDataFromDB.role || 'applicant';
        onboardingCompleted = userDataFromDB.onboardingCompleted || false;

        // Update user role in context
        await setUserRole(userRole as 'applicant' | 'recruiter');
      } else {
        // Create user profile in Firestore
        await setDoc(userRef, {
          uid: userData.uid,
          email: userData.email,
          role: 'applicant',
          photoURL: userData.photoURL,
          displayName: userData.displayName,
          createdAt: new Date(),
          onboardingCompleted: false
        });

        // Update user role in context
        await setUserRole('applicant');
      }

      // Redirect based on role and onboarding status
      if (userRole === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else if (!onboardingCompleted) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      let message = 'Google authentication failed';

      if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes('popup-blocked')) {
          message = 'Popup was blocked. Please allow popups for this site and try again.';
        } else if (error.message.includes('popup-closed-by-user') || error.message.includes('cancelled')) {
          message = 'Sign-in was cancelled. Please try again.';
        } else if (error.message.includes('network')) {
          message = 'Network error. Please check your connection and try again.';
        } else {
          message += ': ' + error.message;
        }
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f3445]/10 to-blue-950/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1f3445] mb-2">Perfect Placement</h1>
          <p className="text-[#1f3445]/70">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-[#1f3445]/30 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-[#1f3445] font-bold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-[#1f3445]/30 text-[#1f3445]"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-[#1f3445] font-bold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-[#1f3445]/30 text-[#1f3445]"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword" className="text-[#1f3445] font-bold">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 border-[#1f3445]/30 text-[#1f3445]"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-[#1f3445] hover:bg-[#1f3445]/90 text-white font-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : isLogin ? 'Sign In' : 'Sign Up'}
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
                onClick={handleGoogleAuth}
                disabled={loading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                className="text-[#1f3445] font-bold hover:text-[#1f3445]/80"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                asChild
                className="text-[#1f3445] font-bold hover:text-[#1f3445]/80"
              >
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}