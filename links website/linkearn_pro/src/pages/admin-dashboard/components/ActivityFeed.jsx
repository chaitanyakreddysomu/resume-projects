import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'user_registration',
      user: 'Priya Sharma',
      action: 'New user registered',
      timestamp: '2 minutes ago',
      icon: 'UserPlus',
      color: 'success'
    },
    {
      id: 2,
      type: 'withdrawal_request',
      user: 'Rahul Kumar',
      action: 'Withdrawal request ₹2,500',
      timestamp: '5 minutes ago',
      icon: 'Download',
      color: 'warning'
    },
    {
      id: 3,
      type: 'link_creation',
      user: 'Anjali Patel',
      action: 'Created 5 new links',
      timestamp: '12 minutes ago',
      icon: 'Link',
      color: 'primary'
    },
    {
      id: 4,
      type: 'payment_processed',
      user: 'Vikash Singh',
      action: 'Payment processed ₹1,200',
      timestamp: '18 minutes ago',
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      id: 5,
      type: 'policy_violation',
      user: 'Deepak Gupta',
      action: 'Flagged for suspicious activity',
      timestamp: '25 minutes ago',
      icon: 'AlertTriangle',
      color: 'error'
    }
  ];

  const getIconColor = (color) => {
    switch (color) {
      case 'success': return 'var(--color-success)';
      case 'warning': return 'var(--color-warning)';
      case 'error': return 'var(--color-error)';
      default: return 'var(--color-primary)';
    }
  };

  const getBgColor = (color) => {
    switch (color) {
      case 'success': return 'bg-success-50';
      case 'warning': return 'bg-warning-50';
      case 'error': return 'bg-error-50';
      default: return 'bg-primary-50';
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
        <Button variant="ghost" size="sm" iconName="RefreshCw" iconSize={16}>
          Refresh
        </Button>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getBgColor(activity.color)}`}>
                <Icon 
                  name={activity.icon} 
                  size={16} 
                  color={getIconColor(activity.color)} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-text-primary">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <span className="text-xs text-text-secondary">{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" fullWidth>
            View All Activities
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;