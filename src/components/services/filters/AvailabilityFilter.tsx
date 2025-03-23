
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface AvailabilityFilterProps {
  selectedAvailability: string[];
  setSelectedAvailability: (availability: string[]) => void;
}

const AvailabilityFilter: React.FC<AvailabilityFilterProps> = ({
  selectedAvailability,
  setSelectedAvailability
}) => {
  const availabilityOptions = ['Weekdays', 'Weekends', 'Mornings', 'Afternoons', 'Evenings'];

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2">Availability</h3>
      <div className="flex flex-wrap gap-2">
        {availabilityOptions.map((option) => (
          <Badge
            key={option}
            variant={selectedAvailability.includes(option) ? 'default' : 'secondary'}
            onClick={() =>
              setSelectedAvailability(
                selectedAvailability.includes(option)
                  ? selectedAvailability.filter((a) => a !== option)
                  : [...selectedAvailability, option]
              )
            }
            className="cursor-pointer"
          >
            {option}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityFilter;
