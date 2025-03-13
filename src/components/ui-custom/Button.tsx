
import React from 'react';
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'ghost' | 'primary' | 'outline' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon
}) => {
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow',
    default: 'hover-lift',
    ghost: 'hover-lift',
    outline: 'hover-lift',
    secondary: 'hover-lift',
    link: ''
  };

  return (
    <ShadcnButton
      variant={variant as any}
      size={size}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cn(
        variantClasses[variant],
        fullWidth ? 'w-full' : '',
        className
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </ShadcnButton>
  );
};

export default Button;
