import React from 'react';
import { TextField, FormControl, InputLabel, Input, InputAdornment, IconButton } from '@mui/material';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const CustomInput = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  className = '',
  showPassword = false,
  onTogglePassword,
  icon,
  ...props 
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'email':
        return <Mail size={20} className="text-gray-400" />;
      case 'password':
        return <Lock size={20} className="text-gray-400" />;
      case 'user':
        return <User size={20} className="text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={`mb-6 ${className}`}>
      <TextField
        fullWidth
        label={label}
        type={showPassword ? 'text' : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error}
        required={required}
        variant="outlined"
        InputProps={{
          startAdornment: icon && (
            <InputAdornment position="start">
              {getIcon()}
            </InputAdornment>
          ),
          endAdornment: type === 'password' && (
            <InputAdornment position="end">
              <IconButton
                onClick={onTogglePassword}
                edge="end"
                size="small"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b82f6',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b82f6',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6b7280',
            '&.Mui-focused': {
              color: '#3b82f6',
            },
          },
        }}
        {...props}
      />
    </div>
  );
};

export default CustomInput;
