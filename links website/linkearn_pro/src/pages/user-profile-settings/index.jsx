import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import UserBottomTabs from '../../components/ui/UserBottomTabs';
import Icon from '../../components/AppIcon';
import PersonalInformation from './components/PersonalInformation';
import AccountSecurity from './components/AccountSecurity';
import PaymentSettings from './components/PaymentSettings';
import PagesSettings from './components/PagesSettings';
import API_BASE_URL from 'utils/config';

const UserProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch user info and set userRole
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUserRole(storedUser?.role || null);

    // Fetch profile (as before)
    const fetchProfile = async () => {
      try {
        const token = storedUser?.token;

        if (!token) {
          console.warn('No token found in localStorage');
          return;
        }

        console.log('Using token:', token);

        const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log('Response status:', res.status);
        console.log('Profile data:', data);

        if (!res.ok) {
          console.error('Failed to fetch profile:', data.error || res.statusText);
          return;
        }

        // Optionally set profile data here
        // setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  // Define all tabs
  const allTabs = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: 'User',
      component: PersonalInformation,
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      component: AccountSecurity,
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: 'CreditCard',
      component: PaymentSettings,
    },
    {
      id: 'pages',
      label: 'CPM Per Page',
      icon: 'FileText',
      component: PagesSettings,
    },
    
  ];

  // Filter tabs if user is admin - remove payment, preferences, privacy
  const tabs =
    userRole === 'admin'
      ? allTabs.filter(
          (tab) => !['payment', 'preferences', 'privacy'].includes(tab.id)
        )
      : allTabs;

  // Ensure activeTab is valid, reset if invalid (optional)
  useEffect(() => {
    if (!tabs.find((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0]?.id || 'personal');
    }
  }, [tabs, activeTab]);

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />

      <main className="pt-16 pb-20 md:pt-20 md:pb-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Profile Settings
            </h1>
            <p className="text-text-secondary">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-surface border border-border rounded-lg p-4 sticky top-24">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-text-secondary hover:text-text-primary hover:bg-primary-50'
                      }`}
                    >
                      <Icon
                        name={tab.icon}
                        size={18}
                        color={activeTab === tab.id ? 'white' : 'currentColor'}
                      />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="lg:hidden mb-6">
              <div className="flex overflow-x-auto space-x-1 p-1 bg-surface border border-border rounded-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-text-secondary hover:text-text-primary hover:bg-primary-50'
                    }`}
                  >
                    <Icon
                      name={tab.icon}
                      size={16}
                      color={activeTab === tab.id ? 'white' : 'currentColor'}
                    />
                    <span className="text-xs font-medium whitespace-nowrap">
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-surface border border-border rounded-lg">
                {ActiveComponent && <ActiveComponent />}
              </div>
            </div>
          </div>

          {/* Account Actions - Mobile */}
          {/* <div className="mt-6 lg:hidden">
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="font-medium text-text-primary mb-3">Account Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-primary hover:bg-primary-50 rounded-md transition-colors">
                  <Icon name="Download" size={16} />
                  <span className="text-sm">Export Account Data</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-error hover:bg-error-50 rounded-md transition-colors">
                  <Icon name="Trash2" size={16} />
                  <span className="text-sm">Delete Account</span>
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </main>

      <UserBottomTabs />
    </div>
  );
};

export default UserProfileSettings;
