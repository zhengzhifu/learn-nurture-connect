
import React from 'react';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import FeatureCard from '@/components/ui-custom/FeatureCard';
import Button from '@/components/ui-custom/Button';
import { Heart, Clock, Users, BookOpen, Award, MapPin, Mail, Phone, Globe } from 'lucide-react';

const About = () => {
  return (
    <PageWrapper>
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                About JumEcole
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Connecting students with passionate tutors for personalized learning experiences.
                Our platform makes it easy to find, schedule, and manage tutoring sessions.
              </p>
              <Button variant="primary" size="lg">
                Get Started Today
              </Button>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-muted-foreground mb-6">
                  At JumEcole, we believe that personalized education should be accessible to everyone. 
                  Our mission is to create a global community of learners and educators, 
                  where knowledge flows freely and learning happens at your own pace.
                </p>
                <p className="text-muted-foreground">
                  We're passionate about connecting students with the perfect tutor 
                  who can inspire them, challenge them, and help them reach their full potential.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                  alt="Student learning with tutor" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose JumEcole</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Users size={24} />}
                title="Expert Tutors"
                description="Our tutors are verified experts in their fields, with proven teaching experience and passion for education."
              />
              <FeatureCard 
                icon={<Clock size={24} />}
                title="Flexible Scheduling"
                description="Book sessions at times that work for you, with instant confirmation and calendar integration."
              />
              <FeatureCard 
                icon={<Award size={24} />}
                title="Quality Education"
                description="Personalized 1-on-1 learning experiences tailored to your specific needs and learning style."
              />
              <FeatureCard 
                icon={<Heart size={24} />}
                title="Safe Community"
                description="A respectful environment where safety and well-being of all users is our top priority."
              />
              <FeatureCard 
                icon={<BookOpen size={24} />}
                title="Diverse Subjects"
                description="From mathematics to music, we offer tutoring across a wide range of academic and creative fields."
              />
              <FeatureCard 
                icon={<Globe size={24} />}
                title="Global Reach"
                description="Connect with tutors and students from around the world, expanding your cultural and educational horizons."
              />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((index) => (
                <Card key={index} className="overflow-hidden hover-lift">
                  <div className="aspect-w-1 aspect-h-1">
                    <img 
                      src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${index + 10}.jpg`} 
                      alt={`Team member ${index}`} 
                      className="object-cover w-full h-64"
                    />
                  </div>
                  <CardContent className="text-center p-6">
                    <h3 className="font-semibold text-lg mb-1">Team Member {index}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {index === 1 ? 'CEO & Founder' : 
                       index === 2 ? 'CTO' : 
                       index === 3 ? 'Head of Education' : 'Marketing Director'}
                    </p>
                    <div className="flex justify-center space-x-4">
                      <a href="#" className="text-gray-400 hover:text-primary">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-primary">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-primary">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.21c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Our Location</h3>
                      <p className="mt-1 text-muted-foreground">
                        1234 Education Street<br />
                        Tech District, CA 94107
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Email Us</h3>
                      <p className="mt-1 text-muted-foreground">
                        info@jumecole.com<br />
                        support@jumecole.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Call Us</h3>
                      <p className="mt-1 text-muted-foreground">
                        +1 (555) 123-4567<br />
                        Mon-Fri from 9am to 6pm
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-6">Send us a message</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    ></textarea>
                  </div>
                  <Button variant="primary" type="submit" fullWidth>
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </PageWrapper>
  );
};

export default About;
