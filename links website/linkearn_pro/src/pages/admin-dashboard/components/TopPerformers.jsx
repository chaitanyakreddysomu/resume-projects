import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * TopPerformers component
 * 
 * Props:
 *   - topUsers: Array of top user objects from dashboard API
 *   - topLinks: Array of top link objects from dashboard API
 */
const TopPerformers = ({ topUsers = [], topLinks = [] }) => {
  const [activeTab, setActiveTab] = useState('users');

  // Helper: Format earnings (number) as INR currency string
  const formatINR = (amount) => {
    if (typeof amount !== 'number') return '₹0';
    // Use 4 decimal places
    return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  };

  // Helper: Get user name by id (for links' owner)
  const getUserNameById = (userId) => {
    const user = topUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };

  // Helper: Build short URL for a link (for display)
  const getShortUrl = (url) => {
    // If url is already a full URL, just show as is, else prefix with domain from env
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const domain = import.meta.env.VITE_SHORT_LINK_DOMAIN || 'linkearn.pro';
    return `${domain}/${url}`;
  };

  // Helper: Truncate email to 25 characters
  const truncateEmail = (email) => {
    if (!email) return '';
    return email.length > 25 ? email.slice(0, 25) + '…' : email;
  };

  // Only show top 5 users/links
  const top5Users = topUsers.slice(0, 5);
  const top5Links = topLinks.slice(0, 5);

  // Helper: Convert data to CSV string
  const toCSV = (rows, columns) => {
    const escape = (str) =>
      `"${String(str).replace(/"/g, '""')}"`;
    const header = columns.map(col => escape(col.label)).join(',');
    const data = rows.map((row, rowIdx) =>
      columns.map((col, colIdx) => {
        // For amount fields, if the column is "Total Earned (INR)", format with 4 decimals
        if (col.label === 'Total Earned (INR)') {
          // Try to get the value, then format
          const val = col.value(row, rowIdx);
          if (typeof val === 'number') {
            return escape(val.toFixed(4));
          }
          // If already string, try to parse and format
          const num = Number(val);
          if (!isNaN(num)) {
            return escape(num.toFixed(4));
          }
          return escape(val);
        }
        return escape(col.value(row, rowIdx));
      }).join(',')
    );
    return [header, ...data].join('\r\n');
  };

  // Handler: Export current tab's data as CSV
  const handleExport = () => {
    let csv = '';
    let filename = '';
    if (activeTab === 'users') {
      const columns = [
        { label: 'Rank', value: (_, i) => i + 1 },
        { label: 'Name', value: (row) => row.name },
        { label: 'Email', value: (row) => row.email },
        { label: 'Total Earned (INR)', value: (row) => row.totalEarned },
        { label: 'Total Clicks', value: (row) => row.totalClicks },
      ];
      csv = toCSV(top5Users, columns.map((col, i) => ({
        ...col,
        value: (row, idx) => col.value(row, idx !== undefined ? idx : top5Users.indexOf(row))
      })));
      filename = 'top_users.csv';
    } else {
      const columns = [
        { label: 'Rank', value: (_, i) => i + 1 },
        { label: 'Short URL', value: (row) => getShortUrl(row.url) },
        { label: 'Owner', value: (row) => getUserNameById(row.owner) },
        { label: 'Total Earned (INR)', value: (row) => row.totalEarned },
        { label: 'Total Clicks', value: (row) => row.totalClicks },
      ];
      csv = toCSV(top5Links, columns.map((col, i) => ({
        ...col,
        value: (row, idx) => col.value(row, idx !== undefined ? idx : top5Links.indexOf(row))
      })));
      filename = 'top_links.csv';
    }
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Top Performers</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            iconSize={16}
            onClick={handleExport}
            disabled={
              activeTab === 'users'
                ? top5Users.length === 0
                : top5Links.length === 0
            }
            title={`Export Top ${activeTab === 'users' ? 'Users' : 'Links'} as CSV`}
          >
            Export
          </Button>
        </div>
        <div className="flex space-x-1 bg-surface-secondary rounded-lg p-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'users' ? 'bg-surface text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Top Users
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'links' ? 'bg-surface text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Top Links
          </button>
        </div>
      </div>
      <div className="p-6">
        {activeTab === 'users' && (
          <div className="space-y-4">
            {top5Users.length === 0 && (
              <div className="text-center text-text-secondary py-4">No top users found.</div>
            )}
            {top5Users.map((user, index) => (
              <div key={user.id} className="flex items-center space-x-4 p-3 hover:bg-surface-secondary rounded-lg transition-colors">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary rounded-full text-sm font-bold">
                  {index + 1}
                </div>
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} color="var(--color-primary)" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">{user.name}</h4>
                      <p className="text-xs text-text-secondary">{truncateEmail(user.email)}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-success">{formatINR(user.totalEarned)}</div>
                      <div className="text-xs text-text-secondary">{user.totalClicks} clicks</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'links' && (
          <div className="space-y-4">
            {top5Links.length === 0 && (
              <div className="text-center text-text-secondary py-4">No top links found.</div>
            )}
            {top5Links.map((link, index) => (
              <div key={link.id} className="flex items-center space-x-4 p-3 hover:bg-surface-secondary rounded-lg transition-colors">
                <div className="flex items-center justify-center w-8 h-8 bg-success-100 text-success rounded-full text-sm font-bold">
                  {index + 1}
                </div>
                <div className="w-10 h-10 bg-success-50 rounded-full flex items-center justify-center">
                  <Icon name="Link" size={20} color="var(--color-success)" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-text-primary truncate">{getShortUrl(link.url)}</h4>
                      <p className="text-xs text-text-secondary">by {getUserNameById(link.owner)}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-bold text-success">{formatINR(link.totalEarned)}</div>
                      <div className="text-xs text-text-secondary">{link.totalClicks} clicks</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" fullWidth>
            View All {activeTab === 'users' ? 'Users' : 'Links'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopPerformers;