import React, { useEffect, useState } from 'react';
import { useAuth } from '../redux/auth/authHooks';
import { useOrganization } from '../redux/organization/organizationHooks';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Card, 
  CardContent,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Avatar,
  Divider,
  Paper,
} from '@mui/material';
import { LogOut, User, Building2, Users, Crown, Plus, FolderTree, Settings, ChevronDown } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const {
    organizations,
    currentOrganization,
    members,
    currentUserRole,
    namespaces,
    isLoading,
    isMembersLoading,
    isNamespacesLoading,
    error,
    loadOrganizations,
    loadOrganizationMembers,
    loadOrganizationNamespaces,
    selectOrganization,
    createNewOrganization,
  } = useOrganization();

  const [openCreateOrgDialog, setOpenCreateOrgDialog] = useState(false);
  const [openCreateNamespaceDialog, setOpenCreateNamespaceDialog] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newNamespaceName, setNewNamespaceName] = useState('');
  const [createOrgError, setCreateOrgError] = useState('');
  const [createNamespaceError, setCreateNamespaceError] = useState('');

  // Fetch organizations on mount
  useEffect(() => {
    if (user) {
      loadOrganizations();
    }
  }, [user, loadOrganizations]);

  // Fetch members and namespaces when current organization changes
  useEffect(() => {
    if (currentOrganization) {
      loadOrganizationMembers(currentOrganization.id);
      loadOrganizationNamespaces(currentOrganization.id);
    }
  }, [currentOrganization, loadOrganizationMembers, loadOrganizationNamespaces]);

  const handleOrganizationChange = (event) => {
    selectOrganization(event.target.value);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'editor':
        return 'warning';
      case 'viewer':
        return 'info';
      default:
        return 'default';
    }
  };

  const getRoleIcon = (role) => {
    if (role === 'admin') return <Crown size={14} />;
    return null;
  };

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim()) {
      setCreateOrgError('Organization name is required');
      return;
    }

    try {
      await createNewOrganization({ name: newOrgName }).unwrap();
      setOpenCreateOrgDialog(false);
      setNewOrgName('');
      setCreateOrgError('');
    } catch (err) {
      setCreateOrgError(err?.name?.[0] || 'Failed to create organization');
    }
  };

  const handleCreateNamespace = async () => {
    if (!newNamespaceName.trim()) {
      setCreateNamespaceError('Namespace name is required');
      return;
    }

    if (!currentOrganization) {
      setCreateNamespaceError('Please select an organization first');
      return;
    }

    try {
      // You'll need to add this thunk to organizationThunks.js
      // For now, we'll use the API directly
      const response = await api.post('/shorturl/namespaces/', {
        name: newNamespaceName,
        organization: currentOrganization.id
      });
      
      setOpenCreateNamespaceDialog(false);
      setNewNamespaceName('');
      setCreateNamespaceError('');
      // Reload namespaces
      loadOrganizationNamespaces(currentOrganization.id);
    } catch (err) {
      setCreateNamespaceError(err.response?.data?.name?.[0] || 'Failed to create namespace');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* GoDaddy-style Header */}
      <Box sx={{ 
        backgroundColor: '#111', 
        color: 'white',
        py: 2,
        px: 3,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1dbf73' }}>
                ShortURL
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, ml: 4 }}>
                <Button sx={{ color: 'white', textTransform: 'none', fontWeight: 500 }}>
                  Dashboard
                </Button>
                <Button sx={{ color: '#999', textTransform: 'none', fontWeight: 500 }}>
                  Analytics
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton sx={{ color: 'white' }}>
                <Settings size={20} />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#1dbf73', fontSize: '14px' }}>
                  {user?.name?.[0] || user?.email?.[0] || 'U'}
                </Avatar>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  {user?.name || user?.email}
                </Typography>
                <ChevronDown size={16} />
              </Box>
              <Button
                variant="outlined"
                startIcon={<LogOut size={16} />}
                onClick={() => logoutUser()}
                sx={{ 
                  borderColor: '#333',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { borderColor: '#555', backgroundColor: '#222' }
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {typeof error === 'object' ? JSON.stringify(error) : error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Organization Selector - GoDaddy Style */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #ddd', backgroundColor: 'white' }}>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Building2 size={24} color="#1dbf73" />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#111' }}>
                        Organizations
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<Plus size={18} />}
                      onClick={() => setOpenCreateOrgDialog(true)}
                      sx={{
                        backgroundColor: '#1dbf73',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        borderRadius: 1,
                        '&:hover': { backgroundColor: '#17a05d' }
                      }}
                    >
                      Create Organization
                    </Button>
                  </Box>
                  
                  {organizations.length > 0 ? (
                    <Box>
                      <FormControl fullWidth variant="outlined">
                        <Select
                          value={currentOrganization?.id || ''}
                          onChange={handleOrganizationChange}
                          displayEmpty
                          sx={{
                            backgroundColor: '#f9f9f9',
                            borderRadius: 1,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#ddd'
                            }
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select an organization
                          </MenuItem>
                          {organizations.map((org) => (
                            <MenuItem key={org.id} value={org.id}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                <Building2 size={18} />
                                <Typography sx={{ fontWeight: 500 }}>{org.name}</Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      {currentOrganization && currentUserRole && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center', p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                            Your role in this organization:
                          </Typography>
                          <Chip
                            label={currentUserRole.toUpperCase()}
                            color={getRoleBadgeColor(currentUserRole)}
                            size="small"
                            icon={getRoleIcon(currentUserRole)}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                      <Typography color="text.secondary">
                        No organizations found. Create your first organization to get started.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Namespaces Section - GoDaddy Style */}
            {currentOrganization && (
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #ddd', backgroundColor: 'white' }}>
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FolderTree size={24} color="#1dbf73" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Namespaces
                        </Typography>
                        <Chip label={namespaces.length} size="small" />
                      </Box>
                      
                      {currentUserRole === 'admin' && (
                        <Button
                          variant="contained"
                          startIcon={<Plus size={16} />}
                          onClick={() => setOpenCreateNamespaceDialog(true)}
                          sx={{
                            backgroundColor: '#1dbf73',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 1,
                            '&:hover': { backgroundColor: '#17a05d' }
                          }}
                        >
                          Create Namespace
                        </Button>
                      )}
                    </Box>
                    
                    {isNamespacesLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : namespaces.length > 0 ? (
                      <Grid container spacing={2}>
                        {namespaces.map((namespace) => (
                          <Grid item xs={12} sm={6} md={3} key={namespace.id}>
                            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, '&:hover': { borderColor: '#1dbf73', boxShadow: '0 2px 8px rgba(29,191,115,0.1)' } }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <FolderTree size={18} color="#1dbf73" />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#111' }}>
                                  {namespace.name}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {namespace.shorturl_count || 0} short URLs
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>
                          No namespaces yet
                        </Typography>
                        {currentUserRole === 'admin' && (
                          <Typography variant="body2" color="text.secondary">
                            Create your first namespace to start organizing short URLs
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            )}

            {/* Members List - GoDaddy Style */}
            {currentOrganization && (
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #ddd', backgroundColor: 'white' }}>
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Users size={24} color="#1dbf73" />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#111' }}>
                        Team Members
                      </Typography>
                      <Chip label={members.length} size="small" sx={{ backgroundColor: '#f0f0f0' }} />
                    </Box>
                    
                    {isMembersLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : members.length > 0 ? (
                      <Grid container spacing={2}>
                        {members.map((member) => (
                          <Grid item xs={12} sm={6} md={3} key={member.id}>
                            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, '&:hover': { borderColor: '#1dbf73', boxShadow: '0 2px 8px rgba(29,191,115,0.1)' } }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#1dbf73', fontSize: '14px' }}>
                                  {(member.user_name || member.user_email)?.[0]?.toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#111' }}>
                                    {member.user_name || member.user_email}
                                  </Typography>
                                </Box>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
                                {member.user_email}
                              </Typography>
                              <Chip
                                label={member.role.toUpperCase()}
                                color={getRoleBadgeColor(member.role)}
                                size="small"
                                icon={getRoleIcon(member.role)}
                                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                              />
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                        <Typography color="text.secondary">
                          No members found
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
      </Container>

      {/* Create Organization Dialog */}
      <Dialog 
        open={openCreateOrgDialog} 
        onClose={() => {
          setOpenCreateOrgDialog(false);
          setCreateOrgError('');
          setNewOrgName('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Organization</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Organization Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            error={!!createOrgError}
            helperText={createOrgError}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenCreateOrgDialog(false);
              setCreateOrgError('');
              setNewOrgName('');
            }}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateOrganization}
            variant="contained"
            sx={{ textTransform: 'none' }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Namespace Dialog */}
      <Dialog 
        open={openCreateNamespaceDialog} 
        onClose={() => {
          setOpenCreateNamespaceDialog(false);
          setCreateNamespaceError('');
          setNewNamespaceName('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Namespace</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            Namespace names should be URL-friendly (lowercase, no spaces)
          </Alert>
          <TextField
            autoFocus
            margin="dense"
            label="Namespace Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newNamespaceName}
            onChange={(e) => setNewNamespaceName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            error={!!createNamespaceError}
            helperText={createNamespaceError || 'Example: my-project, company-links'}
            placeholder="my-namespace"
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenCreateNamespaceDialog(false);
              setCreateNamespaceError('');
              setNewNamespaceName('');
            }}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateNamespace}
            variant="contained"
            sx={{ textTransform: 'none' }}
            disabled={!currentOrganization}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
