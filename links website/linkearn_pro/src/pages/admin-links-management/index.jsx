import React, { useEffect, useState } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import AdminSidebar from '../../components/ui/AdminSidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import API_BASE_URL from 'utils/config';

const AdminLinksManagement = () => {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedLink, setSelectedLink] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userTooltip, setUserTooltip] = useState({ show: false, user: null, x: 0, y: 0 });
  const [shortLinkDomain, setShortLinkDomain] = useState('linkearn.pro');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) throw new Error('User not authenticated');

        // Fetch admin settings first to get short link domain
        const settingsResponse = await fetch(`${API_BASE_URL}/api/user/settings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setShortLinkDomain(settingsData.generalSettings?.shortLinkDomain || 'linkearn.pro');
        }

        // Fetch links
          const res = await fetch(`${API_BASE_URL}/api/admin/links`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch links');
        const data = await res.json();
        const linksWithShortUrl = data.map(link => ({
          ...link,
          shortUrl: `${shortLinkDomain.replace(/\/$/, '')}/${link.url || link.shortCode || link.id}`
        }));
        setLinks(linksWithShortUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [shortLinkDomain]);

  // For user filter, use only userName if available, else fallback to user_id (but only show name in dropdown)
  const uniqueUsers = Array.from(
    new Set(
      links.map(l =>
        l.userName
          ? l.userName
          : l.user_id
      )
    )
  ).filter(Boolean);

  useEffect(() => {
    let filtered = [...links];
    if (statusFilter !== 'all') {
      filtered = filtered.filter(link => link.status === statusFilter);
    }
    if (userFilter !== 'all') {
      filtered = filtered.filter(link => {
        // Compare only by userName or user_id (but only name in dropdown)
        const userString = link.userName ? link.userName : link.user_id;
        return userString === userFilter;
      });
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(link =>
        (link.originalUrl && link.originalUrl.toLowerCase().includes(s)) ||
        (link.shortUrl && link.shortUrl.toLowerCase().includes(s))
      );
    }
    setFilteredLinks(filtered);
  }, [links, statusFilter, userFilter, search]);

  const handleView = (link) => {
    setSelectedLink(link);
    setShowModal(true);
  };

  const handleUserMouseEnter = (user, e) => {
    const rect = e.target.getBoundingClientRect();
    setUserTooltip({ show: true, user, x: rect.right + 8, y: rect.top });
  };
  const handleUserMouseLeave = () => setUserTooltip({ show: false, user: null, x: 0, y: 0 });

  // Export data as CSV
  const handleExportData = () => {
    if (!filteredLinks.length) return;
    // Define CSV headers
    const headers = [
      'Link ID',
      'Original URL',
      'Short URL',
      'User',
      'Clicks',
      'Earnings',
      'Status',
      'Created At'
    ];
    // Map data to CSV rows
    const rows = filteredLinks.map(link => [
      link.id,
      `"${link.originalUrl || ''}"`,
      `"${link.shortUrl || ''}"`,
      link.userName || link.user_id || '-',
      link.clicks,
      link.earnings?.toFixed(2) ?? '0.00',
      link.status,
      link.createdAt ? new Date(link.createdAt).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : '-'
    ]);
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'links_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <AdminSidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Total Link Count */}
          <div className="flex items-center gap-4 mb-2">
            <div className="text-lg font-semibold text-text-primary">
              Total Links: <span className="font-bold">{links.length}</span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">Links Management</h1>
              <p className="text-text-secondary mt-1">View and manage all platform links</p>
            </div>
            <div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExportData}
                iconName="Download"
              >
                Export Data
              </Button>
            </div>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <input
              type="text"
              placeholder="Search by original or short URL..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-border rounded px-3 py-2 text-sm min-w-[200px]"
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border border-border rounded px-3 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
              className="border border-border rounded px-3 py-2 text-sm"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter('all');
                setUserFilter('all');
                setSearch('');
              }}
            >
              Clear Filters
            </Button>
          </div>
          {error && (
            <div className="bg-error-50 border border-error rounded-lg p-4">
              <span className="text-error font-medium">Error: {error}</span>
            </div>
          )}
          {loading ? (
            <div className="text-center py-12">Loading links...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-surface rounded-lg border border-border">
                <thead className="bg-surface-secondary border-b border-border">
                  <tr>
                    <th className="p-3 text-left text-xs font-semibold text-text-secondary">Link ID</th>
                    <th className="p-3 text-left text-xs font-semibold text-text-secondary">Original URL</th>
                    <th className="p-3 text-left text-xs font-semibold text-text-secondary">Short URL</th>
                    <th className="p-3 text-left text-xs font-semibold text-text-secondary">User</th>
                    <th className="p-3 text-left text-xs font-semibold text-text-secondary">Clicks</th>
                    <th className="p-3 text-left text-xs font-semibold text-text-secondary">Earnings</th>
                    <th className="p-3 text-left text-xs font-semibold text-text-secondary">Status</th>
                    <th className="p-3 text-left text-xs font-semibold text-text-secondary">Created At</th>
                    <th className="p-3 text-left text-xs font-semibold text-text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map(link => (
                    <tr key={link.id} className="border-b border-border hover:bg-surface-secondary">
                      <td className="p-3 text-xs font-mono">{link.id}</td>
                      <td className="p-3 text-xs">
                        <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">{link.shortUrl}</a>
                      </td>
                      <td className="p-3 text-xs break-all">{link.originalUrl}</td>
                      <td className="p-3 text-xs">
                        <span
                          onMouseEnter={e => handleUserMouseEnter({
                            name: link.userName,
                            email: link.userEmail,
                            id: link.user_id
                          }, e)}
                          onMouseLeave={handleUserMouseLeave}
                          className="cursor-pointer"
                        >
                          {link.userName || link.user_id || '-'}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-center">{link.clicks}</td>
                      <td className="p-3 text-xs text-center">₹{link.earnings?.toFixed(2) ?? '0.00'}</td>
                      <td className="p-3 text-xs text-center">{link.status}</td>
                      <td className="p-3 text-xs">{link.createdAt ? new Date(link.createdAt).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}</td>
                      <td className="p-3 text-xs flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Eye"
                          onClick={() => handleView(link)}
                          title="View Details"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLinks.length === 0 && (
                <div className="text-center py-8 text-text-secondary">No links found.</div>
              )}
            </div>
          )}
        </div>
      </main>
      {/* View Modal */}
      {showModal && selectedLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg border border-border p-6 w-full max-w-lg relative">
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2"
            />
            <h2 className="text-xl font-semibold mb-4">Link Details</h2>
            <div className="space-y-2">
              {/* <div><b>Link ID:</b> {selectedLink.id}</div> */}
              <div><b>OriginalShort URL:</b> <a href={selectedLink.shortUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">{selectedLink.shortUrl}</a></div>
              <div><b>Short URL:</b> <span className="break-all">{selectedLink.originalUrl}</span></div>
              <div>
                <b>User:</b> {selectedLink.userName || selectedLink.user_id || '-'}
              </div>
              <div><b>Clicks:</b> {selectedLink.clicks}</div>
              <div><b>Earnings:</b> ₹{selectedLink.earnings?.toFixed(2) ?? '0.00'}</div>
              <div><b>Status:</b> {selectedLink.status}</div>
              <div><b>Created At:</b> {selectedLink.createdAt ? new Date(selectedLink.createdAt).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : '-'}</div>
              {selectedLink.users && (
                <div className="mt-2 p-2 bg-surface-secondary rounded">
                  <b>User Details:</b><br />
                  Name: {selectedLink.users.firstname} {selectedLink.users.lastname}<br />
                  Email: {selectedLink.users.userEmail}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* User Tooltip */}
      {userTooltip.show && userTooltip.user && (
        <div
          className="fixed z-50 bg-surface border border-border rounded shadow-lg p-3 text-xs"
          style={{ left: userTooltip.x, top: userTooltip.y }}
        >
          <div><b>Name:</b> {userTooltip.user.name}</div>
          <div><b>Email:</b> {userTooltip.user.email}</div>
        </div>
      )}
    </div>
  );
};

export default AdminLinksManagement; 