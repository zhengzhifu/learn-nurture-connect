
import React, { useState } from 'react';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ServiceCard from '@/components/ui-custom/ServiceCard';
import { Search, Filter, MapPin, BookOpen, Calendar, ChevronDown, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

const ServiceBrowse = () => {
  const [priceRange, setPriceRange] = useState([0, 50]);
  
  // Mock data for services
  const services = [
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
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Chemistry & Physics Tutoring',
      type: 'tutoring' as const,
      rating: 4.6,
      location: 'Stanford Area',
      price: '$35/hr',
      availability: 'Weekday Afternoons'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Daytime Childcare',
      type: 'babysitting' as const,
      rating: 4.9,
      location: 'Downtown Area',
      price: '$22/hr',
      availability: 'Weekday Mornings'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Computer Science & Coding',
      type: 'tutoring' as const,
      rating: 4.8,
      location: 'MIT Area',
      price: '$40/hr',
      availability: 'Evenings & Weekends'
    }
  ];

  return (
    <PageWrapper>
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Services</h1>
            <p className="text-muted-foreground">Find tutors and babysitters that match your needs</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button variant="ghost" size="sm" className="text-muted-foreground text-sm">
                  Reset
                </Button>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search keyword..."
                    className="pl-9"
                  />
                </div>
              </div>
              
              {/* Location */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Location</h4>
                </div>
                <div className="relative">
                  <Input placeholder="Enter your location" />
                </div>
              </div>
              
              {/* Service Type */}
              <Accordion type="single" collapsible defaultValue="service-type">
                <AccordionItem value="service-type" className="border-0">
                  <AccordionTrigger className="py-3 px-0">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium">Service Type</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="tutoring" defaultChecked />
                        <label htmlFor="tutoring" className="text-sm font-medium leading-none cursor-pointer">
                          Tutoring
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="babysitting" defaultChecked />
                        <label htmlFor="babysitting" className="text-sm font-medium leading-none cursor-pointer">
                          Babysitting
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Subjects */}
              <Accordion type="single" collapsible defaultValue="subjects">
                <AccordionItem value="subjects" className="border-0">
                  <AccordionTrigger className="py-3 px-0">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium">Subjects</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="math" />
                        <label htmlFor="math" className="text-sm font-medium leading-none cursor-pointer">
                          Mathematics
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="science" />
                        <label htmlFor="science" className="text-sm font-medium leading-none cursor-pointer">
                          Science
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="english" />
                        <label htmlFor="english" className="text-sm font-medium leading-none cursor-pointer">
                          English & Literature
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="history" />
                        <label htmlFor="history" className="text-sm font-medium leading-none cursor-pointer">
                          History
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="coding" />
                        <label htmlFor="coding" className="text-sm font-medium leading-none cursor-pointer">
                          Computer Science
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Availability */}
              <Accordion type="single" collapsible defaultValue="availability">
                <AccordionItem value="availability" className="border-0">
                  <AccordionTrigger className="py-3 px-0">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">Availability</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="weekdays" />
                        <label htmlFor="weekdays" className="text-sm font-medium leading-none cursor-pointer">
                          Weekdays
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="weekends" />
                        <label htmlFor="weekends" className="text-sm font-medium leading-none cursor-pointer">
                          Weekends
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="mornings" />
                        <label htmlFor="mornings" className="text-sm font-medium leading-none cursor-pointer">
                          Mornings
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="afternoons" />
                        <label htmlFor="afternoons" className="text-sm font-medium leading-none cursor-pointer">
                          Afternoons
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="evenings" />
                        <label htmlFor="evenings" className="text-sm font-medium leading-none cursor-pointer">
                          Evenings
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Price Range */}
              <Accordion type="single" collapsible defaultValue="price">
                <AccordionItem value="price" className="border-0">
                  <AccordionTrigger className="py-3 px-0">
                    <div className="flex items-center space-x-2">
                      <div className="text-primary">$</div>
                      <span className="font-medium">Price Range</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-5 pt-1 px-1">
                      <Slider 
                        defaultValue={[0, 50]} 
                        max={100}
                        step={5}
                        onValueChange={(value) => setPriceRange(value)}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}/hr</span>
                        <span>${priceRange[1]}/hr</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button className="w-full mt-6">Apply Filters</Button>
            </div>
          </div>
          
          {/* Services Grid */}
          <div className="lg:w-3/4">
            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="bg-primary/5 text-primary text-sm py-1 px-3 rounded-full flex items-center">
                Service: Tutoring
                <button className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="bg-primary/5 text-primary text-sm py-1 px-3 rounded-full flex items-center">
                Service: Babysitting
                <button className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="bg-primary/5 text-primary text-sm py-1 px-3 rounded-full flex items-center">
                Within 10 miles
                <button className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
            
            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
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
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-white">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </PageWrapper>
  );
};

export default ServiceBrowse;
