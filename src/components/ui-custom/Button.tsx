
import React, { forwardRef } from 'react';
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon,
  ...props
}, ref) => {
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
      ref={ref}
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
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </ShadcnButton>
  );
});

Button.displayName = 'Button';

export default Button;
