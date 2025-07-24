import API_URL from './config';

// API service for withdrawal operations
export const withdrawalAPI = {
  // Generic GET method
  get: async (endpoint, token) => {
    const response = await fetch(`${API_URL}/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // Get all withdrawals for admin
  getAllWithdrawals: async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/withdraw`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      throw error;
    }
  },

  // Get withdrawal statistics
  getWithdrawalStats: async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/withdraw/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching withdrawal stats:', error);
      throw error;
    }
  },

  // Complete withdrawal
  completeWithdrawal: async (withdrawalId, token) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/withdraw/${withdrawalId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error completing withdrawal:', error);
      throw error;
    }
  },

  // Reject withdrawal
  rejectWithdrawal: async (withdrawalId, reason, token) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/withdraw/${withdrawalId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      throw error;
    }
  },

  // Get withdrawal by ID
  getWithdrawalById: async (withdrawalId, token) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/withdraw/${withdrawalId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching withdrawal details:', error);
      throw error;
    }
  }
};

export default withdrawalAPI; 