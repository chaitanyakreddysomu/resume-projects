import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import API_BASE_URL from 'utils/config';

const UserBottomTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [earningsBadge, setEarningsBadge] = useState(null);
  const [activeLinksCount, setActiveLinksCount] = useState(null);

  // Fetch user data (earnings and active links count)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        
        if (!token) {
          console.log('No authentication token found');
          return;
        }

        // Fetch earnings data
        const earningsResponse = await fetch(`${API_BASE_URL}/api/user/earnings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (earningsResponse.ok) {
          const earningsData = await earningsResponse.json();
          const availableBalance = earningsData.availableBalance || 0;
          
          // Format the earnings for display
          let formattedEarnings;
          if (availableBalance >= 100000) {
            formattedEarnings = `₹${(availableBalance / 100000).toFixed(1)}L`;
          } else if (availableBalance >= 1000) {
            formattedEarnings = `₹${(availableBalance / 1000).toFixed(1)}K`;
          } else {
            formattedEarnings = `₹${availableBalance.toFixed(4)}`;
          }
          
          setEarningsBadge(formattedEarnings);
        }

        // Fetch links data to count active links
        const linksResponse = await fetch(`${API_BASE_URL}/api/links`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (linksResponse.ok) {
          const linksData = await linksResponse.json();
          const activeLinks = linksData.filter(link => link.status === 'active');
          setActiveLinksCount(activeLinks.length);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/user-dashboard',
      badge: null
    },
    {
      id: 'create',
      label: 'Create',
      icon: 'Plus',
      path: '/link-creation',
      badge: null
    },
    {
      id: 'links',
      label: 'My Links',
      icon: 'Link',
      path: '/link-management',
      badge: activeLinksCount > 0 ? activeLinksCount : null
    },
    {
      id: 'earnings',
      label: 'Earnings',
      icon: 'TrendingUp',
      path: '/earnings-analytics',
      badge: earningsBadge > 0 ? earningsBadge : null
    },

  ];

  const handleTabClick = (path) => {
    navigate(path);
  };

  const isActiveTab = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-bottom-nav bg-surface/95 backdrop-blur-nav border-t border-border md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {tabs.map((tab) => {
            const isActive = isActiveTab(tab.path);
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.path)}
                className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-all duration-fast scale-touch ${
                  isActive
                    ? 'text-primary bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                }`}
              >
                <div className="relative">
                  <Icon
                    name={tab.icon}
                    size={20}
                    color={isActive ? 'var(--color-primary)' : 'currentColor'}
                  />
                  {tab.badge && (
                    <span className="absolute -top-2 -right-2 min-w-[16px] h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center px-1">
                      {typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Horizontal Navigation */}
      <nav className="hidden md:block fixed top-16 left-0 right-0 z-50 bg-surface/95 backdrop-blur-nav border-b border-border">
        <div className="flex items-center justify-center h-14 px-6">
          <div className="flex items-center space-x-1 bg-surface-secondary rounded-lg p-1">
            {tabs.map((tab) => {
              const isActive = isActiveTab(tab.path);
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-fast ${
                    isActive
                      ? 'text-primary bg-surface shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                  }`}
                >
                  <div className="relative">
                    <Icon
                      name={tab.icon}
                      size={18}
                      color={isActive ? 'var(--color-primary)' : 'currentColor'}
                    />
                    {tab.badge && (
                      <span className="absolute -top-2 -right-2 min-w-[16px] h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center px-1">
                        {typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default UserBottomTabs;