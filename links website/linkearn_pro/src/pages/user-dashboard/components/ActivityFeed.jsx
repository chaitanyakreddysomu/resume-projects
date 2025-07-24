import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'earning',
      message: 'Earned ₹12.50 from tech-trends-2024',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      icon: 'IndianRupee',
      color: 'success'
    },
    {
      id: 2,
      type: 'click',
      message: '5 new clicks on awesome-video',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      icon: 'MousePointer',
      color: 'primary'
    },
    {
      id: 3,
      type: 'link_created',
      message: 'Created new link: my-project',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: 'Plus',
      color: 'accent'
    },
    {
      id: 4,
      type: 'milestone',
      message: 'Reached 1000 total clicks milestone!',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      icon: 'Trophy',
      color: 'warning'
    },
    {
      id: 5,
      type: 'earning',
      message: 'Earned ₹8.75 from react-guide',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      icon: 'IndianRupee',
      color: 'success'
    },
    {
      id: 6,
      type: 'click',
      message: '12 new clicks on important-doc',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      icon: 'MousePointer',
      color: 'primary'
    }
  ];

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary-50 text-primary',
      success: 'bg-success-50 text-success',
      warning: 'bg-warning-50 text-warning',
      accent: 'bg-accent-50 text-accent'
    };
    return colorMap[color] || colorMap.primary;
  };

  const getIconColor = (color) => {
    const colorMap = {
      primary: 'var(--color-primary)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      accent: 'var(--color-accent)'
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Activity" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getColorClasses(activity.color)}`}>
              <Icon name={activity.icon} size={14} color={getIconColor(activity.color)} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary">{activity.message}</p>
              <p className="text-xs text-text-secondary mt-1">{getTimeAgo(activity.timestamp)}</p>
            </div>

            {index < activities.length - 1 && (
              <div className="absolute left-7 mt-8 w-px h-6 bg-border"></div>
            )}
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Activity" size={48} color="var(--color-text-muted)" className="mx-auto mb-3" />
          <p className="text-text-secondary">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;