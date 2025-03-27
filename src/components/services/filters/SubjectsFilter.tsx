
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Define available subjects with their categories
const AVAILABLE_SUBJECTS = {
  'Academic': [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Literature',
    'History',
    'Economics'
  ],
  'Languages': [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese'
  ],
  'Arts': [
    'Music',
    'Painting',
    'Photography',
    'Writing'
  ]
};

interface SubjectsFilterProps {
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
}

const SubjectsFilter: React.FC<SubjectsFilterProps> = ({
  selectedSubjects,
  setSelectedSubjects
}) => {
  const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({
    'Academic': true,
    'Languages': false,
    'Arts': false
  });
  
  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const handleSubjectChange = (subject: string, category: string) => {
    const formattedSubject = `${category}:${subject}`;
    
    if (selectedSubjects.includes(formattedSubject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== formattedSubject));
    } else {
      setSelectedSubjects([...selectedSubjects, formattedSubject]);
    }
  };
  
  const isSelected = (subject: string, category: string) => {
    return selectedSubjects.includes(`${category}:${subject}`);
  };
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2">Subjects</h3>
      
      {Object.entries(AVAILABLE_SUBJECTS).map(([category, subjects]) => (
        <Collapsible 
          key={category}
          open={openCategories[category]} 
          onOpenChange={() => toggleCategory(category)}
          className="mb-2"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
            <span>{category}</span>
            {openCategories[category] ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pt-1 pb-2">
            <div className="flex flex-wrap">
              {subjects.map(subject => (
                <div key={`${category}:${subject}`} className="w-1/2 mb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${category}-${subject}`}
                      checked={isSelected(subject, category)}
                      onCheckedChange={() => handleSubjectChange(subject, category)}
                    />
                    <Label 
                      htmlFor={`${category}-${subject}`}
                      className="text-xs cursor-pointer"
                    >
                      {subject}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default SubjectsFilter;
