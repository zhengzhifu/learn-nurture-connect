import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ServiceCard from '@/components/ui-custom/ServiceCard';
import { ServiceClientFactory } from '@/services/api/serviceClientFactory';
import { ServiceData, ServiceFilters } from '@/services/api/serviceClient';
import { ServiceType } from '@/types/service';
import { toast } from 'sonner';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const formatPriceRange = (range: [number, number]): string => {
  return `$${range[0]} - $${range[1]}`;
};

const ServiceBrowse: React.FC = () => {
  const [serviceList, setServiceList] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState<ServiceType[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'];
  const availabilityOptions = ['Weekdays', 'Weekends', 'Mornings', 'Afternoons', 'Evenings'];

  const activeFilters: ServiceFilters = {
    types: selectedTypes,
    location: locationFilter,
    priceRange: priceRange,
    subjects: selectedSubjects,
    availability: selectedAvailability,
  };

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    locationFilter !== '' ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 100 ||
    selectedSubjects.length > 0 ||
    selectedAvailability.length > 0;

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const serviceClient = ServiceClientFactory.getClient();
      let services: ServiceData[] = [];
      
      if (searchQuery) {
        services = await serviceClient.searchServices(searchQuery);
      } else if (hasActiveFilters) {
        services = await serviceClient.filterServices(activeFilters);
      } else {
        services = await serviceClient.getServices();
      }
      
      console.log('Fetched services:', services);
      setServiceList(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const applyFilters = () => {
    fetchServices();
    setIsFilterOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setLocationFilter('');
    setPriceRange([0, 100]);
    setSelectedSubjects([]);
    setSelectedAvailability([]);
  };

  const handleServiceClick = (serviceId: string) => {
    console.log('Service clicked:', serviceId);
  };

  return (
    <PageWrapper>
      <Navbar />
      <div className="container mx-auto py-8 pt-24">
        <h1 className="text-2xl font-semibold mb-4">Browse Services</h1>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-2">
          <form onSubmit={handleSearch} className="flex items-center w-full md:w-auto">
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
                  <Button size="sm" onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-40 w-full mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : serviceList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceList.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onClick={() => handleServiceClick(service.id)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No services found. Try adjusting your filters or search query.</p>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </PageWrapper>
  );
};

export default ServiceBrowse;
