import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'LayoutDashboard',
      path: '/admin-dashboard',
      badge: null,
      description: 'Platform metrics and insights'
    },
    {
      id: 'payments',
      label: 'Payment Processing',
      icon: 'CreditCard',
      path: '/admin-payment-processing',
      badge: 23, // Example: pending payment requests
      description: 'Manage withdrawals and transactions'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'Users',
      path: '/admin-user-management',
      badge: null,
      description: 'Manage platform users and accounts'
    },
    // Added Links Management
    {
      id: 'links',
      label: 'Links Management',
      icon: 'Link',
      path: '/admin-links-management',
      badge: null,
      description: 'Manage and review all platform links'
    },
    // Added Settings
    {
      id: 'settings',
      label: 'Settings',
      icon: 'Settings',
      path: '/admin-settings',
      badge: null,
      description: 'Configure CPM and platform settings'
    }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActiveItem = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <Button
        variant="ghost"
        size="sm"
        iconName="Menu"
        iconSize={20}
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-notification lg:hidden"
      />

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-sidebar lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 z-sidebar bg-surface border-r border-border transition-all duration-normal ease-out ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={16} color="white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">Admin Panel</h2>
                  <p className="text-xs text-text-secondary">Management Console</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
              iconSize={16}
              onClick={toggleSidebar}
              className="hidden lg:flex"
            />
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = isActiveItem(item.path);
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-fast group ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-primary-50'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className="relative flex-shrink-0">
                    <Icon
                      name={item.icon}
                      size={20}
                      color={isActive ? 'white' : 'currentColor'}
                    />
                    {item.badge && (
                      <span className="absolute -top-2 -right-2 min-w-[16px] h-4 bg-error text-white text-xs rounded-full flex items-center justify-center px-1">
                        {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-text-primary'}`}>
                        {item.label}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-primary-100' : 'text-text-secondary'}`}>
                        {item.description}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            {!isCollapsed && (
              <div className="bg-primary-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Info" size={16} color="var(--color-primary)" />
                  <span className="text-sm font-medium text-primary">System Status</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">Active Users</span>
                    <span className="text-text-primary font-medium">1,247</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">Server Load</span>
                    <span className="text-success font-medium">Normal</span>
                  </div>
                </div>
              </div>
            )}
            
            {isCollapsed && (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Icon name="Activity" size={16} color="var(--color-primary)" />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;