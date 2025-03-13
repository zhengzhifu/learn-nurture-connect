
import React from 'react';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui-custom/Button';
import { Calendar, Users, Book, Clock, Star, Settings, Bell, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Dashboard = () => {
  const { profile, isLoading } = useAuth();

  // Helper to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <PageWrapper>
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-24 w-24 rounded-full mb-4" />
                        <Skeleton className="h-6 w-32 mb-1" />
                        <Skeleton className="h-4 w-20 mb-4" />
                      </>
                    ) : (
                      <>
                        {profile?.avatar_url ? (
                          <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                            <AvatarFallback>{getInitials(profile?.full_name || "User")}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <User className="h-12 w-12 text-primary" />
                          </div>
                        )}
                        <h3 className="font-semibold text-xl mb-1">{profile?.full_name || "User"}</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {profile?.user_type ? profile.user_type.charAt(0).toUpperCase() + profile.user_type.slice(1) : "User"}
                        </p>
                      </>
                    )}
                    <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = "/profile"}>
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Navigation */}
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-primary/10 text-primary">
                      <Book className="h-5 w-5" />
                      <span className="font-medium">Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-foreground hover:bg-gray-100 transition-colors">
                      <Calendar className="h-5 w-5" />
                      <span>Bookings</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-foreground hover:bg-gray-100 transition-colors">
                      <Users className="h-5 w-5" />
                      <span>My Tutors</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-foreground hover:bg-gray-100 transition-colors">
                      <Star className="h-5 w-5" />
                      <span>Reviews</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-foreground hover:bg-gray-100 transition-colors">
                      <Bell className="h-5 w-5" />
                      <span>Notifications</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-foreground hover:bg-gray-100 transition-colors">
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {isLoading ? (
                  <Skeleton className="inline-block h-4 w-24" />
                ) : (
                  profile?.full_name?.split(' ')[0] || "User"
                )}. Here's what's happening with your tutoring services.
              </p>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Upcoming Sessions</p>
                      <h4 className="text-2xl font-bold">3</h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Active Tutors</p>
                      <h4 className="text-2xl font-bold">2</h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Hours This Month</p>
                      <h4 className="text-2xl font-bold">12</h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Dashboard Content */}
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-6 bg-muted">
                <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
                <TabsTrigger value="past">Past Sessions</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-4">
                {/* Session Cards */}
                <Card className="hover-lift">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row overflow-hidden">
                      <div className="bg-primary/5 p-6 md:w-1/3">
                        <p className="text-sm text-muted-foreground mb-1">Thursday, October 12</p>
                        <p className="text-xl font-semibold mb-1">4:00 PM - 5:30 PM</p>
                        <div className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mt-2">
                          Tutoring
                        </div>
                      </div>
                      <div className="p-6 md:w-2/3">
                        <h4 className="font-semibold text-lg mb-2">Math Tutoring - Algebra</h4>
                        <div className="flex items-center text-muted-foreground text-sm mb-4">
                          <User className="h-4 w-4 mr-2" />
                          <span>with Alex Thompson</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500">
                            Cancel
                          </Button>
                          <Button variant="primary" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover-lift">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row overflow-hidden">
                      <div className="bg-primary/5 p-6 md:w-1/3">
                        <p className="text-sm text-muted-foreground mb-1">Saturday, October 14</p>
                        <p className="text-xl font-semibold mb-1">10:00 AM - 1:00 PM</p>
                        <div className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 mt-2">
                          Babysitting
                        </div>
                      </div>
                      <div className="p-6 md:w-2/3">
                        <h4 className="font-semibold text-lg mb-2">Weekend Childcare</h4>
                        <div className="flex items-center text-muted-foreground text-sm mb-4">
                          <User className="h-4 w-4 mr-2" />
                          <span>with Emma Davis</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500">
                            Cancel
                          </Button>
                          <Button variant="primary" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="past">
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-medium mb-2">No past sessions yet</h4>
                      <p className="text-muted-foreground mb-6">Your completed sessions will appear here once you've had your first session.</p>
                      <Button variant="outline">
                        Browse Tutors
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="requests">
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-medium mb-2">No pending requests</h4>
                      <p className="text-muted-foreground mb-6">When you send a request to a tutor or receive one, it will appear here.</p>
                      <Button variant="outline">
                        Post a Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </PageWrapper>
  );
};

export default Dashboard;
