import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  ariaLabel?: string;
}

/**
 * Accessible button component with proper ARIA attributes and focus states
 */
export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      icon,
      iconPosition = 'left',
      loading = false,
      ariaLabel,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900';
    
    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm rounded-md min-h-[36px]',
      md: 'px-4 py-2 text-base rounded-lg min-h-[44px]',
      lg: 'px-6 py-3 text-lg rounded-xl min-h-[52px]',
    };
    
    // Variant styles
    const variantStyles = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400',
      secondary: 'bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-600 disabled:bg-gray-600',
      outline: 'bg-transparent border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-900/20 active:bg-indigo-900/30 disabled:opacity-50',
      ghost: 'bg-transparent text-indigo-400 hover:bg-indigo-900/20 active:bg-indigo-900/30 disabled:opacity-50',
      link: 'bg-transparent text-indigo-400 hover:text-indigo-300 underline-offset-4 hover:underline p-0 h-auto disabled:opacity-50',
    };
    
    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';
    
    // Disabled styles
    const disabledStyles = disabled || loading ? 'cursor-not-allowed opacity-70' : '';
    
    // Combine all styles
    const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${disabledStyles} ${className}`;
    
    // Determine accessible name
    const accessibleName = ariaLabel || (typeof children === 'string' ? children : undefined);
    
    return (
      <button
        ref={ref}
        type={type}
        className={buttonStyles}
        disabled={disabled || loading}
        aria-label={accessibleName}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="mr-2 inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" 
                aria-hidden="true" />
        )}
        
        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2" aria-hidden="true">{icon}</span>
        )}
        
        <span>{children}</span>
        
        {icon && iconPosition === 'right' && (
          <span className="ml-2" aria-hidden="true">{icon}</span>
        )}
      </button>
    );
  }
);
