import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../redux/auth/authHooks';
import CustomInput from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { Box, Typography, Alert, FormControlLabel, Checkbox, Container, Grid } from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { registerUser, isLoading, error, clearAuthError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) clearAuthError();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Map fields to backend API expected format
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
      };
      await registerUser(payload).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
      // Handle backend validation errors
      if (err && typeof err === 'object') {
        const backendErrors = {};
        Object.keys(err).forEach(key => {
          if (Array.isArray(err[key])) {
            backendErrors[key] = err[key][0]; // Take first error message
          } else {
            backendErrors[key] = err[key];
          }
        });
        setErrors(prev => ({ ...prev, ...backendErrors }));
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, px: 2 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: 'white', mb: 2, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            Join Us Today
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
            Create your account and get started
          </Typography>
        </Box>

        <Card elevation={8} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {typeof error === 'object' ? JSON.stringify(error) : error}
                </Alert>
              )}

              <CustomInput label="Full Name" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} error={errors.name} required icon="user" />

              <CustomInput label="Email Address" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} error={errors.email} required icon="email" />

              <CustomInput label="Password" name="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} error={errors.password} required icon="password" showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)} />

              <CustomInput label="Confirm Password" name="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required icon="password" showPassword={showConfirmPassword} onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)} />

              <FormControlLabel control={<Checkbox sx={{ color: '#3b82f6' }} required />} label={<Typography variant="body2" sx={{ color: '#6b7280' }}>I agree to the <Typography component="span" sx={{ color: '#3b82f6', fontWeight: 600 }}>Terms and Conditions</Typography> and <Typography component="span" sx={{ color: '#3b82f6', fontWeight: 600 }}>Privacy Policy</Typography></Typography>} sx={{ mb: 3 }} />

              <Button type="submit" variant="primary" size="large" loading={isLoading} disabled={isLoading} fullWidth sx={{ mb: 3 }}>
                Create Account
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  Already have an account?{' '}
                  <Typography component={Link} to="/login" sx={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                    Sign in here
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

export default Register;
