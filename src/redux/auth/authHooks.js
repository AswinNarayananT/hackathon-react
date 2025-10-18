import { useSelector, useDispatch } from 'react-redux';
import { register, login, logout } from './authThunks';
import { clearError } from './authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const registerUser = (userData) => {
    return dispatch(register(userData));
  };

  const loginUser = (credentials) => {
    return dispatch(login(credentials));
  };

  const logoutUser = () => {
    return dispatch(logout());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    registerUser,
    loginUser,
    logoutUser,
    clearAuthError,
  };
};
