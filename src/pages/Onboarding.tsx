import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useRole } from '@/lib/role-context';
import { useOnboarding } from '@/hooks/use-onboarding';
import { supabase } from '@/integrations/supabase/client';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { StepAcademic } from '@/components/onboarding/StepAcademic';
import { StepSkills } from '@/components/onboarding/StepSkills';
import { StepExperience } from '@/components/onboarding/StepExperience';
import { StepPreferences } from '@/components/onboarding/StepPreferences';
import { StepGoals } from '@/components/onboarding/StepGoals';
import { StepGuidance } from '@/components/onboarding/StepGuidance';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { userRole } = useRole();
  const { currentStep, totalSteps, data, updateData, nextStep, prevStep, loading: onboardingLoading } = useOnboarding();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    try {
      // Save onboarding data - use upsert with on_conflict specified
      const { error: onboardingError } = await supabase.from('onboarding_data').upsert({
        user_id: user.id,
        year_of_study: data.yearOfStudy,
        cgpa_range: data.cgpaRange,
        active_backlogs: data.activeBacklogs,
        education_stream: data.educationStream,
        university_name: data.universityName,
        degree_branch: data.degreeBranch,
        target_industries: data.targetIndustries,
        primary_technical_strength: data.primaryTechnicalStrength,
        secondary_skills: data.secondarySkills,
        certification_status: data.certificationStatus,
        project_experience_level: data.projectExperienceLevel,
        has_previous_internships: data.hasPreviousInternships,
        internship_details: data.internshipDetails,
        has_hackathon_experience: data.hasHackathonExperience,
        has_opensource_experience: data.hasOpensourceExperience,
        interview_comfort: data.interviewComfort,
        aptitude_comfort: data.aptitudeComfort,
        internship_type_preference: data.internshipTypePreference,
        preferred_duration: data.preferredDuration,
        govt_internship_interest: data.govtInternshipInterest,
        relocation_readiness: data.relocationReadiness,
        primary_goal: data.primaryGoal,
        target_companies: data.targetCompanies,
        weekly_commitment_hours: data.weeklyCommitmentHours,
        learning_style: data.learningStyle,
        wants_senior_guidance: data.wantsSeniorGuidance,
        wants_peer_comparison: data.wantsPeerComparison,
      }, {
        onConflict: 'user_id',
      });

      if (onboardingError) throw onboardingError;

      // Mark onboarding as complete
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      toast.success('Profile created successfully!');
      
      // Redirect based on user role
      if (userRole === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || onboardingLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1f3445]/10 to-blue-950/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepAcademic data={data} updateData={updateData} />;
      case 2: return <StepSkills data={data} updateData={updateData} />;
      case 3: return <StepExperience data={data} updateData={updateData} />;
      case 4: return <StepPreferences data={data} updateData={updateData} />;
      case 5: return <StepGoals data={data} updateData={updateData} />;
      case 6: return <StepGuidance data={data} updateData={updateData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f3445]/10 to-blue-950/20">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1f3445] to-slate-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Perfect Placement</span>
          </div>
          <span className="text-sm font-bold text-[#1f3445]">Step {currentStep} of {totalSteps}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <div className="glass rounded-2xl p-6 sm:p-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="h-12 px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={nextStep} className="h-12 px-8 bg-[#1f3445] hover:bg-[#1f3445]/90 text-white">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="h-12 px-8 bg-[#1f3445] hover:bg-[#1f3445]/90 text-white"
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Complete Setup
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
