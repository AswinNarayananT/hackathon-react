import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../redux/auth/authHooks';
import { 
  Box, 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CircularProgress,
  Alert
} from '@mui/material';
import { CheckCircle, XCircle, Building2 } from 'lucide-react';
import api from '../api';

const AcceptInvitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    checkInvitation();
  }, [token, isAuthenticated]);

  const checkInvitation = async () => {
    try {
      const response = await api.get(`/shorturl/invitations/${token}/`);
      setInvitation(response.data);
      
      // If user is authenticated and email matches, auto-accept
      if (isAuthenticated && user?.email === response.data.email) {
        await acceptInvitation();
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired invitation');
      setLoading(false);
    }
  };

  const handleRegister = () => {
    // Store token in localStorage and redirect to register
    localStorage.setItem('pending_invitation_token', token);
    localStorage.setItem('invitation_email', invitation?.email);
    navigate('/register', { state: { from: `/accept-invitation/${token}`, email: invitation?.email } });
  };

  const acceptInvitation = async () => {
    if (!isAuthenticated) {
      // Store token in localStorage and redirect to login
      localStorage.setItem('pending_invitation_token', token);
      navigate('/login', { state: { from: `/accept-invitation/${token}` } });
      return;
    }

    setAccepting(true);
    try {
      const response = await api.post(`/shorturl/invitations/${token}/accept/`);
      setSuccess(true);
      
      // Clear pending invitation token
      localStorage.removeItem('pending_invitation_token');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to accept invitation');
      setAccepting(false);
    }
  };

  const declineInvitation = async () => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    try {
      await api.post(`/shorturl/invitations/${token}/decline/`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to decline invitation');
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (success) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <Container maxWidth="sm">
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <CheckCircle size={64} color="#1dbf73" style={{ margin: '0 auto 20px' }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#111' }}>
              Welcome Aboard!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You've successfully joined {invitation?.organization?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Redirecting to dashboard...
            </Typography>
          </Card>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <Container maxWidth="sm">
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <XCircle size={64} color="#dc3545" style={{ margin: '0 auto 20px' }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#111' }}>
              Invitation Error
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/dashboard')}
              sx={{ 
                backgroundColor: '#1dbf73',
                '&:hover': { backgroundColor: '#17a05d' }
              }}
            >
              Go to Dashboard
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Card sx={{ overflow: 'hidden' }}>
          <Box sx={{ 
            backgroundColor: '#1dbf73', 
            color: 'white', 
            p: 3, 
            textAlign: 'center' 
          }}>
            <Building2 size={48} style={{ margin: '0 auto 10px' }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              You're Invited!
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You've been invited to join:
            </Typography>
            
            <Box sx={{ 
              backgroundColor: '#f9f9f9', 
              p: 3, 
              borderRadius: 2, 
              mb: 3 
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#111', mb: 1 }}>
                {invitation?.organization?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Role: <strong>{invitation?.role?.toUpperCase()}</strong>
              </Typography>
              {invitation?.invited_by && (
                <Typography variant="body2" color="text.secondary">
                  Invited by: <strong>{invitation.invited_by}</strong>
                </Typography>
              )}
            </Box>

            {!isAuthenticated && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  You need an account to accept this invitation.
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Already have an account? Click "Sign In" below.
                  <br />
                  Don't have an account? Click "Create Account" to register.
                </Typography>
              </Alert>
            )}

            {isAuthenticated && user?.email !== invitation?.email && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                This invitation is for {invitation?.email}. Please log in with that email address.
              </Alert>
            )}

            {!isAuthenticated ? (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={acceptInvitation}
                  sx={{
                    backgroundColor: '#1dbf73',
                    px: 4,
                    '&:hover': { backgroundColor: '#17a05d' }
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRegister}
                  sx={{
                    borderColor: '#1dbf73',
                    color: '#1dbf73',
                    px: 4,
                    '&:hover': { 
                      borderColor: '#17a05d',
                      backgroundColor: 'rgba(29, 191, 115, 0.04)'
                    }
                  }}
                >
                  Create Account
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={acceptInvitation}
                  disabled={accepting || (isAuthenticated && user?.email !== invitation?.email)}
                  sx={{
                    backgroundColor: '#1dbf73',
                    px: 4,
                    '&:hover': { backgroundColor: '#17a05d' }
                  }}
                >
                  {accepting ? <CircularProgress size={24} color="inherit" /> : 'Accept Invitation'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={declineInvitation}
                  disabled={accepting}
                  sx={{
                    borderColor: '#ddd',
                    color: '#666',
                    px: 4
                  }}
                >
                  Decline
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AcceptInvitation;
