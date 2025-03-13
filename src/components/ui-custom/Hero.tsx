
import React from 'react';
import Button from './Button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-mesh opacity-50"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
            <div className="text-center lg:text-left animate-slide-up">
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
                Tutoring & Babysitting Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="block">Find the perfect</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                  tutor or babysitter
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8">
                Connect with qualified student tutors and babysitters for personalized learning and care. 
                Verified profiles, secure scheduling, and seamless booking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                    Get Started
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button variant="outline" size="lg">
                    Browse Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 animate-fade-in animation-delay-300">
            <div className="relative">
              {/* Main image with glass effect */}
              <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Student tutoring" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-lg shadow-lg animate-float">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 rounded-full w-2 h-2"></div>
                  <p className="text-sm font-medium">500+ Verified Tutors</p>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 glass-card p-4 rounded-lg shadow-lg animate-float animation-delay-500">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 rounded-full w-2 h-2"></div>
                  <p className="text-sm font-medium">Secure Booking System</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
