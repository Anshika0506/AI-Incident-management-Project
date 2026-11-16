import apiClient from './client';

export const authService = {
  // 1. User Login
  login: async (credentials) => {
    // credentials: { username, password }
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify({
        username: response.data.username,
        email: response.data.email,
        role: response.data.role
      }));
    }
    return response.data;
  },

  // 2. User Registration
  register: async (userData) => {
    // userData: { username, email, password }
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // 3. Logout
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  // 4. Get Current User from localStorage
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('auth_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // 5. Check if user is authenticated
  isAuthenticated: () => {
    return Boolean(localStorage.getItem('auth_token'));
  }
};
