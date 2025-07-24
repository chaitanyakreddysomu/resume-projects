import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TopPerformingLinks = ({ links = [], shortLinkDomain = 'linkearn.pro' }) => {
  const [sortBy, setSortBy] = useState('earnings');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const sortedLinks = [...links].sort((a, b) => {
    switch (sortBy) {
      case 'earnings':
        return (b.earnings || 0) - (a.earnings || 0);
      case 'clicks':
        return (b.clicks || 0) - (a.clicks || 0);
      case 'pages':
        return (b.pages || 0) - (a.pages || 0);
      case 'cpm':
        return (b.cpm || 0) - (a.cpm || 0);
      default:
        return (b.earnings || 0) - (a.earnings || 0);
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-blue-50 text-blue-600',
      'Finance': 'bg-green-50 text-green-600',
      'Lifestyle': 'bg-purple-50 text-purple-600',
      'Education': 'bg-orange-50 text-orange-600',
      'Photography': 'bg-pink-50 text-pink-600'
    };
    return colors[category] || 'bg-gray-50 text-gray-600';
  };

  const handleCopy = async (fullLink, idx) => {
    try {
      await navigator.clipboard.writeText(fullLink);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {}
  };

  if (!links || links.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon name="Link" size={32} color="var(--color-border)" className="mx-auto mb-4" />
          <p className="text-text-secondary">No links found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Top Performing Links</h2>
          <p className="text-sm text-text-secondary">Your highest earning links this month</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 bg-surface border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="earnings">Earnings</option>
            <option value="clicks">Clicks</option>
            <option value="pages">Pages</option>
            <option value="cpm">CPM</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {sortedLinks.map((link, index) => (
          <div key={link.id} className="bg-surface-secondary rounded-lg p-4 hover:shadow-sm transition-shadow">
            {/* <div className="flex items-start justify-between mb-3">
             */}
             <div className="flex flex-wrap sm:flex-nowrap items-start justify-between mb-3">

              <div className="flex items-start space-x-3 flex-1">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">#{index + 1}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-text-primary truncate">{link.title || link.originalurl || link.url}</h3>
                    {link.category && (
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(link.category)}`}>
                        {link.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                  {(() => {
  const fullUrl = `${shortLinkDomain.replace(/\/$/, '')}/${link.shortUrl || link.url}`;
  const displayUrl = fullUrl.length > 20 ? fullUrl.slice(0, 20) + '...' : fullUrl;

  return (
    <span
      className="text-xs text-primary font-data cursor-pointer"
      title={fullUrl}
      onClick={() => handleCopy(fullUrl, index)}
    >
      {displayUrl}
    </span>
  );
})()}

                    <Button 
                      variant="ghost" 
                      size="2xs" 
                      iconName={copiedIndex === index ? "Check" : "Copy"} 
                      iconSize={12} 
                      onClick={() => handleCopy(`${shortLinkDomain.replace(/\/$/, '')}/${link.shortUrl || link.url}`, index)}
                    />
                  </div>
                </div>
              </div>
              
              {/* <div className="text-right flex-shrink-0 ml-4"> */}
              <div className="text-right ml-auto mt-2 sm:mt-0">

                <p className="text-lg font-bold text-success">{formatCurrency(link.earnings || 0)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-xs text-text-secondary">Clicks</p>
                <p className="text-sm font-semibold text-text-primary">{formatNumber(link.clicks || 0)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-text-secondary">CPM</p>
                <p className="text-sm font-semibold text-primary">{link.cpm ? formatCurrency(link.cpm) : '-'}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-text-secondary">Pages</p>
                <p className="text-sm font-semibold text-accent">{link.pages ? link.pages : '-'}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-text-secondary">Created</p>
                <p className="text-sm font-semibold text-text-primary">
                  {link.createdAt || link.createdat ? new Date(link.createdAt || link.createdat).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '-'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Button variant="outline" iconName="ExternalLink" iconPosition="right">
          View All Links
        </Button>
      </div>
    </div>
  );
};

export default TopPerformingLinks;