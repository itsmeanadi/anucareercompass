import { ArrowRight, CheckCircle2, Layout, Clock, BarChart3, Users, Zap, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-medium text-sm mb-6 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New: Internship Roadmap Generator
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Think, plan, and track <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              all in one place
            </span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Efficiently manage your career growth, track internship applications, and boost your skills with our senior-verified roadmaps.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 transition-all hover:-translate-y-1"
              onClick={() => navigate('/role-selection')}
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg rounded-full border-2 border-slate-200 hover:bg-slate-50 text-slate-600 hover:border-slate-300 transition-all"
            >
              View Demo
            </Button>
          </div>

          {/* Floating Elements (Decorative) */}
          <div className="hidden lg:block absolute top-10 -left-12 rotate-[-6deg] animate-float-slow">
            <div className="bg-white p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 w-64">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">New Skills</h4>
                  <p className="text-xs text-slate-500">React, TypeScript added</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute bottom-20 -right-4 rotate-[6deg] animate-float-delayed">
            <div className="bg-white p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 w-56">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-700">Application Sent</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 w-3/4 h-full rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Feature Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {/* Main Large Card */}
          <div className="col-span-1 md:col-span-2 bg-white rounded-[2rem] p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Personalized Dashboard</h3>
                <p className="text-slate-500">Track all your applications in one view</p>
              </div>
              <Button variant="ghost" className="rounded-full hover:bg-slate-100">
                <Layout className="w-5 h-5 text-slate-400" />
              </Button>
            </div>

            {/* Mock Dashboard UI inside card */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100/50">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-slate-700">Recent Activity</h4>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Weekly Report</span>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-100/50">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${i === 1 ? 'bg-blue-100 text-blue-600' : i === 2 ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                      {i === 1 ? <BarChart3 className="w-5 h-5" /> : i === 2 ? <Users className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">Application Update</h5>
                      <p className="text-xs text-slate-500">Your application to Google was viewed</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Cards Column */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-auto">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Time Tracker</h3>
              <div className="text-4xl font-bold text-slate-900 mb-2 font-mono">04:21:58</div>
              <p className="text-slate-500 text-sm">Focus time this week</p>
            </div>

            <div className="bg-blue-600 rounded-[2rem] p-8 shadow-xl shadow-blue-600/20 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <h3 className="text-xl font-bold mb-2 relative z-10">Pro Guidance</h3>
              <p className="text-blue-100 text-sm mb-6 relative z-10">Get reviews from seniors at top companies.</p>
              <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50 w-full rounded-full font-bold shadow-none border-none">
                Find Mentor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
