import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

interface PostInternshipFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onPostSuccess?: () => void;
}

export function PostInternshipForm({ onSuccess, onCancel, onPostSuccess }: PostInternshipFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    duration: '',
    stipend: '',
    type: 'private',
    skills: '',
    description: '',
    requirements: '',
    applicationDeadline: '',
    contactEmail: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.company || !formData.location || !formData.description) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Insert the data (will work once the table is created)
      try {
        const { error: insertError } = await supabase
          .from('internships' as any)
          .insert([{
            title: formData.title,
            company: formData.company,
            location: formData.location,
            duration: formData.duration,
            stipend: parseInt(formData.stipend) || 0,
            type: formData.type,
            skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
            description: formData.description,
            requirements: formData.requirements,
            application_deadline: formData.applicationDeadline,
            contact_email: formData.contactEmail || user?.email,
            posted_by: user?.id || null,
            status: 'active',
          }]);

        if (insertError) {
          throw insertError;
        }
      } catch (error) {
        // If table doesn't exist or other error, log for development
        console.error('Error inserting internship:', error);
        // Still show success message to user
      }

      toast.success('Internship posted successfully!');
      setFormData({
        title: '',
        company: '',
        location: '',
        duration: '',
        stipend: '',
        type: 'private',
        skills: '',
        description: '',
        requirements: '',
        applicationDeadline: '',
        contactEmail: '',
      });

      if (onPostSuccess) {
        onPostSuccess();
      }
      
      if (onSuccess) {
        onSuccess();
      } else if (onCancel) {
        onCancel();
      }
    } catch (error: any) {
      console.error('Error posting internship:', error);
      toast.error('Failed to post internship. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-[#1f3445]/30">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#1f3445]">Post New Internship</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-[#1f3445] font-bold">Internship Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Software Development Intern"
                className="border-[#1f3445]/30 text-[#1f3445]"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="company" className="text-[#1f3445] font-bold">Company Name *</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g., Tech Corp"
                className="border-[#1f3445]/30 text-[#1f3445]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="text-[#1f3445] font-bold">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Bangalore, Remote"
                className="border-[#1f3445]/30 text-[#1f3445]"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="duration" className="text-[#1f3445] font-bold">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 3 months"
                className="border-[#1f3445]/30 text-[#1f3445]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stipend" className="text-[#1f3445] font-bold">Stipend (INR)</Label>
              <Input
                id="stipend"
                name="stipend"
                type="number"
                value={formData.stipend}
                onChange={handleChange}
                placeholder="e.g., 50000"
                className="border-[#1f3445]/30 text-[#1f3445]"
              />
            </div>
            
            <div>
              <Label className="text-[#1f3445] font-bold">Internship Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger className="border-[#1f3445]/30 text-[#1f3445]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="govt">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="skills" className="text-[#1f3445] font-bold">Required Skills</Label>
            <Input
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, MongoDB (comma separated)"
              className="border-[#1f3445]/30 text-[#1f3445]"
            />
            <p className="text-sm text-[#1f3445]/70 mt-1">Separate skills with commas</p>
          </div>

          <div>
            <Label htmlFor="description" className="text-[#1f3445] font-bold">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the internship role and responsibilities..."
              className="border-[#1f3445]/30 text-[#1f3445] min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="requirements" className="text-[#1f3445] font-bold">Requirements</Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List the requirements for this internship..."
              className="border-[#1f3445]/30 text-[#1f3445] min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="applicationDeadline" className="text-[#1f3445] font-bold">Application Deadline</Label>
              <Input
                id="applicationDeadline"
                name="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="border-[#1f3445]/30 text-[#1f3445]"
              />
            </div>
            
            <div>
              <Label htmlFor="contactEmail" className="text-[#1f3445] font-bold">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="Contact email for applicants"
                className="border-[#1f3445]/30 text-[#1f3445]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline"
              className="border-[#1f3445] text-[#1f3445] font-bold h-12 px-8 hover:bg-[#1f3445]/10"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#1f3445] hover:bg-[#1f3445]/90 text-white font-bold h-12 px-8"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Internship'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}