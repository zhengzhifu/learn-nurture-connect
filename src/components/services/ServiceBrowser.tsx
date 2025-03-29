
import React from 'react';
import ServiceSearchFilter from './ServiceSearchFilter';
import ServiceList from './ServiceList';
import ServiceBrowseHeader from './ServiceBrowseHeader';
import { ServiceType } from '@/types/service';
import { ServiceData } from '@/services/api/serviceClient';

interface ServiceBrowserProps {
  serviceList: ServiceData[];
  isLoading: boolean;
  hasError: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTypes: ServiceType[];
  setSelectedTypes: (types: ServiceType[]) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  radiusKm: number;
  setRadiusKm: (radius: number) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
  selectedAvailability: string[];
  setSelectedAvailability: (availability: string[]) => void;
  handleSearch: (e: React.FormEvent) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  onServiceClick: (serviceId: string) => void;
}

const ServiceBrowser: React.FC<ServiceBrowserProps> = ({
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
  onServiceClick
}) => {
  return (
    <div className="w-full">
      <ServiceBrowseHeader title="Browse Services" />
      
      <ServiceSearchFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        radiusKm={radiusKm}
        setRadiusKm={setRadiusKm}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedSubjects={selectedSubjects}
        setSelectedSubjects={setSelectedSubjects}
        selectedAvailability={selectedAvailability}
        setSelectedAvailability={setSelectedAvailability}
        onSearch={handleSearch}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />

      <ServiceList 
        serviceList={serviceList}
        isLoading={isLoading}
        hasError={hasError}
        onServiceClick={onServiceClick}
      />
    </div>
  );
};

export default ServiceBrowser;
