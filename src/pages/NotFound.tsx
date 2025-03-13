
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui-custom/Button';
import { Home } from 'lucide-react';
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageWrapper>
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen bg-mesh">
        <div className="text-center px-4 sm:px-6 lg:px-8 py-24 max-w-lg glass-card rounded-2xl">
          <h1 className="text-9xl font-bold text-primary mb-6">404</h1>
          
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved. Please check the URL or navigate back to the home page.
          </p>
          
          <Link to="/">
            <Button variant="primary" icon={<Home className="w-4 h-4" />}>
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </PageWrapper>
  );
};

export default NotFound;
