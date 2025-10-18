import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../redux/auth/authHooks';
import CustomInput from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { Box, Typography, Alert, FormControlLabel, Checkbox, Container, Grid } from '@mui/material';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const { loginUser, isLoading, error, clearAuthError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear auth error
    if (error) {
      clearAuthError();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await loginUser(formData).unwrap();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              color: 'white', 
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 400
            }}
          >
            Sign in to your account
          </Typography>
        </Box>

        <Card elevation={8} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
              
              <CustomInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                icon="email"
              />
              
              <CustomInput
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                icon="password"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={<Checkbox sx={{ color: '#3b82f6' }} />}
                  label="Remember me"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px' } }}
                />
                
                <Typography 
                  component={Link}
                  to="/forgot-password"
                  sx={{ 
                    color: '#3b82f6', 
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Forgot password?
                </Typography>
              </Box>
              
              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={isLoading}
                disabled={isLoading}
                fullWidth
                sx={{ mb: 3 }}
              >
                Sign In
              </Button>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  Don't have an account?{' '}
                  <Typography 
                    component={Link}
                    to="/register"
                    sx={{ 
                      color: '#3b82f6', 
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Create one here
                  </Typography>
                </Typography>
              </Box>
            </form>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
