import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface RoleContextType {
  userRole: 'applicant' | 'recruiter' | null;
  loading: boolean;
  setUserRole: (role: 'applicant' | 'recruiter') => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [userRole, setUserRoleState] = useState<'applicant' | 'recruiter' | null>(null);
  const [loading, setLoading] = useState(true);

  const setUserRole = async (role: 'applicant' | 'recruiter') => {
    if (user) {
      // Update user role in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { 
        email: user.email,
        role: role,
        updatedAt: new Date()
      }, { merge: true });
      
      setUserRoleState(role);
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.role && ['applicant', 'recruiter'].includes(userData.role)) {
              setUserRoleState(userData.role);
            } else {
              // Default to applicant if no role is set
              setUserRoleState('applicant');
            }
          } else {
            // If no user profile exists yet, default to applicant
            setUserRoleState('applicant');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRoleState('applicant');
        }
      } else {
        setUserRoleState(null);
      }
      setLoading(false);
    };

    if (!authLoading) {
      fetchUserRole();
    }
  }, [user, authLoading]);

  const value = {
    userRole,
    loading,
    setUserRole
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}