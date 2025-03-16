
import React, { useState, useEffect } from 'react';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ServiceCard from '@/components/ui-custom/ServiceCard';
import { Search, Filter, MapPin, BookOpen, Calendar, ChevronDown, CheckCircle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ServiceClientFactory } from '@/services/api/serviceClientFactory';
import { ServiceData, ServiceFilters } from '@/services/api/serviceClient';
import { ServiceType } from '@/types/service';

const ServiceBrowse = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceData[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<{
    types: ServiceType[];
    location?: string;
  }>({
    types: ['tutoring', 'babysitting'],
  });
  
  // Get the service client from the factory
  const serviceClient = ServiceClientFactory.getClient();
  
  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const data = await serviceClient.getServices();
        setServices(data);
        setFilteredServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  // Apply filters to services
  const applyFilters = async () => {
    try {
      setIsLoading(true);
      
      const filters: ServiceFilters = {
        types: activeFilters.types,
        location: location || undefined,
        priceRange: priceRange
      };
      
      const filteredData = await serviceClient.filterServices(filters);
      setFilteredServices(filteredData);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const searchResults = await serviceClient.searchServices(searchTerm);
      setFilteredServices(searchResults);
    } catch (error) {
      console.error('Error searching services:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle service type filter
  const toggleTypeFilter = (type: ServiceType) => {
    setActiveFilters(prev => {
      const types = prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type];
      
      return { ...prev, types };
    });
  };
  
  // Remove location filter
  const removeLocationFilter = () => {
    setLocation('');
    setActiveFilters(prev => ({ ...prev, location: undefined }));
  };
  
  // Apply filters when the Apply button is clicked
  const handleApplyFilters = () => {
    setActiveFilters(prev => ({
      ...prev,
      location: location || undefined
    }));
    
    applyFilters();
  };
  
  // Apply filters when activeFilters change
  useEffect(() => {
    applyFilters();
  }, [activeFilters]);

  return (
    <PageWrapper>
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Services</h1>
            <p className="text-muted-foreground">Find tutors and babysitters that match your needs</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground text-sm"
                  onClick={() => {
                    setActiveFilters({ types: ['tutoring', 'babysitting'] });
                    setPriceRange([0, 50]);
                    setLocation('');
                    setSearchTerm('');
                  }}
                >
                  Reset
                </Button>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search keyword..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                </div>
              </div>
              
              {/* Location */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Location</h4>
                </div>
                <div className="relative">
                  <Input 
                    placeholder="Enter your location" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Service Type */}
              <Accordion type="single" collapsible defaultValue="service-type">
                <AccordionItem value="service-type" className="border-0">
                  <AccordionTrigger className="py-3 px-0">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium">Service Type</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="tutoring" 
                          checked={activeFilters.types.includes('tutoring')}
                          onCheckedChange={() => toggleTypeFilter('tutoring')}
                        />
                        <label htmlFor="tutoring" className="text-sm font-medium leading-none cursor-pointer">
                          Tutoring
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="babysitting" 
                          checked={activeFilters.types.includes('babysitting')}
                          onCheckedChange={() => toggleTypeFilter('babysitting')}
                        />
                        <label htmlFor="babysitting" className="text-sm font-medium leading-none cursor-pointer">
                          Babysitting
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Subjects */}
              <Accordion type="single" collapsible defaultValue="subjects">
                <AccordionItem value="subjects" className="border-0">
                  <AccordionTrigger className="py-3 px-0">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium">Subjects</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="math" />
                        <label htmlFor="math" className="text-sm font-medium leading-none cursor-pointer">
                          Mathematics
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="science" />
                        <label htmlFor="science" className="text-sm font-medium leading-none cursor-pointer">
                          Science
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="english" />
                        <label htmlFor="english" className="text-sm font-medium leading-none cursor-pointer">
                          English & Literature
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="history" />
                        <label htmlFor="history" className="text-sm font-medium leading-none cursor-pointer">
                          History
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="coding" />
                        <label htmlFor="coding" className="text-sm font-medium leading-none cursor-pointer">
                          Computer Science
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Availability */}
              <Accordion type="single" collapsible defaultValue="availability">
                <AccordionItem value="availability" className="border-0">
                  <AccordionTrigger className="py-3 px-0">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">Availability</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="weekdays" />
                        <label htmlFor="weekdays" className="text-sm font-medium leading-none cursor-pointer">
                          Weekdays
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="weekends" />
                        <label htmlFor="weekends" className="text-sm font-medium leading-none cursor-pointer">
                          Weekends
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="mornings" />
                        <label htmlFor="mornings" className="text-sm font-medium leading-none cursor-pointer">
                          Mornings
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="afternoons" />
                        <label htmlFor="afternoons" className="text-sm font-medium leading-none cursor-pointer">
                          Afternoons
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="evenings" />
                        <label htmlFor="evenings" className="text-sm font-medium leading-none cursor-pointer">
                          Evenings
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Price Range */}
              <Accordion type="single" collapsible defaultValue="price">
                <AccordionItem value="price" className="border-0">
                  <AccordionTrigger className="py-3 px-0">
                    <div className="flex items-center space-x-2">
                      <div className="text-primary">$</div>
                      <span className="font-medium">Price Range</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-5 pt-1 px-1">
                      <Slider 
                        defaultValue={[0, 50]} 
                        max={100}
                        step={5}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}/hr</span>
                        <span>${priceRange[1]}/hr</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button 
                className="w-full mt-6"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
          
          {/* Services Grid */}
          <div className="lg:w-3/4">
            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {activeFilters.types.includes('tutoring') && (
                <div className="bg-primary/5 text-primary text-sm py-1 px-3 rounded-full flex items-center">
                  Service: Tutoring
                  <button className="ml-2" onClick={() => toggleTypeFilter('tutoring')}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {activeFilters.types.includes('babysitting') && (
                <div className="bg-primary/5 text-primary text-sm py-1 px-3 rounded-full flex items-center">
                  Service: Babysitting
                  <button className="ml-2" onClick={() => toggleTypeFilter('babysitting')}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {location && (
                <div className="bg-primary/5 text-primary text-sm py-1 px-3 rounded-full flex items-center">
                  Location: {location}
                  <button className="ml-2" onClick={removeLocationFilter}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Results */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading services...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No services found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search criteria</p>
                <Button onClick={() => {
                  setActiveFilters({ types: ['tutoring', 'babysitting'] });
                  setPriceRange([0, 50]);
                  setLocation('');
                  setSearchTerm('');
                }}>
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    image={service.image}
                    title={service.title}
                    type={service.type}
                    rating={service.rating}
                    location={service.location}
                    price={service.price}
                    availability={service.availability}
                    onClick={() => console.log(`View service ${service.id}`)}
                  />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {filteredServices.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary text-white">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </PageWrapper>
  );
};

export default ServiceBrowse;
