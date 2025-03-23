
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Button from '@/components/ui-custom/Button';
import { Specialty } from '@/types/auth';
import { fetchUserSpecialties, addSpecialty, removeSpecialty } from '@/services/api/specialtyService';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SpecialtyManagerProps {
  userId: string;
  userType: 'tutor' | 'parent' | null;
}

const specialtyTypes = {
  tutor: [
    { value: 'subject', label: 'Subject' },
    { value: 'grade_level', label: 'Grade Level' },
    { value: 'language', label: 'Language' },
    { value: 'test_prep', label: 'Test Preparation' }
  ],
  babysitter: [
    { value: 'age_group', label: 'Age Group' },
    { value: 'activity', label: 'Activity' },
    { value: 'special_needs', label: 'Special Needs' },
    { value: 'first_aid', label: 'First Aid/Safety' }
  ]
};

const SpecialtyManager: React.FC<SpecialtyManagerProps> = ({ userId, userType }) => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [specialtyType, setSpecialtyType] = useState(
    userType === 'tutor' ? 'subject' : 'age_group'
  );
  const [specialtyName, setSpecialtyName] = useState('');
  
  // Determine which specialty types to show based on user type
  const availableSpecialtyTypes = userType === 'tutor' 
    ? specialtyTypes.tutor 
    : specialtyTypes.babysitter;

  useEffect(() => {
    if (userId) {
      loadSpecialties();
    }
  }, [userId]);

  const loadSpecialties = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUserSpecialties(userId);
      setSpecialties(data);
    } catch (error) {
      console.error('Error loading specialties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSpecialty = async () => {
    if (!specialtyName.trim()) {
      toast.error('Please enter a specialty name');
      return;
    }

    try {
      const newSpecialty = await addSpecialty(userId, specialtyType, specialtyName);
      if (newSpecialty) {
        setSpecialties([...specialties, newSpecialty]);
        setSpecialtyName('');
        toast.success('Specialty added successfully');
      }
    } catch (error) {
      console.error('Error adding specialty:', error);
    }
  };

  const handleRemoveSpecialty = async (id: string) => {
    try {
      await removeSpecialty(id);
      setSpecialties(specialties.filter(s => s.id !== id));
      toast.success('Specialty removed successfully');
    } catch (error) {
      console.error('Error removing specialty:', error);
    }
  };

  const getSpecialtyTypeLabel = (type: string) => {
    const allTypes = [...specialtyTypes.tutor, ...specialtyTypes.babysitter];
    const found = allTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Specialties</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Label htmlFor="specialtyType">Type</Label>
            <Select value={specialtyType} onValueChange={setSpecialtyType}>
              <SelectTrigger id="specialtyType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {availableSpecialtyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="specialtyName">Specialty</Label>
            <div className="flex gap-2">
              <Input
                id="specialtyName"
                value={specialtyName}
                onChange={(e) => setSpecialtyName(e.target.value)}
                placeholder={`Enter ${getSpecialtyTypeLabel(specialtyType).toLowerCase()}`}
              />
              <Button 
                type="button" 
                onClick={handleAddSpecialty}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {specialties.length > 0 ? (
        <div className="space-y-2">
          <Label>Your Specialties</Label>
          <div className="flex flex-wrap gap-2 p-4 border rounded-md">
            {specialties.map((specialty) => (
              <Badge key={specialty.id} variant="secondary" className="flex items-center gap-1 px-3 py-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  {getSpecialtyTypeLabel(specialty.specialty_type)}:
                </span>
                <span>{specialty.specialty_name}</span>
                <button
                  onClick={() => handleRemoveSpecialty(specialty.id)}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-4 border rounded-md text-muted-foreground">
          No specialties added. Add your specialties above.
        </div>
      )}
    </div>
  );
};

export default SpecialtyManager;
