
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ServiceType } from '@/types/service';
import { ServiceFilters } from '@/services/api/serviceClient';

interface ServiceSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTypes: ServiceType[];
  setSelectedTypes: (types: ServiceType[]) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
  selectedAvailability: string[];
  setSelectedAvailability: (availability: string[]) => void;
  onSearch: (e: React.FormEvent) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

const formatPriceRange = (range: [number, number]): string => {
  return `$${range[0]} - $${range[1]}`;
};

const ServiceSearchFilter: React.FC<ServiceSearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTypes,
  setSelectedTypes,
  locationFilter,
  setLocationFilter,
  priceRange,
  setPriceRange,
  selectedSubjects,
  setSelectedSubjects,
  selectedAvailability,
  setSelectedAvailability,
  onSearch,
  applyFilters,
  clearFilters,
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'];
  const availabilityOptions = ['Weekdays', 'Weekends', 'Mornings', 'Afternoons', 'Evenings'];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-2">
      <form onSubmit={onSearch} className="flex items-center w-full md:w-auto">
        <Input
          type="search"
          placeholder="Search for services..."
          className="mr-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Filter Services</h2>

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

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Location</h3>
              <Input
                type="text"
                placeholder="Enter location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Price Range</h3>
              <Slider
                defaultValue={priceRange}
                max={100}
                step={10}
                onValueChange={(value) => setPriceRange([value[0], value[1]])}
              />
              <p className="text-sm mt-1">{formatPriceRange(priceRange)}</p>
            </div>

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

            <div className="flex justify-between mt-6">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button size="sm" onClick={() => {
                applyFilters();
                setIsFilterOpen(false);
              }}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ServiceSearchFilter;
