
import { useState, useCallback, useEffect } from 'react';
import { realServiceListingService } from '@/services/api/realServiceListingService';
import { ServiceType, ServiceData, ServiceFilters } from '@/types/service';

export const useServiceBrowse = () => {
  const [serviceList, setServiceList] = useState<ServiceData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<ServiceType[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [radiusKm, setRadiusKm] = useState(5); // Default to 5km radius
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  
  // Fetch all services on mount
  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      console.log('Fetching all services...');
      const services = await realServiceListingService.getServices();
      console.log(`Fetched ${services.length} services`);
      setServiceList(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  // Handle search submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery || searchQuery.trim() === '') {
      return fetchServices();
    }
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      console.log(`Searching for: "${searchQuery}"`);
      const searchResults = await realServiceListingService.searchServices(searchQuery);
      console.log(`Search returned ${searchResults.length} results`);
      setServiceList(searchResults);
    } catch (error) {
      console.error('Error performing search:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply filters
  const applyFilters = async () => {
    setIsLoading(true);
    setHasError(false);
    
    // Check if any filters are active
    const hasActiveFilters = 
      selectedTypes.length > 0 || 
      locationFilter !== '' || 
      priceRange[0] !== 0 || 
      priceRange[1] !== 100 ||
      selectedSubjects.length > 0 ||
      selectedAvailability.length > 0;
    
    if (!hasActiveFilters) {
      return fetchServices();
    }
    
    try {
      // Build filter object
      const filters: ServiceFilters = {};
      
      if (selectedTypes.length > 0) {
        filters.types = selectedTypes;
      }
      
      if (locationFilter) {
        filters.location = locationFilter;
        filters.radiusKm = radiusKm; // Add radius to the filters
      }
      
      if (priceRange[0] !== 0 || priceRange[1] !== 100) {
        filters.priceRange = priceRange;
      }
      
      if (selectedSubjects.length > 0) {
        filters.subjects = selectedSubjects;
      }
      
      if (selectedAvailability.length > 0) {
        filters.availability = selectedAvailability;
      }
      
      console.log('Applying filters:', filters);
      const filteredResults = await realServiceListingService.filterServices(filters);
      console.log(`Filter returned ${filteredResults.length} results`);
      setServiceList(filteredResults);
    } catch (error) {
      console.error('Error applying filters:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedTypes([]);
    setLocationFilter('');
    setRadiusKm(5); // Reset to default 5km
    setPriceRange([0, 100]);
    setSelectedSubjects([]);
    setSelectedAvailability([]);
    fetchServices();
  };
  
  return {
    serviceList,
    isLoading,
    hasError,
    searchQuery,
    setSearchQuery,
    selectedTypes,
    setSelectedTypes,
    locationFilter,
    setLocationFilter,
    radiusKm,
    setRadiusKm,
    priceRange,
    setPriceRange,
    selectedSubjects,
    setSelectedSubjects,
    selectedAvailability,
    setSelectedAvailability,
    handleSearch,
    applyFilters,
    clearFilters,
    fetchServices
  };
};
