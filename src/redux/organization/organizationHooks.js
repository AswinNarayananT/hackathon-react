import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchOrganizations,
  fetchOrganizationDetails,
  fetchOrganizationMembers,
  createOrganization,
  fetchOrganizationNamespaces,
} from './organizationThunks';
import {
  setCurrentOrganization,
  clearCurrentOrganization,
  clearError,
  clearOrganizationData,
} from './organizationSlice';

export const useOrganization = () => {
  const dispatch = useDispatch();
  
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
    membersError,
    namespacesError,
  } = useSelector((state) => state.organization);

  // Fetch all organizations
  const loadOrganizations = useCallback(() => {
    return dispatch(fetchOrganizations());
  }, [dispatch]);

  // Fetch organization details
  const loadOrganizationDetails = useCallback((organizationId) => {
    return dispatch(fetchOrganizationDetails(organizationId));
  }, [dispatch]);

  // Fetch organization members
  const loadOrganizationMembers = useCallback((organizationId) => {
    return dispatch(fetchOrganizationMembers(organizationId));
  }, [dispatch]);

  // Create new organization
  const createNewOrganization = useCallback((organizationData) => {
    return dispatch(createOrganization(organizationData));
  }, [dispatch]);

  // Fetch organization namespaces
  const loadOrganizationNamespaces = useCallback((organizationId) => {
    return dispatch(fetchOrganizationNamespaces(organizationId));
  }, [dispatch]);

  // Set current organization
  const selectOrganization = useCallback((organizationId) => {
    dispatch(setCurrentOrganization(organizationId));
  }, [dispatch]);

  // Clear current organization
  const deselectOrganization = useCallback(() => {
    dispatch(clearCurrentOrganization());
  }, [dispatch]);

  // Clear errors
  const clearOrganizationError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear all organization data
  const clearAllOrganizationData = useCallback(() => {
    dispatch(clearOrganizationData());
  }, [dispatch]);

  return {
    // State
    organizations,
    currentOrganization,
    members,
    currentUserRole,
    namespaces,
    isLoading,
    isMembersLoading,
    isNamespacesLoading,
    error,
    membersError,
    namespacesError,
    
    // Actions
    loadOrganizations,
    loadOrganizationDetails,
    loadOrganizationMembers,
    createNewOrganization,
    loadOrganizationNamespaces,
    selectOrganization,
    deselectOrganization,
    clearOrganizationError,
    clearAllOrganizationData,
  };
};
