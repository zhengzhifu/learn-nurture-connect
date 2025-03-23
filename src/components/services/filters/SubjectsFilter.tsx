
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SubjectsFilterProps {
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
}

const SubjectsFilter: React.FC<SubjectsFilterProps> = ({
  selectedSubjects,
  setSelectedSubjects
}) => {
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'];

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2">Subjects</h3>
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <Badge
            key={subject}
            variant={selectedSubjects.includes(subject) ? 'default' : 'secondary'}
            onClick={() =>
              setSelectedSubjects(
                selectedSubjects.includes(subject)
                  ? selectedSubjects.filter((s) => s !== subject)
                  : [...selectedSubjects, subject]
              )
            }
            className="cursor-pointer"
          >
            {subject}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SubjectsFilter;
