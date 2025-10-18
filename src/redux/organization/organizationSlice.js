import { createSlice } from '@reduxjs/toolkit';
import {
  fetchOrganizations,
  fetchOrganizationDetails,
  fetchOrganizationMembers,
  createOrganization,
  fetchOrganizationNamespaces,
  fetchOrganizationShortURLs,
  createShortURL,
} from './organizationThunks';

// Initial state
const initialState = {
  // List of all organizations user is a member of
  organizations: [],
  
  // Currently selected organization
  currentOrganization: null,
  
  // Members of current organization
  members: [],
  
  // Current user's role in the current organization
  currentUserRole: null,
  
  // Namespaces of current organization
  namespaces: [],
  
  // Short URLs of current organization
  shortURLs: [],
  
  // Loading states
  isLoading: false,
  isMembersLoading: false,
  isNamespacesLoading: false,
  isShortURLsLoading: false,
  
  // Error states
  error: null,
  membersError: null,
  namespacesError: null,
  shortURLsError: null,
};

// Organization slice
const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    // Set current organization
    setCurrentOrganization: (state, action) => {
      const org = state.organizations.find(o => o.id === action.payload);
      if (org) {
        state.currentOrganization = org;
        // Find user's role in this organization from members
        const membership = state.members.find(m => m.organization === org.id);
        state.currentUserRole = membership?.role || null;
      }
    },
    
    // Clear current organization
    clearCurrentOrganization: (state) => {
      state.currentOrganization = null;
      state.currentUserRole = null;
      state.members = [];
      state.namespaces = [];
    },
    
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.membersError = null;
      state.namespacesError = null;
    },
    
    // Clear all organization data (on logout)
    clearOrganizationData: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch organizations
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations = action.payload;
        
        // If no current organization is set, set the first one as current
        if (!state.currentOrganization && action.payload.length > 0) {
          state.currentOrganization = action.payload[0];
        }
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch organization details
      .addCase(fetchOrganizationDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrganization = action.payload;
        
        // Update in organizations list if exists
        const index = state.organizations.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.organizations[index] = action.payload;
        }
      })
      .addCase(fetchOrganizationDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch organization members
      .addCase(fetchOrganizationMembers.pending, (state) => {
        state.isMembersLoading = true;
        state.membersError = null;
      })
      .addCase(fetchOrganizationMembers.fulfilled, (state, action) => {
        state.isMembersLoading = false;
        state.members = action.payload;
        
        // Update current user's role if current organization matches
        if (state.currentOrganization) {
          const userMembership = action.payload.find(
            m => m.organization === state.currentOrganization.id
          );
          if (userMembership) {
            state.currentUserRole = userMembership.role;
          }
        }
      })
      .addCase(fetchOrganizationMembers.rejected, (state, action) => {
        state.isMembersLoading = false;
        state.membersError = action.payload;
      })
      
      // Create organization
      .addCase(createOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations.push(action.payload);
        // Set newly created organization as current
        state.currentOrganization = action.payload;
        state.currentUserRole = 'admin'; // Creator is always admin
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch organization namespaces
      .addCase(fetchOrganizationNamespaces.pending, (state) => {
        state.isNamespacesLoading = true;
        state.namespacesError = null;
      })
      .addCase(fetchOrganizationNamespaces.fulfilled, (state, action) => {
        state.isNamespacesLoading = false;
        state.namespaces = action.payload;
      })
      .addCase(fetchOrganizationNamespaces.rejected, (state, action) => {
        state.isNamespacesLoading = false;
        state.namespacesError = action.payload;
      })
      
      // Fetch organization short URLs
      .addCase(fetchOrganizationShortURLs.pending, (state) => {
        state.isShortURLsLoading = true;
        state.shortURLsError = null;
      })
      .addCase(fetchOrganizationShortURLs.fulfilled, (state, action) => {
        state.isShortURLsLoading = false;
        state.shortURLs = action.payload;
      })
      .addCase(fetchOrganizationShortURLs.rejected, (state, action) => {
        state.isShortURLsLoading = false;
        state.shortURLsError = action.payload;
      })
      
      // Create short URL
      .addCase(createShortURL.pending, (state) => {
        state.isShortURLsLoading = true;
        state.shortURLsError = null;
      })
      .addCase(createShortURL.fulfilled, (state, action) => {
        state.isShortURLsLoading = false;
        state.shortURLs.unshift(action.payload); // Add to beginning of list
      })
      .addCase(createShortURL.rejected, (state, action) => {
        state.isShortURLsLoading = false;
        state.shortURLsError = action.payload;
      });
  },
});

export const {
  setCurrentOrganization,
  clearCurrentOrganization,
  clearError,
  clearOrganizationData,
} = organizationSlice.actions;

export default organizationSlice.reducer;
