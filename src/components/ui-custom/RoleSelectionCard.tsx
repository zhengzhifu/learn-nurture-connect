
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

interface RoleSelectionCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  benefits: string[];
  buttonText: string;
  buttonLink: string;
  className?: string;
  variant?: 'default' | 'primary';
}

const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({
  title,
  icon,
  description,
  benefits,
  buttonText,
  buttonLink,
  className = '',
  variant = 'default',
}) => {
  return (
    <div 
      className={cn(
        "border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg",
        variant === 'primary' ? 'border-primary/20 bg-primary/5' : 'border-gray-200 bg-white',
        className
      )}
    >
      <div className="p-8">
        <div className="flex items-center mb-6">
          <div className={cn(
            "mr-4 p-3 rounded-xl",
            variant === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary text-foreground'
          )}>
            {icon}
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <ul className="space-y-3 mb-8">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
              <span className="text-sm">{benefit}</span>
            </li>
          ))}
        </ul>
        
        <Link to={buttonLink}>
          <Button 
            variant={variant === 'primary' ? 'primary' : 'outline'} 
            fullWidth
          >
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RoleSelectionCard;
