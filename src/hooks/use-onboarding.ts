import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface OnboardingData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function useOnboarding() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    let isActive = true;

    const loadOnboardingData = async () => {
      if (!user || !isActive) return;

      try {
        setLoading(true);
        setError(null);

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && isActive) {
          const data = userDocSnap.data();
          setOnboardingData(data.onboardingData || {});
          setCompleted(data.onboardingCompleted || false);
        } else if (isActive) {
          // If no document exists, initialize with empty data
          setOnboardingData({});
          setCompleted(false);
        }
      } catch (err) {
        if (isActive) {
          console.error('Error loading onboarding data:', err);
          setError('Failed to load onboarding data');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadOnboardingData();

    return () => {
      isActive = false;
    };
  }, [user]);

  const saveOnboardingData = async (data: OnboardingData) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        onboardingData: data,
        onboardingCompleted: true,
        updatedAt: new Date()
      }, { merge: true });

      setOnboardingData(data);
      setCompleted(true);
      return true;
    } catch (err) {
      console.error('Error saving onboarding data:', err);
      setError('Failed to save onboarding data');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    onboardingData,
    loading,
    error,
    completed,
    saveOnboardingData,
    reload: () => {
      if (user) {
        const loadOnboardingData = async () => {
          try {
            setLoading(true);
            setError(null);

            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const data = userDocSnap.data();
              setOnboardingData(data.onboardingData || {});
              setCompleted(data.onboardingCompleted || false);
            } else {
              // If no document exists, initialize with empty data
              setOnboardingData({});
              setCompleted(false);
            }
          } catch (err) {
            console.error('Error loading onboarding data:', err);
            setError('Failed to load onboarding data');
          } finally {
            setLoading(false);
          }
        };
        loadOnboardingData();
      }
    }
  };
}