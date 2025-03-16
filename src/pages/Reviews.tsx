
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ServiceClientFactory } from '@/services/api/serviceClientFactory';
import { Review } from '@/types/review';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import ReviewCard from '@/components/reviews/ReviewCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const Reviews: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const userId = user?.id || 'user123'; // Fallback for development
  
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['reviews', userId],
    queryFn: async () => {
      const client = ServiceClientFactory.getClient();
      return client.getUserReviews(userId);
    }
  });
  
  if (error) {
    toast.error('Failed to load reviews');
    console.error('Error loading reviews:', error);
  }
  
  // Filter reviews based on the active tab
  const filteredReviews = reviews?.filter(review => {
    if (activeTab === 'all') return true;
    if (activeTab === 'tutoring') return review.subject !== 'Babysitting' && review.subject !== 'Childcare';
    if (activeTab === 'childcare') return review.subject === 'Babysitting' || review.subject === 'Childcare';
    return true;
  });
  
  const renderSkeletons = () => {
    return Array(3).fill(null).map((_, index) => (
      <Card key={index} className="mb-4">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-3 w-1/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };
  
  return (
    <PageWrapper>
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <DashboardSidebar />
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold mb-1">Your Reviews</h1>
              <p className="text-muted-foreground">Manage reviews for services you've used</p>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Reviews</TabsTrigger>
                <TabsTrigger value="tutoring">Tutoring</TabsTrigger>
                <TabsTrigger value="childcare">Childcare</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {isLoading ? (
              <div className="space-y-4">
                {renderSkeletons()}
              </div>
            ) : filteredReviews && filteredReviews.length > 0 ? (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No reviews found in this category.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </PageWrapper>
  );
};

export default Reviews;
