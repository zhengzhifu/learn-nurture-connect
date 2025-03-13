
import React, { ReactNode } from 'react';
import AnimatedTransition from './AnimatedTransition';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = "" }) => {
  return (
    <AnimatedTransition className={`min-h-screen w-full ${className}`}>
      {children}
    </AnimatedTransition>
  );
};

export default PageWrapper;
