import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CriticalAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: 'withdrawal',
      title: 'Pending Withdrawals',
      message: '23 withdrawal requests awaiting approval',
      priority: 'high',
      count: 23,
      action: 'Review Now'
    },
    {
      id: 2,
      type: 'violation',
      title: 'Policy Violations',
      message: '5 users flagged for suspicious activity',
      priority: 'critical',
      count: 5,
      action: 'Investigate'
    },
    {
      id: 3,
      type: 'system',
      title: 'System Performance',
      message: 'Server response time above threshold',
      priority: 'medium',
      count: null,
      action: 'Check Status'
    },
    {
      id: 4,
      type: 'payment',
      title: 'Failed Payments',
      message: '12 payment transactions failed today',
      priority: 'high',
      count: 12,
      action: 'Retry Payments'
    }
  ];

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'critical':
        return {
          bgColor: 'bg-error-50',
          borderColor: 'border-error-200',
          iconColor: 'var(--color-error)',
          textColor: 'text-error'
        };
      case 'high':
        return {
          bgColor: 'bg-warning-50',
          borderColor: 'border-warning-200',
          iconColor: 'var(--color-warning)',
          textColor: 'text-warning'
        };
      default:
        return {
          bgColor: 'bg-primary-50',
          borderColor: 'border-primary-200',
          iconColor: 'var(--color-primary)',
          textColor: 'text-primary'
        };
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'withdrawal': return 'Download';
      case 'violation': return 'AlertTriangle';
      case 'system': return 'Server';
      case 'payment': return 'CreditCard';
      default: return 'AlertCircle';
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">Critical Alerts</h3>
        <Button variant="ghost" size="sm" iconName="Settings" iconSize={16}>
          Configure
        </Button>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {alerts.map((alert) => {
            const config = getPriorityConfig(alert.priority);
            return (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      <Icon 
                        name={getAlertIcon(alert.type)} 
                        size={20} 
                        color={config.iconColor} 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-text-primary">
                          {alert.title}
                        </h4>
                        {alert.count && (
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.textColor} ${config.bgColor}`}>
                            {alert.count}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary mt-1">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant={alert.priority === 'critical' ? 'danger' : alert.priority === 'high' ? 'warning' : 'primary'}
                    size="xs"
                  >
                    {alert.action}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" fullWidth>
            View All Alerts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlerts;