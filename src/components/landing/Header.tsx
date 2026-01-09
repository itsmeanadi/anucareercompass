import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">CareerCompass</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'Market', 'Resources', 'Pricing'].map((item) => (
            <a key={item} href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-blue-600 font-medium"
            onClick={() => navigate('/auth')}
          >
            Sign in
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-600/20 font-medium transition-all hover:scale-105"
            onClick={() => navigate('/role-selection')}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
