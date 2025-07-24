import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import AdminSidebar from '../../components/ui/AdminSidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import API_BASE_URL from 'utils/config';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    cpmSettings: [],
    generalSettings: {
      shortLinkDomain: 'linkearn.pro',
      referralPercentage: 5,
      withdrawalMinimum: 100,
      withdrawalMaximum: 10000
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('cpm');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    checkUserRole();
    fetchSettings();
  }, []);

  const checkUserRole = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('Stored user data:', user);
        
        // Check if role is in the user object or if we need to decode JWT
        let role = user.role;
        
        if (!role && user.token) {
          // Try to decode JWT to get role
          try {
            const payload = JSON.parse(atob(user.token.split('.')[1]));
            role = payload.role;
            console.log('Role from JWT:', role);
          } catch (jwtError) {
            console.error('Error decoding JWT:', jwtError);
          }
        }
        
        setUserRole(role);
        
        // Redirect if not admin
        if (role !== 'admin') {
          console.log('User is not admin, redirecting...');
          window.location.href = '/dashboard';
          return;
        }
      } else {
        console.log('No user data found, redirecting to login...');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      window.location.href = '/login';
    }
  };

  const fetchSettings = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      
      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated' });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage({ 
          type: 'error', 
          text: errorData.error || `Failed to fetch settings (${response.status})` 
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ 
        type: 'error', 
        text: error.message === 'Failed to fetch' 
          ? 'Network error: Unable to connect to server' 
          : 'Error fetching settings' 
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCpmSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;

      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated' });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/settings/cpm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cpmSettings: settings.cpmSettings
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'CPM settings updated successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage({ 
          type: 'error', 
          text: errorData.error || `Failed to update CPM settings (${response.status})` 
        });
      }
    } catch (error) {
      console.error('Error updating CPM settings:', error);
      setMessage({ 
        type: 'error', 
        text: error.message === 'Failed to fetch' 
          ? 'Network error: Unable to connect to server' 
          : 'Error updating CPM settings' 
      });
    } finally {
      setSaving(false);
    }
  };

  const updateGeneralSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;

      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated' });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/settings/general`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings.generalSettings)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'General settings updated successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage({ 
          type: 'error', 
          text: errorData.error || `Failed to update general settings (${response.status})` 
        });
      }
    } catch (error) {
      console.error('Error updating general settings:', error);
      setMessage({ 
        type: 'error', 
        text: error.message === 'Failed to fetch' 
          ? 'Network error: Unable to connect to server' 
          : 'Error updating general settings' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCpmChange = (index, field, value) => {
    const updatedCpmSettings = [...settings.cpmSettings];
    updatedCpmSettings[index] = {
      ...updatedCpmSettings[index],
      [field]: field === 'cpm' ? parseFloat(value) || 0 : parseInt(value) || 0
    };
    setSettings(prev => ({ ...prev, cpmSettings: updatedCpmSettings }));
  };

  const handleGeneralSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      generalSettings: {
        ...prev.generalSettings,
        [field]: field === 'referralPercentage' || field === 'withdrawalMinimum' || field === 'withdrawalMaximum' 
          ? parseFloat(value) || 0 
          : value
      }
    }));
  };

  // Show loading if role is not yet determined
  if (!userRole) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <AdminSidebar />
        <main className="lg:ml-64 pt-16">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-text-secondary">Checking permissions...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <AdminSidebar />
        <main className="lg:ml-64 pt-16">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-text-secondary">Loading settings...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <AdminSidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">Admin Settings</h1>
            <p className="text-text-secondary mt-1">Manage platform configuration and CPM settings</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-success-50 border-success text-success' 
                : 'bg-error-50 border-error text-error'
            }`}>
              {message.text}
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-1 bg-surface-secondary rounded-lg p-1">
            <button
              onClick={() => setActiveTab('cpm')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'cpm'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              CPM Settings
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'general'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              General Settings
            </button>
          </div>

          {/* CPM Settings Tab */}
          {activeTab === 'cpm' && (
            <div className="bg-surface rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">CPM Settings</h2>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={updateCpmSettings}
                  loading={saving}
                  iconName="Save"
                >
                  Save CPM Settings
                </Button>
              </div>

              <div className="space-y-4">
                {settings.cpmSettings.map((setting, index) => (
                  <div key={setting.id || index} className="flex items-center space-x-4 p-4 bg-surface-secondary rounded-lg">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        {setting.description || `${setting.pages} page${setting.pages > 1 ? 's' : ''}`}
                      </label>
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <label className="block text-xs text-text-secondary mb-1">CPM (₹)</label>
                          <input
                            type="number"
                            value={setting.cpm}
                            onChange={(e) => handleCpmChange(index, 'cpm', e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-xs text-text-secondary mb-1">Multiplier</label>
                          <input
                            type="number"
                            value={setting.multiplier || 2}
                            onChange={(e) => handleCpmChange(index, 'multiplier', e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            min="0"
                            step="0.1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-text-secondary">Pages</div>
                      <div className="text-lg font-semibold text-primary">{setting.pages}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <h3 className="font-medium text-primary mb-2">How CPM Works</h3>
                <p className="text-sm text-text-secondary">
                  CPM (Cost Per Mille) determines how much users earn per 1000 clicks. 
                  The formula is: <strong>Earnings per click = CPM ÷ 1000</strong>
                </p>
              </div>
            </div>
          )}

          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="bg-surface rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">General Settings</h2>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={updateGeneralSettings}
                  loading={saving}
                  iconName="Save"
                >
                  Save General Settings
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Short Link Domain */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Short Link Domain
                  </label>
                  <input
                    type="text"
                    value={settings.generalSettings.shortLinkDomain}
                    onChange={(e) => handleGeneralSettingChange('shortLinkDomain', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="linkearn.pro"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Domain used for generating short links (e.g., linkearn.pro/abc123)
                  </p>
                </div>

                {/* Referral Percentage */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Referral Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={settings.generalSettings.referralPercentage}
                    onChange={(e) => handleGeneralSettingChange('referralPercentage', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Percentage of earnings that referrers receive from referred users
                  </p>
                </div>

                {/* Withdrawal Minimum */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Minimum Withdrawal (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.generalSettings.withdrawalMinimum}
                    onChange={(e) => handleGeneralSettingChange('withdrawalMinimum', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Minimum amount users can withdraw
                  </p>
                </div>

                {/* Withdrawal Maximum */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Maximum Withdrawal (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.generalSettings.withdrawalMaximum}
                    onChange={(e) => handleGeneralSettingChange('withdrawalMaximum', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Maximum amount users can withdraw per request
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-accent-50 rounded-lg">
                <h3 className="font-medium text-accent mb-2">Settings Impact</h3>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• <strong>Short Link Domain:</strong> Affects all generated short links</li>
                  <li>• <strong>Referral Percentage:</strong> Changes how much referrers earn from referred users</li>
                  <li>• <strong>Withdrawal Limits:</strong> Controls user withdrawal amounts</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminSettings; 