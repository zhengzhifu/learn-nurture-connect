
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
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
import { 
  specialtyCategories, 
  getSpecialtiesByCategory, 
  getSpecialtyDisplayName,
  formatSpecialtyForStorage,
  parseSpecialtyFromStorage,
  SpecialtyCategory,
  SpecialtyOption
} from '@/utils/specialtyOptions';

interface SpecialtyManagerProps {
  userId: string;
  userType: 'tutor' | 'parent' | null;
}

const SpecialtyManager: React.FC<SpecialtyManagerProps> = ({ userId, userType }) => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SpecialtyCategory>('science');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  
  const availableSpecialties = getSpecialtiesByCategory(selectedCategory);

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
    if (!selectedSpecialty) {
      toast.error('Please select a specialty');
      return;
    }

    const specialty = availableSpecialties.find(s => s.name === selectedSpecialty);
    if (!specialty) {
      toast.error('Invalid specialty selected');
      return;
    }

    const formattedSpecialty = formatSpecialtyForStorage(specialty);

    try {
      const newSpecialty = await addSpecialty(
        userId, 
        specialty.category, 
        specialty.name
      );
      
      if (newSpecialty) {
        setSpecialties([...specialties, newSpecialty]);
        setSelectedSpecialty('');
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

  const handleCategoryChange = (category: SpecialtyCategory) => {
    setSelectedCategory(category);
    setSelectedSpecialty('');  // Reset specialty selection when category changes
  };

  const getCategoryLabel = (category: string): string => {
    const foundCategory = specialtyCategories.find(c => c.value === category);
    return foundCategory ? foundCategory.label : category;
  };

  // Helper to get the display name of a specialty
  const getSpecialtyLabel = (specialty: Specialty): string => {
    const parsedSpecialty = parseSpecialtyFromStorage(`${specialty.specialty_type}:${specialty.specialty_name}`);
    if (parsedSpecialty) {
      return getSpecialtyDisplayName(parsedSpecialty);
    }
    return specialty.specialty_name;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Specialties</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Label htmlFor="specialtyCategory">Category</Label>
            <Select value={selectedCategory} onValueChange={(value) => handleCategoryChange(value as SpecialtyCategory)}>
              <SelectTrigger id="specialtyCategory">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {specialtyCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="specialtyName">Specialty</Label>
            <div className="flex gap-2">
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger id="specialtyName">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {availableSpecialties.map((specialty) => (
                    <SelectItem key={specialty.name} value={specialty.name}>
                      {getSpecialtyDisplayName(specialty)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                onClick={handleAddSpecialty}
                disabled={!selectedSpecialty}
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
                  {getCategoryLabel(specialty.specialty_type)}:
                </span>
                <span>{getSpecialtyLabel(specialty)}</span>
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
