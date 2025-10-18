import React, { useEffect, useState } from 'react';
import { useAuth } from '../redux/auth/authHooks';
import { useOrganization } from '../redux/organization/organizationHooks';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Paper,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { 
  LogOut, 
  User, 
  Building2, 
  Users, 
  Crown, 
  Plus, 
  Settings, 
  ChevronDown,
  Mail,
  Trash2,
  Send
} from 'lucide-react';
import api from '../api';

const Team = () => {
  const { user, logoutUser } = useAuth();
  const {
    organizations,
    currentOrganization,
    members,
    currentUserRole,
    isLoading,
    isMembersLoading,
    loadOrganizations,
    loadOrganizationMembers,
    selectOrganization,
  } = useOrganization();

  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [invitations, setInvitations] = useState([{ email: '', role: 'viewer' }]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (user) {
      loadOrganizations();
    }
  }, [user, loadOrganizations]);

  useEffect(() => {
    if (currentOrganization) {
      loadOrganizationMembers(currentOrganization.id);
      loadPendingInvitations();
      
      // Check if user is admin, if not show access denied and redirect
      if (currentUserRole && currentUserRole !== 'admin') {
        setAccessDenied(true);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    }
  }, [currentOrganization, currentUserRole, loadOrganizationMembers]);

  const loadPendingInvitations = async () => {
    if (!currentOrganization) return;
    
    setLoadingInvitations(true);
    try {
      const response = await api.get(`/shorturl/organizations/${currentOrganization.id}/invitations/`);
      setPendingInvitations(response.data.filter(inv => inv.status === 'pending'));
    } catch (err) {
      console.error('Failed to load invitations:', err);
    } finally {
      setLoadingInvitations(false);
    }
  };

  const handleOrganizationChange = (event) => {
    selectOrganization(event.target.value);
  };

  const addInvitationRow = () => {
    setInvitations([...invitations, { email: '', role: 'viewer' }]);
  };

  const removeInvitationRow = (index) => {
    const newInvitations = invitations.filter((_, i) => i !== index);
    setInvitations(newInvitations.length > 0 ? newInvitations : [{ email: '', role: 'viewer' }]);
  };

  const updateInvitation = (index, field, value) => {
    const newInvitations = [...invitations];
    newInvitations[index][field] = value;
    setInvitations(newInvitations);
  };

  const handleSendInvitations = async () => {
    // Validate
    const validInvitations = invitations.filter(inv => inv.email.trim() !== '');
    
    if (validInvitations.length === 0) {
      setError('Please add at least one email address');
      return;
    }

    // Validate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validInvitations.filter(inv => !emailRegex.test(inv.email));
    
    if (invalidEmails.length > 0) {
      setError('Please enter valid email addresses');
      return;
    }

    setSending(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post(
        `/shorturl/organizations/${currentOrganization.id}/invite/`,
        { invitations: validInvitations }
      );
      
      setSuccess(response.data.message);
      setInvitations([{ email: '', role: 'viewer' }]);
      setOpenInviteDialog(false);
      
      // Reload pending invitations
      loadPendingInvitations();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.invitations?.[0] || 'Failed to send invitations');
    } finally {
      setSending(false);
    }
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

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
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
                <Button 
                  sx={{ color: '#999', textTransform: 'none', fontWeight: 500 }}
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Dashboard
                </Button>
                <Button sx={{ color: 'white', textTransform: 'none', fontWeight: 500 }}>
                  Team
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
        {accessDenied && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <strong>Access Denied:</strong> Only administrators can access the Team page. Redirecting to dashboard...
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Organization Selector */}
        <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #ddd', backgroundColor: 'white', mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Building2 size={24} color="#1dbf73" />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111' }}>
                  Select Organization
                </Typography>
              </Box>
            </Box>
            
            {organizations.length > 0 ? (
              <FormControl fullWidth variant="outlined">
                <Select
                  value={currentOrganization?.id || ''}
                  onChange={handleOrganizationChange}
                  displayEmpty
                  sx={{
                    backgroundColor: '#f9f9f9',
                    borderRadius: 1,
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
            ) : (
              <Typography color="text.secondary">
                No organizations found
              </Typography>
            )}
          </Box>
        </Paper>

        {currentOrganization && (
          <>
            {/* Team Members */}
            <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #ddd', backgroundColor: 'white', mb: 3 }}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Users size={24} color="#1dbf73" />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#111' }}>
                      Team Members
                    </Typography>
                    <Chip label={members.length} size="small" sx={{ backgroundColor: '#f0f0f0' }} />
                  </Box>
                  
                  {currentUserRole === 'admin' && (
                    <Button
                      variant="contained"
                      startIcon={<Mail size={18} />}
                      onClick={() => setOpenInviteDialog(true)}
                      sx={{
                        backgroundColor: '#1dbf73',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { backgroundColor: '#17a05d' }
                      }}
                    >
                      Invite Members
                    </Button>
                  )}
                </Box>
                
                {isMembersLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : members.length > 0 ? (
                  <Grid container spacing={2}>
                    {members.map((member) => (
                      <Grid item xs={12} sm={6} md={3} key={member.id}>
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
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
                  <Typography color="text.secondary">
                    No members found
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Pending Invitations */}
            {currentUserRole === 'admin' && (
              <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #ddd', backgroundColor: 'white' }}>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Send size={24} color="#1dbf73" />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#111' }}>
                      Pending Invitations
                    </Typography>
                    <Chip label={pendingInvitations.length} size="small" sx={{ backgroundColor: '#f0f0f0' }} />
                  </Box>
                  
                  {loadingInvitations ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : pendingInvitations.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Role</strong></TableCell>
                            <TableCell><strong>Invited By</strong></TableCell>
                            <TableCell><strong>Sent</strong></TableCell>
                            <TableCell><strong>Expires</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pendingInvitations.map((invitation) => (
                            <TableRow key={invitation.id}>
                              <TableCell>{invitation.email}</TableCell>
                              <TableCell>
                                <Chip
                                  label={invitation.role.toUpperCase()}
                                  color={getRoleBadgeColor(invitation.role)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{invitation.invited_by_email}</TableCell>
                              <TableCell>{new Date(invitation.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>{new Date(invitation.expires_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="text.secondary">
                      No pending invitations
                    </Typography>
                  )}
                </Box>
              </Paper>
            )}
          </>
        )}
      </Container>

      {/* Invite Dialog */}
      <Dialog 
        open={openInviteDialog} 
        onClose={() => {
          setOpenInviteDialog(false);
          setInvitations([{ email: '', role: 'viewer' }]);
          setError('');
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Mail size={24} color="#1dbf73" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Invite Team Members
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
            Invite multiple team members at once. They'll receive an email with a link to join your organization.
          </Alert>

          {invitations.map((invitation, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={invitation.email}
                onChange={(e) => updateInvitation(index, 'email', e.target.value)}
                placeholder="colleague@example.com"
                sx={{ flex: 2 }}
              />
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={invitation.role}
                  label="Role"
                  onChange={(e) => updateInvitation(index, 'role', e.target.value)}
                >
                  <MenuItem value="viewer">Viewer</MenuItem>
                  <MenuItem value="editor">Editor</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              {invitations.length > 1 && (
                <IconButton 
                  onClick={() => removeInvitationRow(index)}
                  color="error"
                  sx={{ mt: 1 }}
                >
                  <Trash2 size={20} />
                </IconButton>
              )}
            </Box>
          ))}

          <Button
            startIcon={<Plus size={16} />}
            onClick={addInvitationRow}
            sx={{ 
              textTransform: 'none',
              color: '#1dbf73',
              fontWeight: 600
            }}
          >
            Add Another
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setOpenInviteDialog(false);
              setInvitations([{ email: '', role: 'viewer' }]);
              setError('');
            }}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendInvitations}
            variant="contained"
            disabled={sending}
            startIcon={sending ? <CircularProgress size={16} color="inherit" /> : <Send size={16} />}
            sx={{ 
              textTransform: 'none',
              backgroundColor: '#1dbf73',
              '&:hover': { backgroundColor: '#17a05d' }
            }}
          >
            {sending ? 'Sending...' : 'Send Invitations'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Team;
