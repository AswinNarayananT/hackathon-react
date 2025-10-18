import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

// Fetch all organizations where user is a member
export const fetchOrganizations = createAsyncThunk(
  'organization/fetchOrganizations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/shorturl/organizations/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to fetch organizations');
    }
  }
);

// Fetch organization details
export const fetchOrganizationDetails = createAsyncThunk(
  'organization/fetchOrganizationDetails',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shorturl/organizations/${organizationId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to fetch organization details');
    }
  }
);

// Fetch organization members
export const fetchOrganizationMembers = createAsyncThunk(
  'organization/fetchOrganizationMembers',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shorturl/organizations/${organizationId}/members/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to fetch members');
    }
  }
);

// Create new organization
export const createOrganization = createAsyncThunk(
  'organization/createOrganization',
  async (organizationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/shorturl/organizations/', organizationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to create organization');
    }
  }
);

// Fetch organization namespaces
export const fetchOrganizationNamespaces = createAsyncThunk(
  'organization/fetchOrganizationNamespaces',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shorturl/organizations/${organizationId}/namespaces/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to fetch namespaces');
    }
  }
);

// Fetch organization short URLs
export const fetchOrganizationShortURLs = createAsyncThunk(
  'organization/fetchOrganizationShortURLs',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shorturl/organizations/${organizationId}/shorturls/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to fetch short URLs');
    }
  }
);

// Create short URL
export const createShortURL = createAsyncThunk(
  'organization/createShortURL',
  async (shortURLData, { rejectWithValue }) => {
    try {
      const response = await api.post('/shorturl/shorturls/', shortURLData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to create short URL');
    }
  }
);
