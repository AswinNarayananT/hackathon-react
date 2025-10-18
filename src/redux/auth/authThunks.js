import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { clearOrganizationData } from '../organization/organizationSlice';

// Register thunk
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Registering user:', userData);
      const response = await api.post('/users/custom-register/', userData);
      const data = response.data;
      
      // Store access token in localStorage
      if (data.access) {
        localStorage.setItem('token', data.access);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Registration failed');
    }
  }
);


// Login thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {

      const payload = {
        email: credentials.email,
        password: credentials.password,
      };
      const response = await api.post('/users/custom-login/', payload);
      console.log(response);
      const data = response.data;
      // Store access token in localStorage
      // Note: refresh token is stored as HTTP-only cookie by backend
      if (data.access) {
        localStorage.setItem('token', data.access);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Login failed');
    }
  }
);



// Logout thunk
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // Call backend to clear refresh token cookie
      await api.post('/users/custom-logout/');
      
      // Remove access token from localStorage
      localStorage.removeItem('token');
      
      // Clear organization data
      dispatch(clearOrganizationData());
      
      return null;
    } catch (error) {
      // Even if backend call fails, clear local token and organization data
      localStorage.removeItem('token');
      dispatch(clearOrganizationData());
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);
