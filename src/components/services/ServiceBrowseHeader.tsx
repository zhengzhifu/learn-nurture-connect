
import React from 'react';

interface ServiceBrowseHeaderProps {
  title: string;
}

const ServiceBrowseHeader: React.FC<ServiceBrowseHeaderProps> = ({ title }) => {
  return (
    <h1 className="text-2xl font-semibold mb-4">{title}</h1>
  );
};

export default ServiceBrowseHeader;
