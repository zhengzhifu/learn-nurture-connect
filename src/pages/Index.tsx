
import React from 'react';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/ui-custom/Hero';
import FeatureCard from '@/components/ui-custom/FeatureCard';
import RoleSelectionCard from '@/components/ui-custom/RoleSelectionCard';
import ServiceCard from '@/components/ui-custom/ServiceCard';
import Button from '@/components/ui-custom/Button';
import { Shield, Calendar, Search, Star, Book, Heart, Graduation, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  // Featured services
  const featuredServices = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Math Tutoring - All Levels',
      type: 'tutoring' as const,
      rating: 4.9,
      location: 'Boston University',
      price: '$25-40/hr',
      availability: 'Weekdays & Weekends'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Evening Babysitting',
      type: 'babysitting' as const,
      rating: 4.8,
      location: 'Northwestern Area',
      price: '$20/hr',
      availability: 'Evenings & Weekends'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Language Arts & Writing',
      type: 'tutoring' as const,
      rating: 4.7,
      location: 'Berkeley Area',
      price: '$30/hr',
      availability: 'Flexible Schedule'
    }
  ];

  return (
    <PageWrapper>
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Our platform makes it simple to connect parents with qualified tutors and babysitters
              through a secure, verified network.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="h-6 w-6" />}
              title="Verified Profiles"
              description="All tutors and babysitters undergo a thorough verification process including school email verification and manual review."
            />
            <FeatureCard 
              icon={<Calendar className="h-6 w-6" />}
              title="Easy Scheduling"
              description="Sync with your preferred calendar app for seamless scheduling and reminders for upcoming sessions."
            />
            <FeatureCard 
              icon={<Search className="h-6 w-6" />}
              title="Smart Matching"
              description="Our advanced search and filtering system helps you find the perfect match based on subject, location, and availability."
            />
          </div>
        </div>
      </section>
      
      {/* Role Selection Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-muted-foreground text-lg">
              Whether you're a parent looking for quality education support or a student offering tutoring services,
              we've got you covered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <RoleSelectionCard 
              title="For Parents"
              icon={<Users className="h-6 w-6" />}
              description="Find qualified tutors and babysitters for your children."
              benefits={[
                "Access to verified student profiles",
                "Secure booking and scheduling system",
                "Read reviews from other parents",
                "Flexible payment options"
              ]}
              buttonText="Find a Tutor"
              buttonLink="/register?role=parent"
            />
            
            <RoleSelectionCard 
              title="For Students"
              icon={<Graduation className="h-6 w-6" />}
              description="Offer your tutoring or babysitting services to families."
              benefits={[
                "Create a professional profile",
                "Set your own availability and rates",
                "Receive booking requests",
                "Build your reputation with reviews"
              ]}
              buttonText="Become a Tutor"
              buttonLink="/register?role=student"
              variant="primary"
            />
          </div>
        </div>
      </section>
      
      {/* Featured Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Services</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Explore our top-rated tutoring and babysitting services from qualified students.
              </p>
            </div>
            <Link to="/browse" className="mt-6 md:mt-0">
              <Button variant="outline">
                View All Services
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard
                key={service.id}
                image={service.image}
                title={service.title}
                type={service.type}
                rating={service.rating}
                location={service.location}
                price={service.price}
                availability={service.availability}
                onClick={() => console.log(`View service ${service.id}`)}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What People Say</h2>
            <p className="text-muted-foreground text-lg">
              Don't just take our word for it. Here's what parents and students are saying about our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Testimonial 1 */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-center space-x-1 mb-4">
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-muted-foreground mb-6 italic">
                "Finding a qualified math tutor for my daughter was so easy with this platform. She's improved tremendously in just a few sessions!"
              </p>
              <div className="flex items-center">
                <div className="mr-4 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="font-medium text-gray-600">JD</span>
                </div>
                <div>
                  <p className="font-medium">Jessica D.</p>
                  <p className="text-xs text-muted-foreground">Parent</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-center space-x-1 mb-4">
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-muted-foreground mb-6 italic">
                "As a student, I've been able to earn extra income while doing what I love - teaching and helping younger students succeed."
              </p>
              <div className="flex items-center">
                <div className="mr-4 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="font-medium text-gray-600">MT</span>
                </div>
                <div>
                  <p className="font-medium">Michael T.</p>
                  <p className="text-xs text-muted-foreground">Tutor</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-center space-x-1 mb-4">
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-muted-foreground mb-6 italic">
                "The verification system gives me peace of mind when booking a babysitter for my two young children. Highly recommend!"
              </p>
              <div className="flex items-center">
                <div className="mr-4 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="font-medium text-gray-600">SL</span>
                </div>
                <div>
                  <p className="font-medium">Sarah L.</p>
                  <p className="text-xs text-muted-foreground">Parent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-primary-foreground/90 text-lg mb-8">
              Join our community today and connect with qualified tutors or find new clients for your tutoring services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/browse">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Browse Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </PageWrapper>
  );
};

export default Index;
