
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { mockTutorService, Tutor } from '@/services/api/mockTutorService';
import TutorCard from '@/components/tutors/TutorCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { PageWrapper } from '@/components/utils/PageWrapper';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const MyTutorsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tutors on component mount
  useEffect(() => {
    const fetchTutors = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const tutorsData = await mockTutorService.getUserTutors(user.id);
        setTutors(tutorsData);
      } catch (err: any) {
        console.error('Error fetching tutors:', err);
        setError('Failed to load tutors. Please try again later.');
        toast.error('Failed to load tutors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutors();
  }, [user]);

  // Handle bookmark toggle
  const handleToggleBookmark = async (tutorId: string) => {
    if (!user) return;
    
    try {
      await mockTutorService.toggleTutorBookmark(tutorId, user.id);
      
      // Update local state
      setTutors(prevTutors => 
        prevTutors.map(tutor => 
          tutor.id === tutorId 
            ? { ...tutor, isBookmarked: !tutor.isBookmarked } 
            : tutor
        )
      );
      
      // Find the tutor to show the correct toast message
      const tutor = tutors.find(t => t.id === tutorId);
      if (tutor) {
        const action = tutor.isBookmarked ? 'removed from' : 'added to';
        toast.success(`${tutor.full_name} ${action} your saved tutors`);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      toast.error('Failed to update saved tutors');
    }
  };

  // Handle view details
  const handleViewDetails = (tutorId: string) => {
    // In a real app, this would navigate to a tutor detail page
    // For now, we'll just show a toast
    toast.info('Tutor details would open here');
    console.log('Viewing tutor details for:', tutorId);
  };

  // Loading skeletons for tutors
  const TutorSkeletons = () => (
    <>
      {[1, 2, 3].map((_, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <Skeleton className="h-48 md:h-full w-full" />
            </div>
            <div className="p-5 md:w-2/3">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-10 w-full md:w-2/3 mt-4" />
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <PageWrapper>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <DashboardSidebar userData={profile} isLoading={isLoading} />
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            <h1 className="text-2xl font-bold mb-6">My Tutors</h1>
            
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              {isLoading ? (
                <TutorSkeletons />
              ) : tutors.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <p className="text-lg text-muted-foreground">
                    You don't have any tutors yet. Browse services to find tutors.
                  </p>
                </div>
              ) : (
                <>
                  {tutors.map((tutor) => (
                    <TutorCard
                      key={tutor.id}
                      tutor={tutor}
                      onToggleBookmark={handleToggleBookmark}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default MyTutorsPage;
