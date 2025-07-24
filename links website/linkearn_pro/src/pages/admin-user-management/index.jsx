import React, { useState, useEffect, useRef } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import AdminSidebar from '../../components/ui/AdminSidebar';
import UserTable from './components/UserTable';
import UserFilters from './components/UserFilters';
import UserDetailsModal from './components/UserDetailsModal';
import UserAnalytics from './components/UserAnalytics';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import API_BASE_URL from 'utils/config';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    searchQuery: '',
    dateRange: { start: '', end: '' },
    status: 'all',
    earningsMin: '',
    earningsMax: '',
    activityLevel: 'all',
    referralStatus: 'all' // Added missing referralStatus filter
  });

  // Ref for the export anchor to trigger download
  const exportAnchorRef = useRef(null);

  // Helper function to get token from cookies
  const getTokenFromCookies = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'token') {
        return value;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Try to get token from cookies first, then localStorage as fallback
        let token = getTokenFromCookies();
        if (!token) {
          const storedUser = localStorage.getItem('user');
          token = storedUser ? JSON.parse(storedUser).token : null;
        }
        
        if (!token) throw new Error('User not authenticated');

        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch users: ${res.status} ${errorText}`);
        }
        
        const data = await res.json();
        console.log('Fetched users data:', data);

        // Check if data is an array and has length
        if (!Array.isArray(data) || data.length === 0) {
          console.log('No users data received or empty array');
          setUsers([]);
          setFilteredUsers([]);
          return;
        }

        const mapped = data.map(user => ({
          id: user.id,
          name: user.name || 'N/A',
          email: user.email || 'N/A',
          registrationDate: user.createdat || 'N/A',
          totalEarnings: parseFloat(user.totalEarnings ?? '0'),
          totalEarned: parseFloat(user.totalEarned ?? '0'),
          availableForWithdraw: parseFloat(user.availableForWithdraw ?? '0'), // ✅ NEW
          monthlyEarnings: parseFloat(user.monthlyEarnings ?? '0'),
          phoneNumber: user.phone || 'N/A',
          role: user.role || 'user',
          verified: user.verified || false,
          totalLinks: user.totalLinks || 0,
          totalClicks: user.totalClicks || 0,
          withdrawHistory: user.withdrawHistory || [],
          suspend: user.suspend || false,
          status: user.status || 'active',
          verificationStatus: user.verified ? 'verified' : 'pending',
          accountType: user.role || 'user',
          activeLinks: user.activeLinks ?? user.totalLinks ?? 0,
          referredBy: user.referredBy || null,
          referredUsers: user.referredUsers || []
        }));
        
        

        console.log('Mapped users:', mapped);
        setUsers(mapped);
        setFilteredUsers(mapped);
      } catch (err) {
        console.error('Fetch error:', err);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch =
        user?.name?.toLowerCase()?.includes(filters.searchQuery.toLowerCase()) ||
        user?.email?.toLowerCase()?.includes(filters.searchQuery.toLowerCase());

      const matchesStatus = filters.status === 'all' || user.status === filters.status;

      const matchesEarnings =
        (!filters.earningsMin || user.totalEarnings >= parseFloat(filters.earningsMin || 0)) &&
        (!filters.earningsMax || user.totalEarnings <= parseFloat(filters.earningsMax || Infinity));

      const matchesActivity =
        filters.activityLevel === 'all' ||
        (filters.activityLevel === 'high' && user.activeLinks > 15) ||
        (filters.activityLevel === 'medium' && user.activeLinks >= 5 && user.activeLinks <= 15) ||
        (filters.activityLevel === 'low' && user.activeLinks < 5);

      const matchesReferral =
        filters.referralStatus === 'all' ||
        (filters.referralStatus === 'referred' && user.referredBy) ||
        (filters.referralStatus === 'not_referred' && !user.referredBy);

      return matchesSearch && matchesStatus && matchesEarnings && matchesActivity && matchesReferral;
    });

    console.log('Filtered users:', filtered);
    setFilteredUsers(filtered);
  }, [filters, users]);

  const handleFilterChange = (newFilters) => {
    console.log('Filter change:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleUserSelect = (userId, isSelected) => {
    console.log('User selection:', userId, isSelected);
    if (isSelected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (isSelected) => {
    console.log('Select all:', isSelected);
    if (isSelected) {
      setSelectedUsers(filteredUsers?.map(user => user?.id) || []);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUserAction = async (action, userId) => {
    console.log('User action:', action, userId);
    const user = users.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'view': {
        try {
          // Fetch detailed user information including referrer data
          let token = getTokenFromCookies();
          if (!token) {
            const storedUser = localStorage.getItem('user');
            token = storedUser ? JSON.parse(storedUser).token : null;
          }
          
          if (!token) {
            console.error('No token available');
            return;
          }

          const response = await fetch(`${API_BASE_URL}/api/admin/user/${userId}`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const userDetails = await response.json();
            // Transform the data to match the modal's expected format
            const detailedUser = {
              ...user,
              id: userDetails.profile.id,
              name: userDetails.profile.name,
              email: userDetails.profile.email,
              phoneNumber: userDetails.profile.phone,
              registrationDate: userDetails.profile.registered,
              accountType: user.role || 'user',
              verificationStatus: userDetails.profile.verified ? 'verified' : 'pending',
              totalEarnings: userDetails.totalEarnings,
              totalLinks: userDetails.links?.length || 0,
              totalClicks: userDetails.links?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0,
              withdrawHistory: userDetails.withdrawals || [],
              referredBy: userDetails.profile.referredBy,
              referrer: userDetails.profile.referrer,
              referredUsers: userDetails.referredUsers || []
            };
            setSelectedUser(detailedUser);
            setIsModalOpen(true);
          } else {
            console.error('Failed to fetch user details');
            // Fallback to basic user data
            setSelectedUser(user);
            setIsModalOpen(true);
          }
        } catch (err) {
          console.error('Error fetching user details:', err);
          // Fallback to basic user data
          setSelectedUser(user);
          setIsModalOpen(true);
        }
        break;
      }
      case 'suspend': {
        try {
          let token = getTokenFromCookies();
          if (!token) {
            const storedUser = localStorage.getItem('user');
            token = storedUser ? JSON.parse(storedUser).token : null;
          }
          
          await fetch(`${API_BASE_URL}/api/admin/user/${userId}/suspend`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ suspend: true, status: 'suspended' })
          });
          setUsers(prev =>
            prev.map(u => (u.id === userId ? { ...u, status: 'suspended', suspend: true } : u))
          );
        } catch (err) {
          console.error('Suspend error:', err);
        }
        break;
      }
      case 'activate': {
        try {
          let token = getTokenFromCookies();
          if (!token) {
            const storedUser = localStorage.getItem('user');
            token = storedUser ? JSON.parse(storedUser).token : null;
          }
          
          await fetch(`${API_BASE_URL}/api/admin/user/${userId}/activate`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ suspend: false, status: 'active' })
          });
          setUsers(prev =>
            prev.map(u => (u.id === userId ? { ...u, status: 'active', suspend: false } : u))
          );
        } catch (err) {
          console.error('Activate error:', err);
        }
        break;
      }
      case 'verify':
        setUsers(prev =>
          prev.map(u =>
            u.id === userId ? { ...u, verificationStatus: 'verified' } : u
          )
        );
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    console.log('Bulk action:', action);
    setUsers(prev =>
      prev.map(u => {
        if (!selectedUsers.includes(u.id)) return u;
        switch (action) {
          case 'suspend':
            return { ...u, status: 'suspended' };
          case 'activate':
            return { ...u, status: 'active' };
          case 'verify':
            return { ...u, verificationStatus: 'verified' };
          default:
            return u;
        }
      })
    );
    setSelectedUsers([]);
  };

  // Helper to escape CSV values
  function escapeCSV(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  // Make export button work for all filtered users (not just selected)
  const exportUserData = () => {
    console.log('Exporting user data');
    // Use filteredUsers for export
    const csvHeader = [
      'ID',
      'Name',
      'Email',
      'Registration Date',
      'Referred By',
      'Total Earnings',
      'Active Links',
      'Total Clicks',
      'Phone Number',
      'Role',
      'Verified',
      'Status',
      'Verification Status',
      'Account Type'
    ];

    const csvRows = filteredUsers.map(user => [
      user.id,
      user.name,
      user.email,
      user.registrationDate,
      user.referredBy ? 'Yes' : 'No',
      user.totalEarnings,
      user.activeLinks ?? user.totalLinks ?? '',
      user.totalClicks ?? '',
      user.phoneNumber ?? '',
      user.role ?? '',
      user.verified ? 'Yes' : 'No',
      user.status ?? '',
      user.verificationStatus ?? '',
      user.accountType ?? ''
    ].map(escapeCSV));

    const csvContent = [csvHeader, ...csvRows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    // Use a hidden anchor to trigger download
    if (exportAnchorRef.current) {
      exportAnchorRef.current.href = url;
      exportAnchorRef.current.download = 'users_export.csv';
      exportAnchorRef.current.click();
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } else {
      // fallback
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users_export.csv';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <AdminSidebar />

      <main className="lg:ml-64 pt-16">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
              <p className="text-text-secondary">
                Comprehensive oversight and control of platform users
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={exportUserData}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                type="button"
              >
                Export Data
              </button>
              {/* Hidden anchor for download */}
              <a ref={exportAnchorRef} style={{ display: 'none' }} />
            </div>
          </div>

          {/* Analytics Overview */}
          <UserAnalytics users={users} />

          {/* Filters */}
          <UserFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            totalUsers={filteredUsers?.length || 0}
          />

          {/* Bulk Actions */}
          {selectedUsers?.length > 0 && (
            <BulkActionsToolbar
              selectedCount={selectedUsers?.length}
              onBulkAction={handleBulkAction}
            />
          )}

          {/* User Table */}
          <UserTable
            users={filteredUsers}
            selectedUsers={selectedUsers}
            onUserSelect={handleUserSelect}
            onSelectAll={handleSelectAll}
            onUserAction={handleUserAction}
            isLoading={isLoading}
          />

          {/* User Details Modal */}
          {isModalOpen && selectedUser && (
            <UserDetailsModal
              user={selectedUser}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onUserAction={handleUserAction}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUserManagement;
