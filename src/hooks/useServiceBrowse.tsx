
import { useState, useEffect, useCallback } from 'react';
import { ServiceClientFactory } from '@/services/api/serviceClientFactory';
import { ServiceData, ServiceFilters } from '@/services/api/serviceClient';
import { ServiceType } from '@/types/service';
import { toast } from 'sonner';

export const useServiceBrowse = () => {
  const [serviceList, setServiceList] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedTypes, setSelectedTypes] = useState<ServiceType[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);

  const hasActiveFilters = 
    selectedTypes.length > 0 ||
    locationFilter !== '' ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 100 ||
    selectedSubjects.length > 0 ||
    selectedAvailability.length > 0;

  const activeFilters: ServiceFilters = {
    types: selectedTypes,
    location: locationFilter,
    priceRange: priceRange,
    subjects: selectedSubjects,
    availability: selectedAvailability,
  };

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
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
      setHasError(true);
      toast.error('Failed to load services. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, hasActiveFilters, activeFilters]);

  const applyFilters = useCallback(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  }, [fetchServices]);

  const clearFilters = useCallback(() => {
    setSelectedTypes([]);
    setLocationFilter('');
    setPriceRange([0, 100]);
    setSelectedSubjects([]);
    setSelectedAvailability([]);
    // Fetch all services after clearing filters
    setTimeout(() => {
      fetchServices();
    }, 0);
  }, [fetchServices]);

  // Initial data fetch
  useEffect(() => {
    console.log('useServiceBrowse: Initial fetch triggered');
    fetchServices();
  }, [fetchServices]);

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
    priceRange,
    setPriceRange,
    selectedSubjects,
    setSelectedSubjects,
    selectedAvailability,
    setSelectedAvailability,
    fetchServices,
    applyFilters,
    handleSearch,
    clearFilters
  };
};
