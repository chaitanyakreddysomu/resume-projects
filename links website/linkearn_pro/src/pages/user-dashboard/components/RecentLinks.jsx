import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import API_BASE_URL from 'utils/config';

const RecentLinks = () => {
  const [expandedLink, setExpandedLink] = useState(null);
  const [recentLinks, setRecentLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [shortLinkDomain, setShortLinkDomain] = useState('linkearn.pro');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) return;

        // Fetch domain
        const settingsRes = await fetch(`${API_BASE_URL}/api/user/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        let domain = 'linkearn.pro';
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          domain = data.generalSettings?.shortLinkDomain || domain;
          setShortLinkDomain(domain);
        }

        // Fetch recent links
        const linksRes = await fetch(`${API_BASE_URL}/api/links`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!linksRes.ok) throw new Error(`Failed to fetch links: ${linksRes.status}`);
        const linksData = await linksRes.json();

        const today = new Date().toISOString().split('T')[0];

        const formattedLinks = linksData.slice(0, 5).map(link => {
          const createdAt = link.createdat ? new Date(link.createdat) : new Date();
          const linkCreatedAt = createdAt.toISOString().split('T')[0];

          let clicksToday;
          if (linkCreatedAt === today) {
            clicksToday = link.clicks || 0;
          } else {
            const daysSinceCreation = Math.max(
              1,
              Math.ceil((new Date() - new Date(link.createdat)) / (1000 * 60 * 60 * 24))
            );
            const avgDailyClicks = (link.clicks || 0) / daysSinceCreation;
            const variation = 0.3;
            clicksToday = Math.max(
              0,
              Math.floor(avgDailyClicks * (1 + (Math.random() - 0.5) * variation))
            );
          }

          return {
            id: link.id,
            originalUrl: link.originalurl || '',
            shortUrl: link.url?.replace(/^https?:\/\/[^/]+\//, '') || '',
            customName: link.url || 'Untitled Link',
            clicks: link.clicks || 0,
            earnings: link.earnings || 0,
            createdAt: createdAt,
            status: link.status || 'active',
            clicksToday,
          };
        });

        setRecentLinks(formattedLinks);
      } catch (error) {
        console.error('Error loading recent links:', error);
        setRecentLinks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleExpand = (linkId) => {
    setExpandedLink(expandedLink === linkId ? null : linkId);
  };

  const handleCopyLink = async (shortUrl, idx) => {
    try {
      const fullShortUrl = `${shortLinkDomain.replace(/\/$/, '')}/${shortUrl.replace(/^https?:\/\/[^/]+\//, '')}`;
      await navigator.clipboard.writeText(fullShortUrl);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const truncateUrl = (url, maxLength = 30  ) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  const truncateMainUrl = (url, maxLength = 5) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success-50';
      case 'paused':
        return 'text-warning bg-warning-50';
      case 'expired':
        return 'text-error bg-error-50';
      default:
        return 'text-text-secondary bg-surface-secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Link" size={20} color="var(--color-primary)" />
            <h3 className="text-lg font-semibold text-text-primary">Recent Links</h3>
          </div>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-text-secondary">Loading recent links...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Link" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">Recent Links</h3>
        </div>

        <Button
          variant="ghost"
          size="sm"
          iconName="ExternalLink"
          iconPosition="right"
          onClick={() => navigate('/link-management')}
          aria-label="View all links"
        >
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {recentLinks.length > 0 ? (
          recentLinks.map((link, idx) => (
            <div
              key={link.id}
              className="border border-border rounded-lg p-3 hover:bg-surface-secondary transition-colors duration-fast"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-primary font-data">
                      {/* {shortLinkDomain}/{link.shortUrl} */}
                      {shortLinkDomain}/{truncateMainUrl(link.shortUrl)}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(link.status)}`}
                    >
                      {link.status}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary mb-2" title={link.originalUrl}>
                    {truncateUrl(link.originalUrl)}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-text-secondary">
                    <div className="flex items-center space-x-1">
                      <Icon name="MousePointer" size={12} />
                      <span>{link.clicks.toLocaleString('en-IN')} clicks</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="IndianRupee" size={12} />
                      <span>{link.earnings.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={12} />
                      <span>{formatDate(link.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName={copiedIndex === idx ? 'Check' : 'Copy'}
                    onClick={() => handleCopyLink(link.shortUrl, idx)}
                    title="Copy link"
                    aria-label="Copy short link"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName={expandedLink === link.id ? 'ChevronUp' : 'ChevronDown'}
                    onClick={() => handleToggleExpand(link.id)}
                    title="Toggle details"
                    aria-label="Toggle link details"
                  />
                </div>
              </div>

              {expandedLink === link.id && (
                <div className="mt-3 pt-3 border-t border-border space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-text-secondary">Today's Clicks:</span>
                      <span className="ml-2 font-medium text-text-primary">{link.clicksToday}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">Custom Name:</span>
                      <span className="ml-2 font-medium text-text-primary">{link.customName}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="Link" size={48} color="var(--color-text-muted)" className="mx-auto mb-3" />
            <p className="text-text-secondary mb-4">No links created yet</p>
            <Button
              variant="primary"
              iconName="Plus"
              iconPosition="left"
              onClick={() => navigate('/link-creation')}
              aria-label="Create your first link"
            >
              Create Your First Link
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentLinks;
