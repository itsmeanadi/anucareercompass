import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useRole } from '@/lib/role-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  LogOut, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Star, 
  ArrowLeft, 
  ExternalLink,
  CheckCircle,
  Circle
} from 'lucide-react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: number;
  type: 'govt' | 'private';
  match: number;
  skills: string[];
  rating: number;
  reviews: { id: string; author: string; content: string; rating: number; date: string }[];
  website?: string;
}

// Mock data - in a real app, this would come from your backend
const mockInternships: Internship[] = [
  { id: '1', title: 'Software Development Intern', company: 'Google India', location: 'Bangalore', duration: '3 months', stipend: 80000, type: 'private', match: 95, skills: ['Python', 'ML', 'DSA'], rating: 4.8, reviews: [
    { id: 'r1', author: 'Rahul K.', content: 'Great learning experience with excellent mentorship. Got to work on cutting-edge technologies.', rating: 5, date: '2024-01-15' },
    { id: 'r2', author: 'Priya S.', content: 'Challenging projects and good work-life balance. Helped me grow my technical skills significantly.', rating: 4, date: '2024-01-10' },
  ], website: 'https://careers.google.com' },
  { id: '2', title: 'Data Science Intern', company: 'Microsoft', location: 'Hyderabad', duration: '6 months', stipend: 75000, type: 'private', match: 92, skills: ['Python', 'SQL', 'Tableau'], rating: 4.7, reviews: [
    { id: 'r3', author: 'Amit P.', content: 'Outstanding team and amazing learning opportunities. Got to work on real-world problems.', rating: 5, date: '2024-01-12' },
    { id: 'r4', author: 'Sneha M.', content: 'Good exposure to data science tools and methodologies. Mentors were very supportive.', rating: 4, date: '2024-01-08' },
  ], website: 'https://careers.microsoft.com' },
  { id: '3', title: 'Backend Engineering Intern', company: 'Amazon', location: 'Remote', duration: '3 months', stipend: 70000, type: 'private', match: 88, skills: ['Java', 'AWS', 'Microservices'], rating: 4.5, reviews: [
    { id: 'r5', author: 'Vikram R.', content: 'Fast-paced environment with great learning curve. Had to work on high-scale systems.', rating: 4, date: '2024-01-05' },
    { id: 'r6', author: 'Neha T.', content: 'Good experience overall. The code review process was very educational.', rating: 5, date: '2024-01-03' },
  ], website: 'https://amazon.jobs' },
  { id: '4', title: 'AI Research Intern', company: 'ISRO', location: 'Bangalore', duration: '6 months', stipend: 35000, type: 'govt', match: 85, skills: ['ML', 'Python', 'Research'], rating: 4.9, reviews: [
    { id: 'r7', author: 'Arjun P.', content: 'Fascinating work on space technology. Research environment was very collaborative.', rating: 5, date: '2024-01-07' },
    { id: 'r8', author: 'Kavya N.', content: 'Unique experience working on satellite data analysis. Highly recommended for research enthusiasts.', rating: 5, date: '2024-01-02' },
  ], website: 'https://isro.gov.in' },
  { id: '5', title: 'Product Management Intern', company: 'Flipkart', location: 'Bangalore', duration: '4 months', stipend: 60000, type: 'private', match: 82, skills: ['Analytics', 'Strategy', 'SQL'], rating: 4.4, reviews: [
    { id: 'r9', author: 'Rohit K.', content: 'Great exposure to e-commerce domain. Got to work on real product decisions.', rating: 4, date: '2024-01-09' },
    { id: 'r10', author: 'Ananya S.', content: 'Good mentorship and learning opportunities. Fast-paced environment.', rating: 5, date: '2024-01-04' },
  ], website: 'https://www.flipkartcareers.com' },
  { id: '6', title: 'Full Stack Developer Intern', company: 'Razorpay', location: 'Bangalore', duration: '3 months', stipend: 55000, type: 'private', match: 80, skills: ['React', 'Node.js', 'MongoDB'], rating: 4.6, reviews: [
    { id: 'r11', author: 'Siddharth M.', content: 'Great startup environment with hands-on experience. Team was very supportive.', rating: 5, date: '2024-01-11' },
    { id: 'r12', author: 'Pooja R.', content: 'Good learning experience. Got to work on payment systems which was exciting.', rating: 4, date: '2024-01-06' },
  ], website: 'https://razorpay.com' },
  { id: '7', title: 'Cyber Security Intern', company: 'DRDO', location: 'Delhi', duration: '6 months', stipend: 30000, type: 'govt', match: 78, skills: ['Security', 'Networking', 'Python'], rating: 4.7, reviews: [
    { id: 'r13', author: 'Deepak K.', content: 'Unique experience in government security domain. Got to learn about national security aspects.', rating: 5, date: '2024-01-13' },
    { id: 'r14', author: 'Meera L.', content: 'Good technical exposure. Strict security protocols made it challenging but educational.', rating: 4, date: '2024-01-01' },
  ], website: 'https://www.drdo.gov.in' },
  { id: '8', title: 'Cloud Engineering Intern', company: 'Infosys', location: 'Pune', duration: '3 months', stipend: 40000, type: 'private', match: 75, skills: ['AWS', 'Docker', 'Linux'], rating: 4.2, reviews: [
    { id: 'r15', author: 'Rajesh T.', content: 'Decent learning experience. Good exposure to enterprise cloud solutions.', rating: 4, date: '2024-01-14' },
    { id: 'r16', author: 'Swati G.', content: 'Structured learning path. Got to work on multiple cloud technologies.', rating: 4, date: '2023-12-28' },
  ], website: 'https://careers.infosys.com' },
  { id: '9', title: 'Data Analyst Intern', company: 'NITI Aayog', location: 'Delhi', duration: '2 months', stipend: 25000, type: 'govt', match: 72, skills: ['Excel', 'Python', 'Statistics'], rating: 4.5, reviews: [
    { id: 'r17', author: 'Karan S.', content: 'Interesting work on policy analysis. Got to work with government data.', rating: 4, date: '2023-12-30' },
    { id: 'r18', author: 'Divya P.', content: 'Unique experience in policy domain. Good for understanding governance.', rating: 5, date: '2023-12-25' },
  ], website: 'https://www.niti.gov.in' },
  { id: '10', title: 'DevOps Intern', company: 'Paytm', location: 'Noida', duration: '4 months', stipend: 45000, type: 'private', match: 70, skills: ['CI/CD', 'Kubernetes', 'AWS'], rating: 4.3, reviews: [
    { id: 'r19', author: 'Alok J.', content: 'Good exposure to fintech DevOps practices. Learned about scaling systems.', rating: 4, date: '2023-12-29' },
    { id: 'r20', author: 'Riya M.', content: 'Hands-on experience with production systems. Great mentorship.', rating: 5, date: '2023-12-27' },
  ], website: 'https://paytm.com/careers' },
];

export default function InternshipDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { userRole, loading: roleLoading } = useRole();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Assistant state
  const [assistantState, setAssistantState] = useState({
    step: 'initial' as 'initial' | 'skill-selection' | 'skill-selected' | 'completed',
    selectedSkill: null as string | null
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    
    // Redirect recruiters to their dashboard
    if (user && userRole === 'recruiter') {
      navigate('/recruiter-dashboard');
      return;
    }

    if (user && id) {
      fetchData();
    }
  }, [user, authLoading, userRole, navigate, id]);

  // Update assistant options when skills change
  useEffect(() => {
    if (assistantState.step === 'skill-selection' && onboardingData) {
      const allUserSkills = onboardingData.secondary_skills || [];
      const primarySkill = onboardingData.primary_technical_strength;
      const userSkills = primarySkill ? [...allUserSkills, primarySkill] : allUserSkills;
      
      // If all skills are now checked, move to completed state
      const uncheckedSkills = internship?.skills.filter(skill => 
        !userSkills.some((userSkill: string) => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      ) || [];
      
      if (uncheckedSkills.length === 0 && assistantState.step === 'skill-selection') {
        setAssistantState({
          step: 'completed',
          selectedSkill: null
        });
      }
    }
  }, [onboardingData, internship?.skills, assistantState.step]);

  const fetchData = async () => {
    try {
      // Find the internship by ID from mock data
      const foundInternship = mockInternships.find(i => i.id === id);
      if (foundInternship) {
        setInternship(foundInternship);
      }

      // Fetch user profile and onboarding data
      if (user) {
        const [profileRes, onboardingRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('user_id', user.id).single(),
          supabase.from('onboarding_data').select('*').eq('user_id', user.id).single()
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (onboardingRes.data) setOnboardingData(onboardingRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load internship details');
    } finally {
      setLoading(false);
    }
  };

  const handleAssistantResponse = (response: 'yes' | 'no') => {
    if (response === 'yes') {
      setAssistantState({
        step: 'skill-selection',
        selectedSkill: null
      });
    } else {
      setAssistantState({
        step: 'completed',
        selectedSkill: null
      });
    }
  };

  const handleSkillSelection = (skill: string) => {
    setAssistantState({
      step: 'skill-selected',
      selectedSkill: skill
    });
  };

  // Helper functions for recommendations
  const getRecommendedCourses = (skill: string) => {
    const courses: { title: string; platform: string; link: string; pdfLink: string; estimatedTime: string }[] = [];
    
    switch(skill.toLowerCase()) {
      case 'python':
        courses.push(
          { title: 'Python for Everybody', platform: 'Coursera', link: 'https://www.coursera.org/specializations/python', pdfLink: 'https://www.coursera.org/learn/python', estimatedTime: '4-6 months' },
          { title: 'Complete Python Developer', platform: 'Udemy', link: 'https://www.udemy.com/course/complete-python-developer/', pdfLink: 'https://www.udemy.com/course/complete-python-developer/', estimatedTime: '2-3 months' },
          { title: 'Python Data Structures', platform: 'Coursera', link: 'https://www.coursera.org/learn/python-data', pdfLink: 'https://www.coursera.org/learn/python-data', estimatedTime: '1-2 months' }
        );
        break;
      case 'ml':
      case 'machine learning':
        courses.push(
          { title: 'Machine Learning', platform: 'Coursera', link: 'https://www.coursera.org/learn/machine-learning', pdfLink: 'https://www.coursera.org/learn/machine-learning', estimatedTime: '3-4 months' },
          { title: 'Deep Learning Specialization', platform: 'Coursera', link: 'https://www.coursera.org/specializations/deep-learning', pdfLink: 'https://www.coursera.org/specializations/deep-learning', estimatedTime: '5-6 months' },
          { title: 'Applied Data Science with Python', platform: 'Coursera', link: 'https://www.coursera.org/specializations/data-science-python', pdfLink: 'https://www.coursera.org/specializations/data-science-python', estimatedTime: '4-5 months' }
        );
        break;
      case 'dsa':
      case 'data structures':
        courses.push(
          { title: 'Algorithms & Data Structures', platform: 'Coursera', link: 'https://www.coursera.org/specializations/algorithms', pdfLink: 'https://www.coursera.org/specializations/algorithms', estimatedTime: '3-4 months' },
          { title: 'Python Data Structures', platform: 'Coursera', link: 'https://www.coursera.org/learn/python-data', pdfLink: 'https://www.coursera.org/learn/python-data', estimatedTime: '1-2 months' },
          { title: 'JavaScript Algorithms and Data Structures', platform: 'freeCodeCamp', link: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', pdfLink: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', estimatedTime: '2-3 months' }
        );
        break;
      case 'sql':
        courses.push(
          { title: 'SQL for Data Science', platform: 'Coursera', link: 'https://www.coursera.org/learn/sql-for-data-science', pdfLink: 'https://www.coursera.org/learn/sql-for-data-science', estimatedTime: '1-2 months' },
          { title: 'Introduction to SQL', platform: 'Khan Academy', link: 'https://www.khanacademy.org/computing/computer-programming/sql', pdfLink: 'https://www.khanacademy.org/computing/computer-programming/sql', estimatedTime: '1 month' },
          { title: 'SQL Basics', platform: 'Codecademy', link: 'https://www.codecademy.com/learn/learn-sql', pdfLink: 'https://www.codecademy.com/learn/learn-sql', estimatedTime: '1 month' }
        );
        break;
      case 'tableau':
        courses.push(
          { title: 'Data Visualization with Tableau', platform: 'Coursera', link: 'https://www.coursera.org/learn/analytics-tableau', pdfLink: 'https://www.coursera.org/learn/analytics-tableau', estimatedTime: '2-3 months' },
          { title: 'Tableau Training', platform: 'Tableau', link: 'https://www.tableau.com/learn/training', pdfLink: 'https://www.tableau.com/learn/training', estimatedTime: '1-2 months' },
          { title: 'Visual Analytics with Tableau', platform: 'Coursera', link: 'https://www.coursera.org/learn/analytics-tableau', pdfLink: 'https://www.coursera.org/learn/analytics-tableau', estimatedTime: '2 months' }
        );
        break;
      case 'java':
        courses.push(
          { title: 'Java Programming Masterclass', platform: 'Udemy', link: 'https://www.udemy.com/course/java-the-complete-java-developer-course/', pdfLink: 'https://www.udemy.com/course/java-the-complete-java-developer-course/', estimatedTime: '3-4 months' },
          { title: 'Object-Oriented Programming in Java', platform: 'Coursera', link: 'https://www.coursera.org/learn/object-oriented-programming', pdfLink: 'https://www.coursera.org/learn/object-oriented-programming', estimatedTime: '2-3 months' },
          { title: 'Java for Android', platform: 'Coursera', link: 'https://www.coursera.org/learn/java-programming-android', pdfLink: 'https://www.coursera.org/learn/java-programming-android', estimatedTime: '2-3 months' }
        );
        break;
      case 'aws':
      case 'cloud':
        courses.push(
          { title: 'AWS Fundamentals', platform: 'Coursera', link: 'https://www.coursera.org/specializations/aws-fundamentals', pdfLink: 'https://www.coursera.org/specializations/aws-fundamentals', estimatedTime: '2-3 months' },
          { title: 'AWS Cloud Practitioner', platform: 'A Cloud Guru', link: 'https://acloudguru.com/course/aws-cloud-practitioner', pdfLink: 'https://acloudguru.com/course/aws-cloud-practitioner', estimatedTime: '1-2 months' },
          { title: 'AWS Solutions Architect', platform: 'Udemy', link: 'https://www.udemy.com/course/aws-solutions-architect/', pdfLink: 'https://www.udemy.com/course/aws-solutions-architect/', estimatedTime: '3-4 months' }
        );
        break;
      case 'microservices':
        courses.push(
          { title: 'Microservices with Node JS and React', platform: 'Udemy', link: 'https://www.udemy.com/course/microservices-with-node-js-and-react/', pdfLink: 'https://www.udemy.com/course/microservices-with-node-js-and-react/', estimatedTime: '3-4 months' },
          { title: 'Designing Microservices with Spring Cloud', platform: 'Coursera', link: 'https://www.coursera.org/learn/microservices-spring-cloud', pdfLink: 'https://www.coursera.org/learn/microservices-spring-cloud', estimatedTime: '2-3 months' },
          { title: 'Microservices Architecture', platform: 'Pluralsight', link: 'https://www.pluralsight.com/courses/microservices-architecture', pdfLink: 'https://www.pluralsight.com/courses/microservices-architecture', estimatedTime: '2-3 months' }
        );
        break;
      case 'research':
        courses.push(
          { title: 'Research Methods', platform: 'Coursera', link: 'https://www.coursera.org/learn/research-methods', pdfLink: 'https://www.coursera.org/learn/research-methods', estimatedTime: '2-3 months' },
          { title: 'Scientific Computing', platform: 'Coursera', link: 'https://www.coursera.org/learn/scientific-computing', pdfLink: 'https://www.coursera.org/learn/scientific-computing', estimatedTime: '2-3 months' },
          { title: 'Academic Writing', platform: 'Coursera', link: 'https://www.coursera.org/learn/academic-writing', pdfLink: 'https://www.coursera.org/learn/academic-writing', estimatedTime: '1-2 months' }
        );
        break;
      case 'analytics':
        courses.push(
          { title: 'Google Analytics', platform: 'Google', link: 'https://analytics.google.com/analytics/academy/', pdfLink: 'https://analytics.google.com/analytics/academy/', estimatedTime: '1-2 months' },
          { title: 'Data Analytics Certificate', platform: 'Coursera', link: 'https://www.coursera.org/professional-certificates/google-data-analytics', pdfLink: 'https://www.coursera.org/professional-certificates/google-data-analytics', estimatedTime: '6 months' },
          { title: 'Business Analytics', platform: 'Coursera', link: 'https://www.coursera.org/specializations/business-analytics', pdfLink: 'https://www.coursera.org/specializations/business-analytics', estimatedTime: '4-5 months' }
        );
        break;
      case 'strategy':
        courses.push(
          { title: 'Strategic Management', platform: 'Coursera', link: 'https://www.coursera.org/specializations/strategic-management', pdfLink: 'https://www.coursera.org/specializations/strategic-management', estimatedTime: '3-4 months' },
          { title: 'Business Strategy', platform: 'Coursera', link: 'https://www.coursera.org/learn/business-strategy', pdfLink: 'https://www.coursera.org/learn/business-strategy', estimatedTime: '2-3 months' },
          { title: 'Competitive Strategy', platform: 'Coursera', link: 'https://www.coursera.org/learn/competitive-strategy', pdfLink: 'https://www.coursera.org/learn/competitive-strategy', estimatedTime: '2-3 months' }
        );
        break;
      case 'react':
        courses.push(
          { title: 'React - The Complete Guide', platform: 'Udemy', link: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', pdfLink: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', estimatedTime: '2-3 months' },
          { title: 'Frontend Web Development', platform: 'Coursera', link: 'https://www.coursera.org/specializations/frontend-development', pdfLink: 'https://www.coursera.org/specializations/frontend-development', estimatedTime: '4-5 months' },
          { title: 'React and TypeScript', platform: 'Coursera', link: 'https://www.coursera.org/learn/react-typescript', pdfLink: 'https://www.coursera.org/learn/react-typescript', estimatedTime: '2-3 months' }
        );
        break;
      case 'node.js':
        courses.push(
          { title: 'Node.js, Express, MongoDB', platform: 'Udemy', link: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/', pdfLink: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/', estimatedTime: '2-3 months' },
          { title: 'Backend Development', platform: 'freeCodeCamp', link: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', pdfLink: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', estimatedTime: '3-4 months' },
          { title: 'Server-side Development', platform: 'Coursera', link: 'https://www.coursera.org/learn/server-side-development', pdfLink: 'https://www.coursera.org/learn/server-side-development', estimatedTime: '2-3 months' }
        );
        break;
      case 'mongodb':
        courses.push(
          { title: 'MongoDB for Node.js Developers', platform: 'MongoDB University', link: 'https://university.mongodb.com/courses/M001/about', pdfLink: 'https://university.mongodb.com/courses/M001/about', estimatedTime: '1-2 months' },
          { title: 'Introduction to MongoDB', platform: 'Coursera', link: 'https://www.coursera.org/learn/introduction-mongodb', pdfLink: 'https://www.coursera.org/learn/introduction-mongodb', estimatedTime: '1 month' },
          { title: 'Database Management', platform: 'Coursera', link: 'https://www.coursera.org/learn/database-management', pdfLink: 'https://www.coursera.org/learn/database-management', estimatedTime: '2-3 months' }
        );
        break;
      case 'security':
        courses.push(
          { title: 'Cybersecurity Specialization', platform: 'Coursera', link: 'https://www.coursera.org/specializations/cyber-security', pdfLink: 'https://www.coursera.org/specializations/cyber-security', estimatedTime: '4-6 months' },
          { title: 'Introduction to Cyber Security', platform: 'Coursera', link: 'https://www.coursera.org/learn/intro-cyber-security', pdfLink: 'https://www.coursera.org/learn/intro-cyber-security', estimatedTime: '2-3 months' },
          { title: 'Network Security', platform: 'Coursera', link: 'https://www.coursera.org/learn/network-security', pdfLink: 'https://www.coursera.org/learn/network-security', estimatedTime: '2-3 months' }
        );
        break;
      case 'networking':
        courses.push(
          { title: 'Computer Networking', platform: 'Coursera', link: 'https://www.coursera.org/learn/computer-networking', pdfLink: 'https://www.coursera.org/learn/computer-networking', estimatedTime: '3-4 months' },
          { title: 'Networking Fundamentals', platform: 'Coursera', link: 'https://www.coursera.org/learn/networking-fundamentals', pdfLink: 'https://www.coursera.org/learn/networking-fundamentals', estimatedTime: '2-3 months' },
          { title: 'Network and Security', platform: 'Coursera', link: 'https://www.coursera.org/specializations/network-security', pdfLink: 'https://www.coursera.org/specializations/network-security', estimatedTime: '4-5 months' }
        );
        break;
      case 'docker':
        courses.push(
          { title: 'Docker Mastery', platform: 'Udemy', link: 'https://www.udemy.com/course/docker-mastery/', pdfLink: 'https://www.udemy.com/course/docker-mastery/', estimatedTime: '1-2 months' },
          { title: 'Docker and Kubernetes', platform: 'Coursera', link: 'https://www.coursera.org/learn/docker-kubernetes', pdfLink: 'https://www.coursera.org/learn/docker-kubernetes', estimatedTime: '2-3 months' },
          { title: 'Containerization', platform: 'Coursera', link: 'https://www.coursera.org/learn/containerization', pdfLink: 'https://www.coursera.org/learn/containerization', estimatedTime: '2-3 months' }
        );
        break;
      case 'linux':
        courses.push(
          { title: 'Linux Command Line', platform: 'Coursera', link: 'https://www.coursera.org/learn/linux-command-line', pdfLink: 'https://www.coursera.org/learn/linux-command-line', estimatedTime: '2-3 months' },
          { title: 'Introduction to Linux', platform: 'edX', link: 'https://www.edx.org/course/introduction-to-linux', pdfLink: 'https://www.edx.org/course/introduction-to-linux', estimatedTime: '2-3 months' },
          { title: 'Linux Administration', platform: 'Coursera', link: 'https://www.coursera.org/learn/linux-administration', pdfLink: 'https://www.coursera.org/learn/linux-administration', estimatedTime: '3-4 months' }
        );
        break;
      case 'kubernetes':
        courses.push(
          { title: 'Kubernetes for the Absolute Beginners', platform: 'Udemy', link: 'https://www.udemy.com/course/learn-kubernetes/', pdfLink: 'https://www.udemy.com/course/learn-kubernetes/', estimatedTime: '2-3 months' },
          { title: 'Kubernetes on AWS', platform: 'Coursera', link: 'https://www.coursera.org/learn/kubernetes-aws', pdfLink: 'https://www.coursera.org/learn/kubernetes-aws', estimatedTime: '2-3 months' },
          { title: 'Container Orchestration', platform: 'Coursera', link: 'https://www.coursera.org/learn/container-orchestration', pdfLink: 'https://www.coursera.org/learn/container-orchestration', estimatedTime: '3-4 months' }
        );
        break;
      case 'excel':
        courses.push(
          { title: 'Excel Skills for Business', platform: 'Coursera', link: 'https://www.coursera.org/specializations/excel', pdfLink: 'https://www.coursera.org/specializations/excel', estimatedTime: '4-5 months' },
          { title: 'Advanced Excel', platform: 'Coursera', link: 'https://www.coursera.org/learn/advanced-excel', pdfLink: 'https://www.coursera.org/learn/advanced-excel', estimatedTime: '1-2 months' },
          { title: 'Data Analysis with Excel', platform: 'Coursera', link: 'https://www.coursera.org/learn/data-analysis-excel', pdfLink: 'https://www.coursera.org/learn/data-analysis-excel', estimatedTime: '2-3 months' }
        );
        break;
      case 'statistics':
        courses.push(
          { title: 'Introduction to Statistics', platform: 'Coursera', link: 'https://www.coursera.org/learn/introduction-statistics', pdfLink: 'https://www.coursera.org/learn/introduction-statistics', estimatedTime: '2-3 months' },
          { title: 'Statistical Inference', platform: 'Coursera', link: 'https://www.coursera.org/learn/statistical-inference', pdfLink: 'https://www.coursera.org/learn/statistical-inference', estimatedTime: '3-4 months' },
          { title: 'Probability and Statistics', platform: 'Coursera', link: 'https://www.coursera.org/learn/probability-statistics', pdfLink: 'https://www.coursera.org/learn/probability-statistics', estimatedTime: '3-4 months' }
        );
        break;
      case 'ci/cd':
        courses.push(
          { title: 'CI/CD with Jenkins', platform: 'Udemy', link: 'https://www.udemy.com/course/ci-cd-jenkins/', pdfLink: 'https://www.udemy.com/course/ci-cd-jenkins/', estimatedTime: '2-3 months' },
          { title: 'DevOps Engineering', platform: 'Coursera', link: 'https://www.coursera.org/learn/devops-engineering', pdfLink: 'https://www.coursera.org/learn/devops-engineering', estimatedTime: '3-4 months' },
          { title: 'Continuous Integration', platform: 'Coursera', link: 'https://www.coursera.org/learn/continuous-integration', pdfLink: 'https://www.coursera.org/learn/continuous-integration', estimatedTime: '2-3 months' }
        );
        break;
      default:
        courses.push(
          { title: `Course on ${skill}`, platform: 'Coursera', link: 'https://www.coursera.org', pdfLink: 'https://www.coursera.org', estimatedTime: '2-4 months' },
          { title: `Learn ${skill}`, platform: 'Udemy', link: 'https://www.udemy.com', pdfLink: 'https://www.udemy.com', estimatedTime: '2-3 months' },
          { title: `${skill} Fundamentals`, platform: 'freeCodeCamp', link: 'https://www.freecodecamp.org', pdfLink: 'https://www.freecodecamp.org', estimatedTime: '1-3 months' }
        );
    }
    
    return courses;
  };

  const getAIResources = (skill: string) => {
    const tools: { name: string; description: string }[] = [];
    
    switch(skill.toLowerCase()) {
      case 'python':
        tools.push(
          { name: 'GitHub Copilot', description: 'AI-powered code completion to help write Python code faster' },
          { name: 'Replit AI', description: 'AI assistant for debugging and explaining Python code' },
          { name: 'Kite', description: 'AI-powered autocomplete for Python development' }
        );
        break;
      case 'ml':
      case 'machine learning':
        tools.push(
          { name: 'Google AutoML', description: 'Automated machine learning platform to build ML models without coding' },
          { name: 'H2O AI', description: 'Platform for automated machine learning and AI model development' },
          { name: 'DataRobot', description: 'Automated machine learning platform for enterprise use' }
        );
        break;
      case 'dsa':
      case 'data structures':
        tools.push(
          { name: 'LeetCode AI', description: 'AI-powered coding practice and interview preparation' },
          { name: 'CodeSignal', description: 'AI-assisted coding challenges and skill assessment' },
          { name: 'Pramp', description: 'AI-powered practice for technical interviews and problem solving' }
        );
        break;
      case 'sql':
        tools.push(
          { name: 'SQLizer', description: 'AI tool to convert files to SQL databases' },
          { name: 'QueryGenie', description: 'AI-powered SQL query generation from natural language' },
          { name: 'ChartSQL', description: 'AI tool to convert SQL queries to charts and visualizations' }
        );
        break;
      case 'tableau':
        tools.push(
          { name: 'Tableau Ask Data', description: 'AI feature in Tableau that allows asking questions in natural language' },
          { name: 'Einstein Analytics', description: 'AI-powered analytics and insights for Tableau data' },
          { name: 'Narrative Science', description: 'AI tool to generate written narratives from Tableau visualizations' }
        );
        break;
      case 'java':
        tools.push(
          { name: 'GitHub Copilot', description: 'AI-powered code completion for Java development' },
          { name: 'Replit AI', description: 'AI assistant for Java debugging and code explanation' },
          { name: 'Tabnine', description: 'AI code completion for Java and other languages' }
        );
        break;
      case 'aws':
      case 'cloud':
        tools.push(
          { name: 'AWS CodeWhisperer', description: 'AI-powered coding companion for AWS services' },
          { name: 'AWS SageMaker', description: 'AI service for building and deploying machine learning models on AWS' },
          { name: 'Terraform AI', description: 'AI tools for infrastructure as code automation on AWS' }
        );
        break;
      case 'microservices':
        tools.push(
          { name: 'Istio', description: 'AI-powered service mesh for microservices management' },
          { name: 'Kubernetes AI Operators', description: 'AI tools for managing microservices on Kubernetes' },
          { name: 'Jaeger', description: 'AI-powered distributed tracing for microservices' }
        );
        break;
      case 'research':
        tools.push(
          { name: 'Connected Papers', description: 'AI tool to visualize and explore academic paper connections' },
          { name: 'Semantic Scholar', description: 'AI-powered research tool for finding relevant academic papers' },
          { name: 'Elicit', description: 'AI research assistant for literature reviews and data extraction' }
        );
        break;
      case 'analytics':
        tools.push(
          { name: 'Google Analytics Intelligence', description: 'AI-powered insights and anomaly detection in Google Analytics' },
          { name: 'Microsoft Power BI AI', description: 'AI-powered data insights and natural language queries' },
          { name: 'Tableau Ask Data', description: 'AI feature to ask questions about data in natural language' }
        );
        break;
      case 'strategy':
        tools.push(
          { name: 'Guru', description: 'AI-powered knowledge management for strategic decision making' },
          { name: 'Knoetic', description: 'AI tool for competitive intelligence and strategy insights' },
          { name: 'Stratifyd', description: 'AI platform for customer analytics and strategic insights' }
        );
        break;
      case 'react':
        tools.push(
          { name: 'GitHub Copilot', description: 'AI-powered code completion for React development' },
          { name: 'Tabnine', description: 'AI code completion for React and JavaScript' },
          { name: 'CodeSandbox AI', description: 'AI-powered React component generation and debugging' }
        );
        break;
      case 'node.js':
        tools.push(
          { name: 'GitHub Copilot', description: 'AI-powered code completion for Node.js development' },
          { name: 'Replit AI', description: 'AI assistant for Node.js debugging and code explanation' },
          { name: 'Node.js AI', description: 'AI tools for Node.js performance optimization' }
        );
        break;
      case 'mongodb':
        tools.push(
          { name: 'MongoDB Charts', description: 'AI-powered visualization of MongoDB data' },
          { name: 'Compass AI', description: 'AI features in MongoDB Compass for query optimization' },
          { name: 'QueryGenie', description: 'AI-powered MongoDB query generation' }
        );
        break;
      case 'security':
        tools.push(
          { name: 'Darktrace', description: 'AI-powered cybersecurity threat detection and response' },
          { name: 'Cylance', description: 'AI-based endpoint security and threat prevention' },
          { name: 'IBM Watson for Cybersecurity', description: 'AI-powered threat analysis and security insights' }
        );
        break;
      case 'networking':
        tools.push(
          { name: 'Cisco DNA Center', description: 'AI-powered network management and automation' },
          { name: 'Juniper Mist AI', description: 'AI for wireless and wired network management' },
          { name: 'Aruba Central AI', description: 'AI-powered network analytics and optimization' }
        );
        break;
      case 'docker':
        tools.push(
          { name: 'Docker Scout', description: 'AI-powered container security and vulnerability analysis' },
          { name: 'Anchore', description: 'AI-powered container image analysis and policy enforcement' },
          { name: 'Aqua Security', description: 'AI-powered container security and compliance' }
        );
        break;
      case 'linux':
        tools.push(
          { name: 'Linux Hands', description: 'AI-powered Linux command assistance and learning' },
          { name: 'ExplainShell', description: 'AI-powered explanation of Linux commands' },
          { name: 'Linux Command AI', description: 'AI assistant for Linux command line tasks' }
        );
        break;
      case 'kubernetes':
        tools.push(
          { name: 'Kubeflow', description: 'AI-powered machine learning on Kubernetes' },
          { name: 'Rancher AI', description: 'AI features for Kubernetes cluster management' },
          { name: 'Kiali', description: 'AI-powered visualization and observability for Kubernetes' }
        );
        break;
      case 'excel':
        tools.push(
          { name: 'Microsoft Copilot for Excel', description: 'AI-powered data analysis and formula generation in Excel' },
          { name: 'ThinkCell', description: 'AI-powered chart creation and data visualization' },
          { name: 'Athena Analytics', description: 'AI-powered Excel add-in for advanced analytics' }
        );
        break;
      case 'statistics':
        tools.push(
          { name: 'SPSS', description: 'AI-powered statistical analysis and data science platform' },
          { name: 'RStudio AI', description: 'AI features for R statistical computing' },
          { name: 'JASP', description: 'AI-powered statistical analysis with both classical and Bayesian methods' }
        );
        break;
      case 'ci/cd':
        tools.push(
          { name: 'Jenkins X AI', description: 'AI-powered continuous integration and deployment' },
          { name: 'CircleCI AI', description: 'AI features for optimizing CI/CD pipelines' },
          { name: 'GitHub Actions AI', description: 'AI-powered workflow optimization for CI/CD' }
        );
        break;
      default:
        tools.push(
          { name: 'ChatGPT', description: 'General AI assistant for learning and practicing the skill' },
          { name: 'GitHub Copilot', description: 'AI-powered code completion if applicable to the skill' },
          { name: 'Replit AI', description: 'AI assistant for coding and debugging if applicable' }
        );
    }
    
    return tools;
  };

  if (loading || authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Internship not found</h2>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Get user's skills from onboarding data to check which skills match
  const userSkills = onboardingData?.secondary_skills || [];
  const primarySkill = onboardingData?.primary_technical_strength;

  // Combine primary and secondary skills
  const allUserSkills = primarySkill ? [...userSkills, primarySkill] : userSkills;

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  // Important points about the internship
  const importantPoints = [
    `Application Deadline: Check company website for current deadlines`,
    `Eligibility: Typically requires ${internship.match}% match or higher`,
    `Duration: ${internship.duration} - Plan your academic schedule accordingly`,
    `Stipend: ₹${internship.stipend.toLocaleString()}/month - Consider cost of living at location`,
    `Skills Required: ${internship.skills.join(', ')} - Focus on improving these areas`,
    `Interview Process: Usually includes technical rounds and behavioral interviews`
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1f3445] to-slate-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CareerPath</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {profile?.full_name || user?.email}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSignOut}
              className="text-muted-foreground"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button for mobile */}
        <Button 
          variant="outline" 
          className="mb-6 md:hidden w-full justify-start"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{internship.title}</h1>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{internship.company.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-xl font-semibold">{internship.company}</p>
                  <p className="text-sm text-muted-foreground">{internship.type === 'govt' ? 'Government' : 'Private'}</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1f3445]">{internship.match.toFixed(2)}%</div>
              <div className="text-sm text-[#1f3445]">Match</div>
            </div>
          </div>

          {/* Website Link */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Official Website</h2>
            <a 
              href={internship.website || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              {internship.website || 'Company Website'}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Important Points */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Key Information</h2>
            <ul className="space-y-3">
              {importantPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-medium">{index + 1}</span>
                  </div>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Required */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Skills Required</h2>
            <div className="space-y-3">
              {internship.skills.map((skill) => {
                const hasSkill = allUserSkills.some((userSkill: string) => 
                  userSkill.toLowerCase().includes(skill.toLowerCase()) || 
                  skill.toLowerCase().includes(userSkill.toLowerCase())
                );
                
                return (
                  <div 
                    key={skill} 
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      hasSkill ? 'border-green-500/30 bg-green-500/10' : 'border-border'
                    }`}
                  >
                    {hasSkill ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={`${hasSkill ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                      {skill}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {internship.skills.some(skill => 
              !allUserSkills.some((userSkill: string) => 
                userSkill.toLowerCase().includes(skill.toLowerCase()) || 
                skill.toLowerCase().includes(userSkill.toLowerCase())
              )
            ) && (
              <p className="text-sm text-muted-foreground mt-4">
                Skills marked with a checkmark are ones you indicated during profile setup. 
                Consider improving other required skills to increase your match percentage.
              </p>
            )}
          </div>
        </div>

        {/* Guided Assistant */}
        <div className="glass rounded-2xl p-4 mt-6 border border-[#1f3445]/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#1f3445] flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <span className="font-bold text-[#1f3445]">Career Assistant</span>
          </div>
          
          <div className="space-y-3">
            {assistantState.step === 'initial' && (
              <div className="bg-[#1f3445]/10 rounded-lg p-3 border border-[#1f3445]/30">
                <p className="text-sm font-semibold text-[#1f3445]">Would you like me to help you with the skills you want to build?</p>
              </div>
            )}
            
            {assistantState.step === 'initial' && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAssistantResponse('yes')}
                  className="flex-1 bg-[#1f3445] text-white hover:bg-[#1f3445]/90 border-[#1f3445] font-semibold"
                >
                  Yes
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAssistantResponse('no')}
                  className="flex-1 bg-[#1f3445] text-white hover:bg-[#1f3445]/90 border-[#1f3445] font-semibold"
                >
                  No
                </Button>
              </div>
            )}
            
            {assistantState.step === 'skill-selection' && (
              <div className="bg-[#1f3445]/10 rounded-lg p-3 border border-[#1f3445]/30">
                <p className="text-sm font-semibold text-[#1f3445]">Which skill would you like me to address first?</p>
              </div>
            )}
            
            {assistantState.step === 'skill-selection' && (
              <div className="flex flex-wrap gap-2">
                {internship.skills
                  .filter(skill => 
                    !allUserSkills.some((userSkill: string) => 
                      userSkill.toLowerCase().includes(skill.toLowerCase()) || 
                      skill.toLowerCase().includes(userSkill.toLowerCase())
                    )
                  )
                  .map(skill => (
                    <Button
                      key={skill}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSkillSelection(skill)}
                      className="font-semibold border-[#1f3445] text-[#1f3445] hover:bg-[#1f3445]/10"
                    >
                      {skill}
                    </Button>
                  ))
                }
              </div>
            )}
            
            {assistantState.step === 'skill-selected' && (
              <div className="space-y-4">
                <div className="bg-[#1f3445]/10 rounded-lg p-3 border border-[#1f3445]/30">
                  <p className="text-sm font-bold text-[#1f3445]">Here are some recommendations for {assistantState.selectedSkill}:</p>
                </div>
                
                {/* Recommended Courses */}
                <div>
                  <h4 className="font-bold text-[#1f3445] mb-2">Recommended Courses</h4>
                  <div className="space-y-2">
                    {getRecommendedCourses(assistantState.selectedSkill!).map((course, index) => (
                      <div 
                        key={index}
                        className="p-3 rounded-lg border border-[#1f3445]/30 flex justify-between items-start bg-[#1f3445]/5"
                      >
                        <div className="flex-1">
                          <div className="font-bold text-[#1f3445] text-sm">{course.title}</div>
                          <div className="text-xs text-[#1f3445]">{course.platform} • {course.estimatedTime}</div>
                        </div>
                        <a 
                          href={course.pdfLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2"
                        >
                          <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-[#1f3445] text-[#1f3445] hover:bg-[#1f3445]/10 font-semibold">
                            PDF
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* AI Tools */}
                <div>
                  <h4 className="font-bold text-[#1f3445] mb-2">AI Tools to Improve This Skill</h4>
                  <div className="space-y-2">
                    {getAIResources(assistantState.selectedSkill!).map((tool, index) => (
                      <div key={index} className="p-3 rounded-lg border border-[#1f3445]/30 bg-[#1f3445]/5">
                        <div className="font-bold text-[#1f3445] text-sm">{tool.name}</div>
                        <div className="text-xs text-[#1f3445]">{tool.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setAssistantState({ step: 'completed', selectedSkill: null })}
                  className="w-full bg-[#1f3445] text-white hover:bg-[#1f3445]/90 border-[#1f3445] font-semibold"
                >
                  Back to Skills
                </Button>
              </div>
            )}
            
            {assistantState.step === 'completed' && (
              <div className="bg-[#1f3445]/10 rounded-lg p-3 border border-[#1f3445]/30">
                <p className="text-sm font-semibold text-[#1f3445]">Alright! You can continue selecting skills on your own.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}