import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onTemplateSelect }) => {
  const templates = [
    {
      id: 'social',
      name: 'Social Media Post',
      description: 'Perfect for Instagram, Facebook, Twitter posts',
      icon: 'Share2',
      settings: {
        expirationDays: 30,
        geoTargeting: '',
        password: false
      }
    },
    {
      id: 'promotion',
      name: 'Promotional Campaign',
      description: 'For marketing campaigns and promotions',
      icon: 'Megaphone',
      settings: {
        expirationDays: 7,
        geoTargeting: 'IN',
        password: false
      }
    },
    {
      id: 'private',
      name: 'Private Share',
      description: 'Password protected for private sharing',
      icon: 'Lock',
      settings: {
        expirationDays: 14,
        geoTargeting: '',
        password: true
      }
    }
  ];

  const recentLinks = [
    {
      id: 1,
      shortCode: 'summer-sale',
      originalUrl: 'https://example.com/summer-sale-2024',
      clicks: 1247,
      earnings: 156.75
    },
    {
      id: 2,
      shortCode: 'new-product',
      originalUrl: 'https://example.com/new-product-launch',
      clicks: 892,
      earnings: 112.30
    },
    {
      id: 3,
      shortCode: 'blog-post',
      originalUrl: 'https://example.com/blog/how-to-earn-money',
      clicks: 634,
      earnings: 79.25
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Templates */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onTemplateSelect(template)}
              className="p-4 bg-surface rounded-lg border border-border hover:border-primary hover:bg-primary-50 transition-all duration-fast text-left group"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <Icon name={template.icon} size={20} color="var(--color-primary)" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-text-primary mb-1">{template.name}</h4>
                  <p className="text-xs text-text-secondary">{template.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Successful Links */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Recent Successful Links</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="ExternalLink"
            iconPosition="right"
            onClick={() => window.location.href = '/link-management'}
            className="text-primary"
          >
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {recentLinks.map((link) => (
            <div
              key={link.id}
              className="p-4 bg-surface rounded-lg border border-border hover:border-primary-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-primary">lnk.pro/{link.shortCode}</p>
                    <Button
                      variant="ghost"
                      size="2xs"
                      iconName="Copy"
                      iconSize={12}
                      onClick={() => navigator.clipboard.writeText(`https://lnk.pro/${link.shortCode}`)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <p className="text-xs text-text-secondary truncate">{link.originalUrl}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-text-primary">{link.clicks} clicks</div>
                  <div className="text-xs text-accent font-medium">₹{link.earnings.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Lightbulb" size={16} color="var(--color-primary)" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-primary mb-2">Pro Tips for Better Earnings</h4>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• Use descriptive custom aliases for better click-through rates</li>
              <li>• Share links during peak hours (7-9 PM) for maximum engagement</li>
              <li>• Add compelling descriptions when sharing on social media</li>
              <li>• Monitor analytics to understand your audience better</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;