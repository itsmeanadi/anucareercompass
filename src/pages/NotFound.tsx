import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useRole } from "@/lib/role-context";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userRole } = useRole();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Redirect recruiters to their dashboard if they're logged in
    if (user && userRole === 'recruiter') {
      navigate('/recruiter-dashboard');
    }
  }, [location.pathname, user, userRole, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1f3445]/10 to-blue-950/20">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-[#1f3445]">404</h1>
        <p className="mb-4 text-xl text-[#1f3445] font-medium">Oops! Page not found</p>
        <a href="/" className="text-[#1f3445] underline hover:text-[#1f3445]/80 font-bold">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
