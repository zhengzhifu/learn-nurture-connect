
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ServiceType } from '@/types/service';

interface ServiceTypeFilterProps {
  selectedTypes: ServiceType[];
  setSelectedTypes: (types: ServiceType[]) => void;
}

const ServiceTypeFilter: React.FC<ServiceTypeFilterProps> = ({
  selectedTypes,
  setSelectedTypes
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2">Service Type</h3>
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedTypes.includes('tutoring') ? 'default' : 'secondary'}
          onClick={() =>
            setSelectedTypes(
              selectedTypes.includes('tutoring')
                ? selectedTypes.filter((type) => type !== 'tutoring')
                : [...selectedTypes, 'tutoring']
            )
          }
          className="cursor-pointer"
        >
          Tutoring
        </Badge>
        <Badge
          variant={selectedTypes.includes('babysitting') ? 'default' : 'secondary'}
          onClick={() =>
            setSelectedTypes(
              selectedTypes.includes('babysitting')
                ? selectedTypes.filter((type) => type !== 'babysitting')
                : [...selectedTypes, 'babysitting']
            )
          }
          className="cursor-pointer"
        >
          Babysitting
        </Badge>
      </div>
    </div>
  );
};

export default ServiceTypeFilter;
