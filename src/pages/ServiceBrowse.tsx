
import React, { useEffect } from 'react';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ServiceBrowser from '@/components/services/ServiceBrowser';
import { useServiceBrowse } from '@/hooks/useServiceBrowse';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const ServiceBrowse: React.FC = () => {
  const { isAuthenticated, profile } = useAuth();
  const isApproved = profile?.approval_status === 'approved';
  
  console.log("ServiceBrowse: Auth state:", { 
    isAuthenticated, 
    profile: profile ? {
      id: profile.id,
      approval_status: profile.approval_status,
      avatar_url: profile.avatar_url
    } : null,
    isApproved
  });
  
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
    clearFilters,
    fetchServices
  } = useServiceBrowse();

  // Log service list when it changes
  useEffect(() => {
    if (serviceList && serviceList.length > 0) {
      console.log("ServiceBrowse: Service list first item:", { 
        id: serviceList[0].id,
        image: serviceList[0].image,
        provider_avatar: serviceList[0].provider_avatar
      });
    }
  }, [serviceList]);

  const handleServiceClick = (serviceId: string) => {
    console.log('Service clicked:', serviceId);
  };

  return (
    <PageWrapper>
      <Navbar />
      <div className="container mx-auto py-8 pt-24">
        {!isAuthenticated && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Sign in to see more details about these services including provider information and availability.
            </AlertDescription>
          </Alert>
        )}
        
        {isAuthenticated && !isApproved && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your account is pending approval. Once approved, you'll be able to see complete provider information and contact details.
            </AlertDescription>
          </Alert>
        )}
        
        <ServiceBrowser 
          serviceList={serviceList || []}
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
