
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import TutorCard from '@/components/tutors/TutorCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import PageWrapper from '@/components/utils/PageWrapper';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tutor } from '@/types/auth';
import { getDisplayName } from '@/utils/profileUtils';

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
        
        // Fetch tutors from Supabase
        // In this implementation, we'll fetch directly from tutors and profiles tables
        const { data, error } = await supabase
          .from('tutors')
          .select('*, profiles:id(*)')
          .limit(10);
          
        if (error) throw error;
        
        // Transform the data to match the Tutor interface
        const transformedTutors: Tutor[] = data.map(item => {
          const profile = item.profiles;
          const fullName = getDisplayName({
            id: profile?.id || '',
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            email: profile?.email || '',
            user_type: profile?.user_type || 'tutor'
          });
          
          return {
            id: profile?.id || item.id,
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            full_name: fullName,
            email: profile?.email || '',
            user_type: profile?.user_type || 'tutor',
            phone: profile?.phone || '',
            avatar_url: profile?.avatar_url || '',
            verified: profile?.verified || false,
            subjects: [], // Default empty subjects
            hourlyRate: parseFloat(String(item.hourly_rate)) || 0,
            rating: 4.5, // Default rating
            reviewCount: 0, // Default count
            availability: ['Weekdays', 'Weekends'], // Default availability
            bio: item.bio || 'Tutor profile', // Default bio
            isBookmarked: false // Default bookmark status
          };
        });
        
        setTutors(transformedTutors);
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
      // In real implementation, we would update a bookmarks table in Supabase
      // For now, just update UI state
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
        const name = getDisplayName(tutor);
        const action = tutor.isBookmarked ? 'removed from' : 'added to';
        toast.success(`${name} ${action} your saved tutors`);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      toast.error('Failed to update saved tutors');
    }
  };

  // Handle view details
  const handleViewDetails = (tutorId: string) => {
    // In a real app, this would navigate to a tutor detail page
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
      <Navbar />
      <div className="container mx-auto py-8 px-4 pt-24">
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
      <Footer />
    </PageWrapper>
  );
};

export default MyTutorsPage;
