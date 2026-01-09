import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, GraduationCap, Calendar, BookOpen, 
  CalendarDays, MapPin, ExternalLink, Clock
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  type: 'workshop' | 'course' | 'event' | 'project' | 'certification' | 'internship' | 'placement';
  date: string;
  duration: string;
  skill: string;
  description: string;
  mode: 'online' | 'offline';
  location?: string;
  rating: number;
  internshipOutcome: string;
}

interface NewRoadmapItem {
  initiativeType: 'workshop' | 'certification' | 'course' | 'internship' | 'placement';
  title: string;
  date: string;
  duration: string;
  skill: string;
  description: string;
  mode: 'online' | 'offline';
  location?: string;
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    title: 'React Masterclass',
    type: 'course',
    date: 'Jan 2023',
    duration: '6 weeks',
    skill: 'React',
    description: 'Comprehensive React course covering hooks, state management, and performance optimization',
    mode: 'online',
    rating: 4.8,
    internshipOutcome: 'Frontend Developer Intern at TechCorp'
  },
  {
    id: '2',
    title: 'AI/ML Bootcamp',
    type: 'workshop',
    date: 'Mar 2023',
    duration: '4 weeks',
    skill: 'Machine Learning',
    description: 'Hands-on workshop on neural networks and deep learning',
    mode: 'offline',
    location: 'Delhi',
    rating: 4.9,
    internshipOutcome: 'ML Intern at InnovateAI'
  },
  {
    id: '3',
    title: 'Hackathon 2023',
    type: 'event',
    date: 'May 2023',
    duration: '3 days',
    skill: 'Problem Solving',
    description: 'National level hackathon focusing on sustainability solutions',
    mode: 'offline',
    location: 'Bangalore',
    rating: 4.7,
    internshipOutcome: 'Won 2nd prize, got noticed by startup'
  },
  {
    id: '4',
    title: 'Backend Development Course',
    type: 'course',
    date: 'Jun 2023',
    duration: '8 weeks',
    skill: 'Node.js',
    description: 'Learn backend development with Node.js, Express, and MongoDB',
    mode: 'online',
    rating: 4.6,
    internshipOutcome: 'Backend Intern at StartupX'
  },
  {
    id: '5',
    title: 'Open Source Contribution',
    type: 'project',
    date: 'Jul 2023',
    duration: '2 months',
    skill: 'Collaboration',
    description: 'Contributed to popular React component library',
    mode: 'online',
    rating: 4.5,
    internshipOutcome: 'Added to portfolio, impressed recruiters'
  }
];

export default function Roadmap() {
  const [studentDetails, setStudentDetails] = useState({
    name: 'John Doe',
    currentYear: '2',
    branch: 'Computer Science',
    grade: 'A'
  });

  const [newRoadmapItem, setNewRoadmapItem] = useState<NewRoadmapItem>({
    initiativeType: 'course',
    title: '',
    date: '',
    duration: '',
    skill: '',
    description: '',
    mode: 'online',
  });

  const [userTimelineEvents, setUserTimelineEvents] = useState<TimelineEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'timeline' | 'skills'>('timeline');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1f3445] to-slate-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Perfect Placement</span>
          </div>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1f3445] mb-2">Personalized Learning Roadmap</h1>
          <p className="text-muted-foreground">Follow the path that successful seniors took to land internships</p>
        </div>

        {/* Student Details Section */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-[#1f3445] mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#1f3445]" /> Your Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-[#1f3445]/80">Full Name</Label>
              <Input 
                value={studentDetails.name}
                onChange={(e) => setStudentDetails({...studentDetails, name: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-[#1f3445]/80">Current Year</Label>
              <Select value={studentDetails.currentYear} onValueChange={(value) => setStudentDetails({...studentDetails, currentYear: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#1f3445]/80">Branch</Label>
              <Input 
                value={studentDetails.branch}
                onChange={(e) => setStudentDetails({...studentDetails, branch: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-[#1f3445]/80">Last Semester Grade</Label>
              <Input 
                value={studentDetails.grade}
                onChange={(e) => setStudentDetails({...studentDetails, grade: e.target.value})}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Add New Roadmap Item Form */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-[#1f3445] mb-4">Add New Roadmap Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-[#1f3445]/80">Initiative Type</Label>
              <Select value={newRoadmapItem.initiativeType} onValueChange={(value: any) => setNewRoadmapItem({...newRoadmapItem, initiativeType: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="certification">Certification</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="placement">Placement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#1f3445]/80">Title</Label>
              <Input 
                value={newRoadmapItem.title}
                onChange={(e) => setNewRoadmapItem({...newRoadmapItem, title: e.target.value})}
                placeholder="Enter title"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-[#1f3445]/80">Start Date</Label>
              <Input 
                type="date"
                value={newRoadmapItem.date}
                onChange={(e) => setNewRoadmapItem({...newRoadmapItem, date: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-[#1f3445]/80">Duration</Label>
              <Input 
                value={newRoadmapItem.duration}
                onChange={(e) => setNewRoadmapItem({...newRoadmapItem, duration: e.target.value})}
                placeholder="e.g., 4 weeks"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-[#1f3445]/80">Skill Developed</Label>
              <Input 
                value={newRoadmapItem.skill}
                onChange={(e) => setNewRoadmapItem({...newRoadmapItem, skill: e.target.value})}
                placeholder="e.g., React"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-[#1f3445]/80">Mode</Label>
              <Select value={newRoadmapItem.mode} onValueChange={(value: any) => setNewRoadmapItem({...newRoadmapItem, mode: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mb-4">
            <Label className="text-[#1f3445]/80">Description</Label>
            <Input 
              value={newRoadmapItem.description}
              onChange={(e) => setNewRoadmapItem({...newRoadmapItem, description: e.target.value})}
              placeholder="Describe the initiative"
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <Label className="text-[#1f3445]/80">Location (optional)</Label>
            <Input 
              value={newRoadmapItem.location || ''}
              onChange={(e) => setNewRoadmapItem({...newRoadmapItem, location: e.target.value})}
              placeholder="e.g., Delhi"
              className="mt-1"
            />
          </div>
          <Button 
            onClick={() => {
              const newItem: TimelineEvent = {
                id: Date.now().toString(),
                title: newRoadmapItem.title,
                type: newRoadmapItem.initiativeType,
                date: newRoadmapItem.date,
                duration: newRoadmapItem.duration,
                skill: newRoadmapItem.skill,
                description: newRoadmapItem.description,
                mode: newRoadmapItem.mode,
                location: newRoadmapItem.location,
                rating: 4.5, // Default rating
                internshipOutcome: 'Added to your roadmap', // Default outcome
              };
              setUserTimelineEvents([...userTimelineEvents, newItem]);
              // Reset form
              setNewRoadmapItem({
                initiativeType: 'course',
                title: '',
                date: '',
                duration: '',
                skill: '',
                description: '',
                mode: 'online',
              });
            }}
            className="bg-[#1f3445] hover:bg-[#1f3445]/90 text-white w-full md:w-auto"
          >
            Add to My Roadmap
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1f3445]/30 mb-6">
          <button
            className={`pb-3 px-4 font-medium ${
              activeTab === 'timeline'
                ? 'text-[#1f3445] border-b-2 border-[#1f3445]'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('timeline')}
          >
            <CalendarDays className="w-4 h-4 inline mr-2 text-[#1f3445]" />
            Learning Timeline
          </button>
          <button
            className={`pb-3 px-4 font-medium ${
              activeTab === 'skills'
                ? 'text-[#1f3445] border-b-2 border-[#1f3445]'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('skills')}
          >
            <GraduationCap className="w-4 h-4 inline mr-2 text-[#1f3445]" />
            Skill Development
          </button>
        </div>

        {/* Conditional Content Rendering */}
        <div className="space-y-6">
          {activeTab === 'timeline' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1f3445]">My Learning Journey Timeline</h2>
              <p className="text-[#1f3445]/80 mb-6">
                Track your learning journey and see recommendations from successful seniors.
              </p>

              {/* User's Timeline Events */}
              <div className="space-y-8 mb-12">
                <h3 className="text-xl font-semibold text-[#1f3445] flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-[#1f3445]/10">
                    <User className="w-5 h-5 text-[#1f3445]" />
                  </div>
                  <span className="font-bold">My Personal Roadmap</span>
                </h3>
                {userTimelineEvents.length > 0 ? (
                  <div className="relative">
                    {/* Vertical line for desktop */}
                    <div className="hidden md:block absolute left-4 top-0 h-full w-0.5 bg-[#1f3445]/30 -translate-x-1/2"></div>
                    
                    <div className="space-y-8">
                      {userTimelineEvents.map((event, index) => (
                        <div key={event.id} className="relative">
                          {/* Desktop Timeline Dot */}
                          <div className="hidden md:block absolute left-4 w-8 h-8 rounded-full bg-[#1f3445] border-4 border-background flex items-center justify-center -translate-x-1/2">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                          
                          {/* Mobile Timeline Dot */}
                          <div className="md:hidden w-8 h-8 rounded-full bg-[#1f3445] border-4 border-background flex items-center justify-center mx-auto mb-4">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                          
                          <div className={`md:ml-12 glass rounded-2xl p-6 ${index % 2 === 0 ? 'md:mr-1/2' : 'md:ml-1/2 md:mr-0'}`}>
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-bold text-[#1f3445]">{event.title}</h3>
                                  <Badge variant="secondary" className="text-xs bg-[#1f3445]/10 text-[#1f3445]">
                                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                  </Badge>
                                  {event.mode === 'offline' && (
                                    <Badge variant="outline" className="text-xs border-[#1f3445] text-[#1f3445]">
                                      <MapPin className="w-3 h-3 mr-1 text-[#1f3445]" />
                                      Offline
                                    </Badge>
                                  )}
                                  {event.mode === 'online' && (
                                    <Badge variant="outline" className="text-xs border-[#1f3445] text-[#1f3445]">
                                      Online
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-[#1f3445]/90 mb-3">{event.description}</p>
                                
                                <div className="flex flex-wrap items-center gap-4 text-sm text-[#1f3445]/80">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-[#1f3445]" />
                                    {event.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-[#1f3445]" />
                                    {event.duration}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <GraduationCap className="w-4 h-4 text-[#1f3445]" />
                                    {event.skill}
                                  </span>
                                  {event.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4 text-[#1f3445]" />
                                      {event.location}
                                    </span>
                                  )}
                                </div>
                                
                                <div className="mt-3">
                                  <div className="text-sm text-[#1f3445]/80 mb-1">Internship Outcome:</div>
                                  <div className="text-[#1f3445] font-medium">{event.internshipOutcome}</div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end sm:items-center">
                                <div className="text-lg font-bold text-[#1f3445]">{event.rating}/5</div>
                                <div className="text-xs text-[#1f3445]/80">Rating</div>
                                <Button variant="outline" size="sm" className="mt-3 text-[#1f3445] border-[#1f3445] hover:bg-[#1f3445]/10">
                                  <ExternalLink className="w-4 h-4 mr-1 text-[#1f3445]" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#1f3445]/70">
                    <p>No roadmap items added yet. Start by adding your first initiative!</p>
                  </div>
                )}
              </div>

              {/* Senior Roadmaps Access Section */}
              <div className="space-y-6 mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-[#1f3445] flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#1f3445]/10">
                      <GraduationCap className="w-5 h-5 text-[#1f3445]" />
                    </div>
                    <span className="font-bold">Senior Roadmaps Access</span>
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Rahul Sharma', internship: 'Software Engineer Intern', company: 'Google', year: '2023' },
                    { name: 'Priya Patel', internship: 'Data Science Intern', company: 'Microsoft', year: '2023' },
                    { name: 'Amit Kumar', internship: 'Frontend Developer', company: 'Meta', year: '2022' },
                    { name: 'Sneha Reddy', internship: 'Backend Engineer', company: 'Amazon', year: '2023' },
                    { name: 'Vikram Singh', internship: 'ML Engineer', company: 'Tesla', year: '2022' },
                    { name: 'Kavya Nair', internship: 'DevOps Intern', company: 'Netflix', year: '2023' }
                  ].map((senior, index) => (
                    <Card key={index} className="border-[#1f3445]/30 hover:border-[#1f3445] transition-colors">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-[#1f3445] text-lg">{senior.name}</CardTitle>
                            <p className="text-sm text-[#1f3445]/80 mt-1">{senior.year} Graduate</p>
                          </div>
                          <Badge variant="secondary" className="bg-[#1f3445]/10 text-[#1f3445]">
                            {senior.year}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-3">
                          <p className="font-medium text-[#1f3445]">{senior.internship}</p>
                          <p className="text-sm text-[#1f3445]/90">at {senior.company}</p>
                        </div>
                        <Button 
                          className="w-full bg-[#1f3445] hover:bg-[#1f3445]/90 text-white"
                          onClick={() => {
                            alert(`Request sent to ${senior.name} for their roadmap access!`);
                          }}
                        >
                          Request Roadmap
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1f3445]">Skill Development Path</h2>
              <p className="text-[#1f3445]/80 mb-6">
                Based on your roadmap and successful internships, here are the key skills you should develop in priority order.
              </p>

              {/* Recommended Skills Based on User's Roadmap */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#1f3445] flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-[#1f3445]/10">
                    <GraduationCap className="w-5 h-5 text-[#1f3445]" />
                  </div>
                  <span className="font-bold">Skills from Your Roadmap</span>
                </h3>
                
                {userTimelineEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userTimelineEvents.map((event, index) => (
                      <Card key={`user-skill-${index}`} className="border-[#1f3445]/50 bg-[#1f3445]/5 hover:border-[#1f3445] transition-colors">
                        <CardHeader>
                          <CardTitle className="text-[#1f3445]">{event.skill}</CardTitle>
                          <Badge className="w-fit bg-[#1f3445] text-white">
                            From Your {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[#1f3445]/80 mb-4">{event.description}</p>
                          <Button className="w-full bg-[#1f3445] hover:bg-[#1f3445]/90 text-white">
                            <BookOpen className="w-4 h-4 mr-2 text-white" />
                            Continue Learning
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#1f3445]/70">
                    <p>Add items to your roadmap to see skills you're developing.</p>
                  </div>
                )}
              </div>

              {/* General Recommended Skills */}
              <div>
                <h3 className="text-xl font-semibold text-[#1f3445] flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-[#1f3445]/10">
                    <BookOpen className="w-5 h-5 text-[#1f3445]" />
                  </div>
                  <span className="font-bold">General Recommendations</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[ 
                    { skill: 'React', priority: 'High', description: 'Essential for frontend development' },
                    { skill: 'Node.js', priority: 'High', description: 'Backend development with JavaScript' },
                    { skill: 'Python', priority: 'High', description: 'Versatile language for ML and automation' },
                    { skill: 'Machine Learning', priority: 'Medium', description: 'Growing demand in tech industry' },
                    { skill: 'Cloud Computing', priority: 'Medium', description: 'AWS, Azure, or GCP knowledge' },
                    { skill: 'Database Design', priority: 'Medium', description: 'SQL and NoSQL database management' }
                  ].map((item, index) => (
                    <Card key={`general-skill-${index}`} className="border-[#1f3445]/30 hover:border-[#1f3445] transition-colors">
                      <CardHeader>
                        <CardTitle className="text-[#1f3445]">{item.skill}</CardTitle>
                        <Badge className={
                          item.priority === 'High' 
                            ? 'w-fit bg-red-500 hover:bg-red-500 text-white' 
                            : item.priority === 'Medium' 
                              ? 'w-fit bg-yellow-500 hover:bg-yellow-500 text-white' 
                              : 'w-fit bg-green-500 hover:bg-green-500 text-white'
                        }>
                          {item.priority} Priority
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#1f3445]/80 mb-4">{item.description}</p>
                        <Button className="w-full bg-[#1f3445] hover:bg-[#1f3445]/90 text-white">
                          <BookOpen className="w-4 h-4 mr-2 text-white" />
                          Learn This Skill
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}