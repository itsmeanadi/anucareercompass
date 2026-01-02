import { ArrowRight, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">AI-Powered Career Intelligence</span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          Your Personal
          <span className="gradient-text"> Career Assistant</span>
          <br />
          for College Success
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Get personalized internship recommendations, skill gap analysis, and senior-verified guidance
          tailored to your unique profile and career goals.
        </p>

        {/* CTA Button */}
        <Button 
          size="lg" 
          className="h-14 px-8 text-lg font-semibold bg-accent hover:bg-accent/90 text-accent-foreground glow-accent"
          onClick={() => navigate('/auth')}
        >
          Get Started
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>

        {/* Features row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="glass rounded-2xl p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Personalized Matching</h3>
            <p className="text-muted-foreground text-sm">
              AI-powered recommendations based on your skills, preferences, and eligibility
            </p>
          </div>

          <div className="glass rounded-2xl p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Skill Gap Analysis</h3>
            <p className="text-muted-foreground text-sm">
              Identify what you need to learn and get structured roadmaps for growth
            </p>
          </div>

          <div className="glass rounded-2xl p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Senior Guidance</h3>
            <p className="text-muted-foreground text-sm">
              Connect with verified seniors for real insights and mentorship
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
