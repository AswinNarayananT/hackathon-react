import React from 'react';
import { useAuth } from '../redux/auth/authHooks';
import { Box, Typography, Container, AppBar, Toolbar, Button, Card, CardContent } from '@mui/material';
import { LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const { user, logoutUser } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e5e7eb',
          color: '#1f2937'
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <User size={20} />
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Welcome, {user?.first_name || user?.email}!
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogOut size={16} />}
              onClick={() => logoutUser()}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: '2px dashed #d1d5db',
            backgroundColor: 'white'
          }}
        >
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1f2937',
                  mb: 2
                }}
              >
                🎉 Welcome to your Dashboard!
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#6b7280',
                  fontWeight: 400
                }}
              >
                You are successfully logged in and ready to get started.
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 2,
              mt: 4,
              flexWrap: 'wrap'
            }}>
              <Button
                variant="contained"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3
                }}
              >
                Learn More
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Dashboard;
