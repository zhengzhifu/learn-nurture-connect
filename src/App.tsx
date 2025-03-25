
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Profile from '@/pages/Profile';
import ServiceBrowse from '@/pages/ServiceBrowse';
import Reviews from '@/pages/Reviews';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';

// Import components
import RequireAuth from '@/components/auth/RequireAuth';
import { AuthProvider } from '@/contexts/AuthProvider';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Toaster position="top-right" richColors closeButton />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/browse" element={<ServiceBrowse />} />
            <Route path="/reviews" element={<RequireAuth><Reviews /></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            {/* MyTutors route removed as it's not in MVP scope */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
