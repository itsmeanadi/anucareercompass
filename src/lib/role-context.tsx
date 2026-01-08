import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { supabase } from '@/integrations/supabase/client';

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
      // Update user role in database
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          user_id: user.id, 
          user_type: role,
          email: user.email || '',
        }, {
          onConflict: 'user_id'
        });
      
      if (!error) {
        setUserRoleState(role);
      }
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error || !data) {
            // If no profile exists yet, default to applicant
            setUserRoleState('applicant');
          } else {
            // Check if user_type exists in the profile data
            const profileData = data as any;
            if (profileData.user_type && ['applicant', 'recruiter'].includes(profileData.user_type)) {
              setUserRoleState(profileData.user_type);
            } else {
              // Default to applicant if no user_type is set
              setUserRoleState('applicant');
            }
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