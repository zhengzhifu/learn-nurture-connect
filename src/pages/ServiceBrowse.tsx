
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ServiceSearchFilter from '@/components/services/ServiceSearchFilter';
import ServiceList from '@/components/services/ServiceList';
import { useServiceBrowse } from '@/hooks/useServiceBrowse';

const ServiceBrowse: React.FC = () => {
  const {
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
    handleSearch,
    applyFilters,
    clearFilters
  } = useServiceBrowse();

  const handleServiceClick = (serviceId: string) => {
    console.log('Service clicked:', serviceId);
  };

  return (
    <PageWrapper>
      <Navbar />
      <div className="container mx-auto py-8 pt-24">
        <h1 className="text-2xl font-semibold mb-4">Browse Services</h1>

        <ServiceSearchFilter 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
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
          onServiceClick={handleServiceClick}
        />
      </div>
      <Footer />
    </PageWrapper>
  );
};

export default ServiceBrowse;
