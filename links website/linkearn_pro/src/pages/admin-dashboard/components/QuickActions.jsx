import React from 'react';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: 'Users',
      color: 'primary',
      onClick: () => navigate('/admin-user-management')
    },
    {
      id: 'payment-processing',
      title: 'Payment Processing',
      description: 'Process withdrawals and payments',
      icon: 'CreditCard',
      color: 'success',
      onClick: () => navigate('/admin-payment-processing')
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: 'Settings',
      color: 'secondary',
      onClick: () => navigate('/admin-settings')
    },
    {
      id: 'reports',
      title: 'Generate Reports',
      description: 'Export analytics and reports',
      icon: 'FileText',
      color: 'warning',
      onClick: () => navigate('/admin-reports')
    },
    {
      id: 'monitoring',
      title: 'System Monitoring',
      description: 'Monitor platform performance',
      icon: 'Activity',
      color: 'info',
      onClick: () => navigate('/admin-monitoring')
    },
    {
      id: 'support',
      title: 'Support Center',
      description: 'Manage user support tickets',
      icon: 'HelpCircle',
      color: 'outline',
      onClick: () => navigate('/admin-support')
    }
  ];

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <div 
            key={action.id}
            className="p-4 border border-border rounded-lg hover:shadow-md transition-all cursor-pointer group"
            onClick={action.onClick}
          >
            <div className="flex items-start space-x-3">
              <Button
                variant={action.color}
                size="sm"
                iconName={action.icon}
                iconSize={20}
                className="flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                  {action.title}
                </h4>
                <p className="text-xs text-text-secondary mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;