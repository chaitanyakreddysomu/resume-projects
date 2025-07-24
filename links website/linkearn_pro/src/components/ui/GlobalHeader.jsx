import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const GlobalHeader = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Get user info from localStorage
  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem('user'));
  } catch {}
  const currentUser = storedUser ? {
    name: storedUser.name || 'Unnamed User',
    email: storedUser.email || 'Email not available',
    avatar: '/assets/images/avatar.jpg',
    role: storedUser.role === 'admin' ? 'Admin' : 'Creator',
  } : {
    name: 'Loading...',
    email: '',
    avatar: '/assets/images/avatar.jpg',
    role: isAdminRoute ? 'Admin' : 'Creator',
  };

  const handleProfileMenuToggle = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/user-login');
  };

  const handleSwitchContext = () => {
    if (currentUser.role === 'Admin') {
      navigate('/user-dashboard');
    } else {
      navigate('/admin-dashboard');
    }
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-header bg-surface/95 backdrop-blur-nav border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Icon name="Link" size={20} color="white" />
          </div>
          <div className="block">
            <h1 className="text-lg sm:text-xl font-bold text-primary p-0 -ml-7 font-heading">LinkEarn Pro</h1>
          </div>
        </div>

        {/* Context Label */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="px-3 py-1 bg-primary-50 text-primary text-sm font-medium rounded-full">
            Welcome {currentUser.name}!
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Profile */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleProfileMenuToggle}
              className="flex items-center space-x-2 px-2"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="var(--color-primary)" />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-sm font-medium text-text-primary">
                  {currentUser.name !== 'Loading...' ? currentUser.name : null}
                </div>
                <div className="text-xs text-text-secondary">
                </div>
              </div>
              <Icon name="ChevronDown" size={16} className="hidden lg:block" />
            </Button>

            {/* Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-surface rounded-lg shadow-lg border border-border z-50">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">{currentUser.name}</div>
                      <div className="text-sm text-text-secondary truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[12rem]">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-primary-50 rounded-md transition-colors"
                  >
                    <Icon name="Settings" size={16} />
                    <span className="text-sm">Profile Settings</span>
                  </button>

                  <button
                    onClick={() => navigate('/help')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-primary-50 rounded-md transition-colors"
                  >
                    <Icon name="HelpCircle" size={16} />
                    <span className="text-sm">Help & Support</span>
                  </button>

                  <div className="border-t border-border my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-error-50 text-error rounded-md transition-colors"
                  >
                    <Icon name="LogOut" size={16} />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
