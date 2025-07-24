import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import config from '../../../utils/config';
import ShareModal from './ShareModal';
import API_BASE_URL from 'utils/config';

const LinkTable = ({
  links = [],
  onEdit,
  onDelete,
  onCopy,
  onShare,
  onViewStats,
  onSort,
  sortField,
  sortDirection,
  onToggleStatus,
  onBulkDelete,
  onBulkExport,
}) => {
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [shortLinkDomain, setShortLinkDomain] = useState('linkear');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/settings`);
        const data = await response.json();
        setShortLinkDomain(data.generalSettings.shortLinkDomain);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    fetchSettings();
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
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const truncateUrl = (url, maxLength = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedLinks(links.map((link) => link.id));
    } else {
      setSelectedLinks([]);
    }
  };

  const handleSelectLink = (linkId, checked) => {
    if (checked) {
      setSelectedLinks((prev) => [...prev, linkId]);
    } else {
      setSelectedLinks((prev) => prev.filter((id) => id !== linkId));
    }
  };

  const handleCopy = async (shortUrl, link, idx) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      onCopy?.(link);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleBulkDelete = () => {
    if (!Array.isArray(links)) return;
    const selectedLinkObjects = links.filter((link) => selectedLinks.includes(link.id));
    onBulkDelete?.(selectedLinkObjects);
    setSelectedLinks([]);
  };

  const handleBulkExport = () => {
    if (!Array.isArray(links)) return;
    const selectedLinkObjects = links.filter((link) => selectedLinks.includes(link.id));
    onBulkExport?.(selectedLinkObjects);
    setSelectedLinks([]);
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

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const columns = [
    { key: 'customName', label: 'Link Name', sortable: true },
    { key: 'shortUrl', label: 'Short URL', sortable: false },
    { key: 'originalUrl', label: 'Original URL', sortable: false },
    { key: 'clicks', label: 'Clicks', sortable: true },
    { key: 'earnings', label: 'Earnings', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  const handleShareClick = (link) => {
    setShareLink(link);
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setShareLink(null);
  };

  return (
    <>
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {selectedLinks.length > 0 && (
          <div className="bg-primary-50 border-b border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                {selectedLinks.length} link{selectedLinks.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  onClick={handleBulkExport}
                >
                  Export
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  iconName="Trash2"
                  iconPosition="left"
                  onClick={handleBulkDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-secondary border-b border-border">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedLinks.length === links.length && links.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border"
                  />
                </th>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-3 text-left">
                    {column.sortable ? (
                      <button
                        onClick={() => onSort?.(column.key)}
                        className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-colors"
                      >
                        <span>{column.label}</span>
                        <Icon name={getSortIcon(column.key)} size={14} color="currentColor" />
                      </button>
                    ) : (
                      <span className="text-sm font-medium text-text-primary">{column.label}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {links.map((link, idx) => (
                <tr key={link.id} className="hover:bg-surface-secondary transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedLinks.includes(link.id)}
                      onChange={(e) => handleSelectLink(link.id, e.target.checked)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-text-primary">
                      {link.customName || 'Untitled Link'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-primary font-data">{link.shortUrl}</span>
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName={copiedIndex === idx ? 'Check' : 'Copy'}
                        iconSize={14}
                        onClick={() => handleCopy(link.shortUrl, link, idx)}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-text-secondary">
                      {truncateUrl(link.originalUrl)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <Icon name="MousePointer" size={14} color="var(--color-text-secondary)" />
                      <span className="text-sm font-medium text-text-primary">
                        {link.clicks.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <Icon name="TrendingUp" size={14} color="var(--color-accent)" />
                      <span className="text-sm font-medium text-accent">
                        {formatEarnings(link.earnings)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-text-secondary">
                      {formatDate(link.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(link.status)}`}>
                      {link.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="BarChart3"
                        iconSize={14}
                        onClick={() => onViewStats?.(link)}
                        title="View Analytics"
                      />
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName={link.status === 'active' ? 'Pause' : 'Play'}
                        iconSize={14}
                        onClick={() => {
                          const newStatus = link.status === 'active' ? 'expired' : 'active';
                          onToggleStatus?.(link.id, newStatus);
                        }}
                        title={link.status === 'active' ? 'Deactivate' : 'Activate'}
                        className={
                          link.status === 'active'
                            ? 'text-warning hover:text-warning'
                            : 'text-success hover:text-success'
                        }
                      />
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="Share"
                        iconSize={14}
                        onClick={() => handleShareClick(link)}
                        title="Share Link"
                      />
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="Trash2"
                        iconSize={14}
                        onClick={() => onDelete?.(link)}
                        title="Delete Link"
                        className="text-error hover:text-error"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {links.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Link" size={48} color="var(--color-text-muted)" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No links found</h3>
            <p className="text-text-secondary mb-4">Create your first shortened link to get started</p>
            <Button variant="primary" iconName="Plus" iconPosition="left">
              Create New Link
            </Button>
          </div>
        )}

        {showShareModal && (
          <ShareModal isOpen={showShareModal} onClose={closeShareModal} link={shareLink} />
        )}
      </div>
    </>
  );
};

export default LinkTable;
