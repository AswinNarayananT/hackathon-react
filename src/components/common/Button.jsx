import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'contained', 
  size = 'large',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  startIcon,
  endIcon,
  fullWidth = false,
  ...props 
}) => {
  const getVariant = () => {
    switch (variant) {
      case 'primary':
        return 'contained';
      case 'secondary':
        return 'outlined';
      case 'outline':
        return 'outlined';
      case 'danger':
        return 'contained';
      default:
        return variant;
    }
  };

  const getColor = () => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      case 'danger':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'small';
      case 'md':
        return 'medium';
      case 'lg':
        return 'large';
      default:
        return size;
    }
  };

  return (
    <MuiButton
      type={type}
      variant={getVariant()}
      color={getColor()}
      size={getSize()}
      disabled={disabled || loading}
      onClick={onClick}
      fullWidth={fullWidth}
      startIcon={loading ? <Loader2 className="animate-spin" size={16} /> : startIcon}
      endIcon={endIcon}
      sx={{
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
        padding: size === 'large' ? '12px 24px' : size === 'medium' ? '8px 16px' : '6px 12px',
        fontSize: size === 'large' ? '16px' : size === 'medium' ? '14px' : '12px',
        boxShadow: variant === 'contained' ? '0 4px 14px 0 rgba(59, 130, 246, 0.15)' : 'none',
        '&:hover': {
          boxShadow: variant === 'contained' ? '0 6px 20px 0 rgba(59, 130, 246, 0.25)' : 'none',
          transform: 'translateY(-1px)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
      className={className}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </MuiButton>
  );
};

export default Button;
