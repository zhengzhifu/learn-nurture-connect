
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';
import { 
  specialtyCategories, 
  specialtyOptions, 
  getSpecialtyDisplayName 
} from '@/utils/specialtyOptions';

interface SubjectsFilterProps {
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
}

const SubjectsFilter: React.FC<SubjectsFilterProps> = ({
  selectedSubjects,
  setSelectedSubjects
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  // Group subjects by category for the dropdown
  const subjectsByCategory = specialtyCategories.map(category => ({
    category,
    subjects: specialtyOptions
      .filter(option => option.category === category.value)
      .map(option => ({
        value: `${option.category}:${option.name}`,
        label: getSpecialtyDisplayName(option)
      }))
  }));

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2">Subjects</h3>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedSubjects.map((subject) => {
          const [category, name] = subject.split(':');
          const option = specialtyOptions.find(o => o.category === category && o.name === name);
          const displayName = option ? getSpecialtyDisplayName(option) : subject;
          
          return (
            <Badge
              key={subject}
              variant="default"
              className="cursor-pointer"
              onClick={() => toggleSubject(subject)}
            >
              {displayName}
              <span className="ml-1">×</span>
            </Badge>
          );
        })}
      </div>
      
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => setIsOpen(!isOpen)}
          >
            Select Subjects
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-h-80 overflow-auto">
          <DropdownMenuLabel>Subject Categories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {subjectsByCategory.map(({ category, subjects }) => (
            <React.Fragment key={category.value}>
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                  {category.label}
                </DropdownMenuLabel>
                {subjects.map((subject) => (
                  <DropdownMenuItem 
                    key={subject.value}
                    onClick={() => toggleSubject(subject.value)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    {subject.label}
                    {selectedSubjects.includes(subject.value) && (
                      <Check className="h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SubjectsFilter;
