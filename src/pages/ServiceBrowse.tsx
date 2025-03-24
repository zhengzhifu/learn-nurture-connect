
import React from 'react';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ServiceBrowser from '@/components/services/ServiceBrowser';
import { useServiceBrowse } from '@/hooks/useServiceBrowse';
import { useNavigate } from 'react-router-dom';

const ServiceBrowse: React.FC = () => {
  const navigate = useNavigate();
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
    // In a full implementation, this would navigate to a service details page
    // navigate(`/services/${serviceId}`);
  };

  return (
    <PageWrapper>
      <Navbar />
      <div className="container mx-auto py-8 pt-24">
        <ServiceBrowser 
          serviceList={serviceList}
          isLoading={isLoading}
          hasError={hasError}
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
          handleSearch={handleSearch}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
          onServiceClick={handleServiceClick}
        />
      </div>
      <Footer />
    </PageWrapper>
  );
};

export default ServiceBrowse;
