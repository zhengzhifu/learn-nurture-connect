
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
import { School } from '@/types/auth';
import { fetchApprovedSchools, suggestNewSchool } from '@/services/api/schoolService';
import { toast } from 'sonner';
import Button from '@/components/ui-custom/Button';

interface SchoolSelectorProps {
  selectedSchoolId: string | undefined;
  otherSchoolName: string | undefined;
  onSchoolChange: (schoolId: string | undefined, otherSchoolName: string | undefined) => void;
  label?: string;
}

const SchoolSelector: React.FC<SchoolSelectorProps> = ({
  selectedSchoolId,
  otherSchoolName,
  onSchoolChange,
  label = "School"
}) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(!!otherSchoolName);
  const [newSchoolName, setNewSchoolName] = useState(otherSchoolName || '');
  const [newSchoolAddress, setNewSchoolAddress] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string>(selectedSchoolId || '');

  useEffect(() => {
    const loadSchools = async () => {
      setIsLoading(true);
      try {
        const schoolsData = await fetchApprovedSchools();
        setSchools(schoolsData);
        
        // If we have a selected school ID but no selection state yet
        if (selectedSchoolId && !selectedSchool) {
          setSelectedSchool(selectedSchoolId);
        }
      } catch (error) {
        console.error('Error loading schools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchools();
  }, [selectedSchoolId]);

  // Update local state when props change (for when navigating directly to profile page)
  useEffect(() => {
    if (selectedSchoolId) {
      setSelectedSchool(selectedSchoolId);
      setShowOtherInput(false);
    } else if (otherSchoolName) {
      setShowOtherInput(true);
      setNewSchoolName(otherSchoolName);
    }
  }, [selectedSchoolId, otherSchoolName]);

  const handleSchoolChange = (value: string) => {
    if (value === 'other') {
      setShowOtherInput(true);
      setSelectedSchool('other');
      onSchoolChange(undefined, newSchoolName);
    } else {
      setShowOtherInput(false);
      setSelectedSchool(value);
      onSchoolChange(value, undefined);
    }
  };

  const handleSubmitNewSchool = async () => {
    if (!newSchoolName.trim()) {
      toast.error('Please enter a school name');
      return;
    }

    try {
      const newSchool = await suggestNewSchool(newSchoolName, newSchoolAddress);
      if (newSchool) {
        onSchoolChange(undefined, newSchoolName);
        toast.success('School submitted for approval successfully');
      }
    } catch (error) {
      console.error('Error submitting new school:', error);
    }
  };

  const getDisplayValue = () => {
    if (showOtherInput && otherSchoolName) {
      return otherSchoolName;
    }

    if (selectedSchool && selectedSchool !== 'other') {
      const school = schools.find(s => s.id === selectedSchool);
      return school?.name || "Select a school";
    }

    return "Select a school";
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="school">{label}</Label>
        <Select
          value={showOtherInput ? 'other' : selectedSchool}
          onValueChange={handleSchoolChange}
          disabled={isLoading}
        >
          <SelectTrigger id="school">
            <SelectValue placeholder="Select a school">{getDisplayValue()}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {schools.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
            <SelectItem value="other">Other (suggest a new school)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showOtherInput && (
        <div className="space-y-4 p-4 border rounded-md">
          <div className="grid gap-2">
            <Label htmlFor="newSchoolName">School Name</Label>
            <Input
              id="newSchoolName"
              value={newSchoolName}
              onChange={(e) => setNewSchoolName(e.target.value)}
              placeholder="Enter school name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="newSchoolAddress">School Address (optional)</Label>
            <Input
              id="newSchoolAddress"
              value={newSchoolAddress}
              onChange={(e) => setNewSchoolAddress(e.target.value)}
              placeholder="Enter school address"
            />
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleSubmitNewSchool}
            className="mt-2"
          >
            Submit New School
          </Button>
          
          <p className="text-xs text-muted-foreground mt-2">
            Note: New schools will need to be approved by administrators before they appear in the list.
          </p>
        </div>
      )}
    </div>
  );
};

export default SchoolSelector;
