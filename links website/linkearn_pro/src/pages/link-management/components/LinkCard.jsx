import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import config from '../../../utils/config';
import ShareModal from './ShareModal';

const LinkCard = ({ link, onEdit, onDelete, onCopy, onShare, onViewStats, onToggleStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowActions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatEarnings = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 4,
    }).format(amount);
  };

  const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const shortUrl = `${link.shortUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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

  const getExpiryText = () => {
    if (!link.expiryDate) {
      return { text: 'Never expires', color: 'text-success' };
    }
    
    const expiryDate = new Date(link.expiryDate);
    const now = new Date();
    
    if (expiryDate < now) {
      return { text: `Expired on ${formatDate(link.expiryDate)}`, color: 'text-error' };
    } else {
      return { text: `Expires on ${formatDate(link.expiryDate)}`, color: 'text-warning' };
    }
  };

  const expiryInfo = getExpiryText();

  return (
    <>
      <div className="relative bg-surface rounded-lg border border-border shadow-sm">
        {/* Main Card Content */}
        <div className="p-4">
          <div className="flex flex-wrap sm:flex-nowrap items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm font-medium text-text-primary truncate">
                  {link.customName || 'Untitled Link'}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    link.status
                  )}`}
                >
                  {link.status}
                </span>
              </div>
              <p className="text-xs text-primary font-data mb-1 break-words">{shortUrl}</p>
              <p className="text-xs text-text-secondary break-words">{truncateUrl(link.originalUrl)}</p>
              
              {/* Expiry Date */}
              {/* <div className="mt-2">
                <p className={`text-xs font-medium ${expiryInfo.color}`}>
                  <Icon name="Clock" size={12} className="inline mr-1" />
                  {expiryInfo.text}
                </p>
              </div> */}
            </div>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0 ml-3">
              <Button
                variant="ghost"
                size="xs"
                iconName={copied ? 'Check' : 'Copy'}
                iconSize={16}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                  onCopy(link);
                }}
                title={copied ? 'Copied!' : 'Copy'}
              />
              <Button
                variant="ghost"
                size="xs"
                iconName="MoreVertical"
                iconSize={16}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                title="More"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
              <div className="flex items-center space-x-1">
                <Icon name="MousePointer" size={14} color="var(--color-text-secondary)" />
                <span className="text-sm font-medium text-text-primary">
                  {link.clicks.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="TrendingUp" size={14} color="var(--color-accent)" />
                <span className="text-sm font-medium text-accent">{formatEarnings(link.earnings)}</span>
              </div>
            </div>
            <div className="text-xs text-text-secondary">{formatDate(link.createdAt)}</div>
          </div>

          {/* Expand Toggle */}
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="focus:outline-none"
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            >
              <Icon
                name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                size={16}
                color="var(--color-text-secondary)"
              />
            </button>
          </div>
        </div>

        {/* Animated Expand Section */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {isExpanded && (
            <div className="border-t border-border p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  {['todayClicks', 'weekClicks', 'monthClicks'].map((key, idx) => (
                    <div className="flex justify-between" key={idx}>
                      <span className="text-xs text-text-secondary">
                        {key === 'todayClicks'
                          ? "Today's Clicks"
                          : key === 'weekClicks'
                          ? 'This Week'
                          : 'This Month'}
                      </span>
                      <span className="text-xs font-medium text-text-primary">
                        {link[key].toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {['todayEarnings', 'weekEarnings', 'monthEarnings'].map((key, idx) => (
                    <div className="flex justify-between" key={idx}>
                      <span className="text-xs text-text-secondary">
                        {key === 'todayEarnings'
                          ? "Today's Earnings"
                          : key === 'weekEarnings'
                          ? 'This Week'
                          : 'This Month'}
                      </span>
                      <span className="text-xs font-medium text-accent">
                        {formatEarnings(link[key])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons - Added Edit back */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="BarChart3"
                  iconPosition="left"
                  onClick={() => onViewStats(link)}
                  className="flex-1"
                >
                  View Stats
                </Button>
                {/* <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                  iconPosition="left"
                  onClick={() => onEdit(link)}
                  className="flex-1"
                >
                  Edit
                </Button> */}
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Share"
                  iconPosition="left"
                  onClick={() => setShowShareModal(true)}
                  className="flex-1"
                >
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  iconPosition="left"
                  onClick={() => onDelete(link)}
                  className="flex-1 text-error hover:text-error"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Dropdown - Replaced Edit with Active/Deactivate toggle */}
        {showActions && (
        <div
          ref={dropdownRef}
          className="absolute right-4 top-12 bg-surface rounded-lg shadow-lg border border-border z-10 py-2 min-w-[120px]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              const newStatus = link.status === 'active' ? 'expired' : 'active';
              onToggleStatus(link.id, newStatus);
              setShowActions(false);
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-surface-secondary transition-colors"
          >
            <Icon name={link.status === 'active' ? 'Pause' : 'Play'} size={14} />
            <span className="text-sm">
              {link.status === 'active' ? 'Deactivate' : 'Activate'}
            </span>
          </button>

          <button
            onClick={() => {
              setShowShareModal(true);
              setShowActions(false);
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-surface-secondary transition-colors"
          >
            <Icon name="Share" size={14} />
            <span className="text-sm">Share</span>
          </button>

          <button
            onClick={() => {
              onViewStats(link);
              setShowActions(false);
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-surface-secondary transition-colors"
          >
            <Icon name="BarChart3" size={14} />
            <span className="text-sm">Analytics</span>
          </button>

          <div className="border-t border-border my-1"></div>

          <button
            onClick={() => {
              onDelete(link);
              setShowActions(false);
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-error-50 text-error transition-colors"
          >
            <Icon name="Trash2" size={14} />
            <span className="text-sm">Delete</span>
          </button>
        </div>
  )}

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          link={link}
        />
      )}
    </>
  );
};

export default LinkCard;
