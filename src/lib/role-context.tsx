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
    const currentUser = user || auth.currentUser;
    if (currentUser) {
      // Update user role in Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        email: currentUser.email,
        role: role,
        updatedAt: new Date()
      }, { merge: true });

      setUserRoleState(role);
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        // HACKATHON FIX: Race against a timeout
        // If Firestore is offline or slow, we don't want to block the UI forever.
        // We default to 'applicant' if it takes too long.

        let isMounted = true;
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second timeout

        try {
          const fetchPromise = (async () => {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            return userSnap;
          })();

          const result = await Promise.race([fetchPromise, timeoutPromise]);

          if (result && isMounted) {
            // It was the fetch that won and returned a snapshot
            // (Timeout promise resolves to undefined/void)
            const snap = result as any;
            if (snap.exists && snap.exists()) {
              const userData = snap.data();
              if (userData.role && ['applicant', 'recruiter'].includes(userData.role)) {
                setUserRoleState(userData.role);
              } else {
                setUserRoleState('applicant');
              }
            } else {
              // No user profile yet or timeout
              setUserRoleState('applicant');
            }
          } else if (isMounted) {
            // Timeout won
            console.warn('Role fetch timed out, defaulting to applicant');
            setUserRoleState('applicant');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          if (isMounted) setUserRoleState('applicant');
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