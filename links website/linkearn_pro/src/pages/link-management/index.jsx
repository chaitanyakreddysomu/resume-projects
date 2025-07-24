import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import UserBottomTabs from '../../components/ui/UserBottomTabs';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LinkCard from './components/LinkCard';
import LinkTable from './components/LinkTable';
import SearchAndFilters from './components/SearchAndFilters';
import LinkStatsModal from './components/LinkStatsModal';
import EditLinkModal from './components/EditLinkModal';
import API_BASE_URL from 'utils/config';

const LinkManagement = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLink, setSelectedLink] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [linksPerPage] = useState(10);
  const [shortLinkDomain, setShortLinkDomain] = useState('linkearn.pro');
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key

  // Add periodic refresh of user settings
  useEffect(() => {
    const refreshUserSettings = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) return;

        // Fetch user settings to trigger refresh
        await fetch(`${API_BASE_URL}/api/user/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Increment refresh key to trigger re-renders
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Error refreshing user settings:', error);
      }
    };

    // Refresh every 30 seconds
    const interval = setInterval(refreshUserSettings, 30000);
    
    return () => clearInterval(interval);
  }, []);

  
  // const mockLinks = [
  //   {
  //     id: 1,
  //     customName: "Product Launch Campaign",
  //     shortUrl: "https://lnk.pro/abc123",
  //     originalUrl: "https://example.com/product-launch-2024-amazing-features-and-benefits",
  //     clicks: 1247,
  //     earnings: 623.50,
  //     todayClicks: 45,
  //     todayEarnings: 22.50,
  //     weekClicks: 312,
  //     weekEarnings: 156.00,
  //     monthClicks: 1247,
  //     monthEarnings: 623.50,
  //     status: "active",
  //     createdAt: "2024-01-15T10:30:00Z"
  //   },
  //   {
  //     id: 2,
  //     customName: "Social Media Post",
  //     shortUrl: "https://lnk.pro/def456",
  //     originalUrl: "https://socialmedia.com/post/viral-content-trending-now",
  //     clicks: 892,
  //     earnings: 446.00,
  //     todayClicks: 23,
  //     todayEarnings: 11.50,
  //     weekClicks: 189,
  //     weekEarnings: 94.50,
  //     monthClicks: 892,
  //     monthEarnings: 446.00,
  //     status: "active",
  //     createdAt: "2024-01-14T15:45:00Z"
  //   },
  //   {
  //     id: 3,
  //     customName: "Blog Article Share",
  //     shortUrl: "https://lnk.pro/ghi789",
  //     originalUrl: "https://blog.example.com/how-to-increase-productivity-in-2024",
  //     clicks: 567,
  //     earnings: 283.50,
  //     todayClicks: 12,
  //     todayEarnings: 6.00,
  //     weekClicks: 98,
  //     weekEarnings: 49.00,
  //     monthClicks: 567,
  //     monthEarnings: 283.50,
  //     status: "paused",
  //     createdAt: "2024-01-12T09:15:00Z"
  //   },
  //   {
  //     id: 4,
  //     customName: "YouTube Video",
  //     shortUrl: "https://lnk.pro/jkl012",
  //     originalUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
  //     clicks: 2156,
  //     earnings: 1078.00,
  //     todayClicks: 67,
  //     todayEarnings: 33.50,
  //     weekClicks: 445,
  //     weekEarnings: 222.50,
  //     monthClicks: 2156,
  //     monthEarnings: 1078.00,
  //     status: "active",
  //     createdAt: "2024-01-10T14:20:00Z"
  //   },
  //   {
  //     id: 5,
  //     customName: "E-commerce Store",
  //     shortUrl: "https://lnk.pro/mno345",
  //     originalUrl: "https://store.example.com/special-discount-offer-limited-time",
  //     clicks: 334,
  //     earnings: 167.00,
  //     todayClicks: 8,
  //     todayEarnings: 4.00,
  //     weekClicks: 67,
  //     weekEarnings: 33.50,
  //     monthClicks: 334,
  //     monthEarnings: 167.00,
  //     status: "expired",
  //     createdAt: "2024-01-08T11:30:00Z"
  //   }
  // ];

  // Fetch short link domain from user settings
  useEffect(() => {
    const fetchShortLinkDomain = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/user/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setShortLinkDomain(data.generalSettings?.shortLinkDomain);
        }
      } catch (error) {
        console.error('Error fetching short link domain:', error);
      }
    };

    fetchShortLinkDomain();
  }, []);

  useEffect(() => {
    const loadLinks = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) {
          alert('Please login to view your links');
          setIsLoading(false);
          return;
        }
  
        const response = await fetch(`${API_BASE_URL}/api/links`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch links: ${response.status}`);
        }
  
        const data = await response.json();
  
        const formattedLinks = data.map(link => ({
          id: link.id,
          customName: link.url || 'Untitled Link',
          shortUrl: `${shortLinkDomain.replace(/\/$/, '')}/${link.url}`,
          shortCode: link.url,
          originalUrl: link.originalurl || '',
          clicks: link.clicks || 0,
          earnings: link.earnings || 0,
          todayClicks: 0,
          todayEarnings: 0,
          weekClicks: 0,
          weekEarnings: 0,
          monthClicks: 0,
          monthEarnings: 0,
          status: link.status || 'active',
          createdAt: link.createdat || new Date().toISOString(),
          expiryDate: link.expirydate || null
        }));
  
        setLinks(formattedLinks);
        setFilteredLinks(formattedLinks);
      } catch (error) {
        console.error('Error loading links:', error);
        alert(`Failed to load links: ${error.message}`);
        // Optional fallback to mockLinks if needed
        // setLinks(mockLinks);
        // setFilteredLinks(mockLinks);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadLinks();
  }, [refreshKey, shortLinkDomain]); // 👈 watch for refreshKey and domain changes
  
  

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredLinks(links);
      return;
    }

    const filtered = links.filter(link =>
      link.customName?.toLowerCase().includes(query.toLowerCase()) ||
      link.shortUrl.toLowerCase().includes(query.toLowerCase()) ||
      link.originalUrl.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredLinks(filtered);
    setCurrentPage(1);
  };

  const handleFilter = (filters) => {
    let filtered = [...links];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(link => link.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(link => new Date(link.createdAt) >= filterDate);
    }

    // Click range filter
    if (filters.minClicks) {
      filtered = filtered.filter(link => link.clicks >= parseInt(filters.minClicks));
    }
    if (filters.maxClicks) {
      filtered = filtered.filter(link => link.clicks <= parseInt(filters.maxClicks));
    }

    // Earnings range filter
    if (filters.minEarnings) {
      filtered = filtered.filter(link => link.earnings >= parseFloat(filters.minEarnings));
    }
    if (filters.maxEarnings) {
      filtered = filtered.filter(link => link.earnings <= parseFloat(filters.maxEarnings));
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[filters.sortBy];
      let bValue = b[filters.sortBy];

      if (filters.sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLinks(filtered);
    setSortField(filters.sortBy);
    setSortDirection(filters.sortOrder);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sorted = [...filteredLinks].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      if (field === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (newDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLinks(sorted);
  };

  const handleClearFilters = () => {
    setFilteredLinks(links);
    setCurrentPage(1);
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setShowEditModal(true);
  };

  const handleDelete = async (link) => {
    if (!window.confirm(`Are you sure you want to delete "${link.customName || 'this link'}"?`)) {
      return;
    }

    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${API_BASE_URL}/api/links/${link.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete link');
      }

      // Remove from local state
      const updatedLinks = links.filter(l => l.id !== link.id);
      setLinks(updatedLinks);
      setFilteredLinks(filteredLinks.filter(l => l.id !== link.id));
    } catch (error) {
      console.error('Error deleting link:', error);
      alert(`Failed to delete link: ${error.message}`);
    }
  };

  const handleCopy = (link) => {
    // Copy functionality handled in component
    console.log('Link copied:', link.shortUrl);
  };

  const handleShare = async (link) => {
    try {
      // Check if Web Share API is supported and available
      if (navigator.share && navigator.canShare) {
        // Check if the content can be shared
        const shareData = {
          title: link.customName || 'Check out this link',
          url: link.shortUrl
        };
        
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          // Fallback to clipboard if share data is not supported
          await navigator.clipboard.writeText(link.shortUrl);
          console.log('Link copied to clipboard as fallback');
        }
      } else if (navigator.share) {
        // Web Share API exists but canShare might not be available
        const shareData = {
          title: link.customName || 'Check out this link',
          url: link.shortUrl
        };
        
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(link.shortUrl);
        console.log('Link copied to clipboard');
      }
    } catch (error) {
      // Handle various error scenarios
      if (error.name === 'NotAllowedError') {
        // User denied permission or browser security policy blocked it
        console.log('Share permission denied, falling back to clipboard');
        try {
          await navigator.clipboard.writeText(link.shortUrl);
        } catch (clipboardError) {
          console.error('Clipboard access also failed:', clipboardError);
          // Final fallback - could show a modal with the link to manually copy
        }
      } else if (error.name === 'AbortError') {
        // User cancelled the share dialog
        console.log('Share cancelled by user');
      } else {
        console.error('Share failed:', error);
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(link.shortUrl);
        } catch (clipboardError) {
          console.error('Clipboard fallback failed:', clipboardError);
        }
      }
    }
  };

  const handleViewStats = (link) => {
    setSelectedLink(link);
    setShowStatsModal(true);
  };

  const handleCreateNew = () => {
    navigate('/link-creation');
  };

  const handleSaveLink = (updatedLink, action = 'update') => {
    if (action === 'delete') {
      // Link was deleted, remove from state
      const updatedLinks = links.filter(l => l.id !== editingLink.id);
      setLinks(updatedLinks);
      setFilteredLinks(filteredLinks.filter(l => l.id !== editingLink.id));
    } else {
      // Link was updated, update in state
      const updatedLinks = links.map(l => l.id === updatedLink.id ? updatedLink : l);
      setLinks(updatedLinks);
      setFilteredLinks(filteredLinks.map(l => l.id === updatedLink.id ? updatedLink : l));
    }
  };

  const handleToggleStatus = async (linkId, newStatus) => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      
      if (!token) throw new Error('User not authenticated');

      // Find the link to get its current data
      const currentLink = links.find(link => link.id === linkId);
      if (!currentLink) {
        throw new Error('Link not found');
      }

      const response = await fetch(`${API_BASE_URL}/api/links/${linkId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          originalurl: currentLink.originalUrl, // Include the required originalurl field
          status: newStatus
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update link status');
      }

      // Update local state
      const updatedLinks = links.map(link => 
        link.id === linkId ? { ...link, status: newStatus } : link
      );
      setLinks(updatedLinks);
      setFilteredLinks(filteredLinks.map(link => 
        link.id === linkId ? { ...link, status: newStatus } : link
      ));

      // Show success message
      const statusText = newStatus === 'active' ? 'activated' : 'deactivated';
      console.log(`Link ${statusText} successfully`);
    } catch (error) {
      console.error('Error updating link status:', error);
      alert(`Failed to update link status: ${error.message}`);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate pagination
  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = filteredLinks.slice(indexOfFirstLink, indexOfLastLink);
  const totalPages = Math.ceil(filteredLinks.length / linksPerPage);

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      {/* Main Content */}
      <main className="pt-16 pb-20 md:pt-30 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Link Management</h1>
              <p className="text-text-secondary">Manage and track your shortened links</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="RefreshCw"
                onClick={() => setRefreshKey(prev => prev + 1)}
                title="Refresh settings"
              />
              <Button
                variant="primary"
                size="lg"
                onClick={handleCreateNew}
                iconName="Plus"
              >
                Create New Link
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <SearchAndFilters
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            onClearFilters={handleClearFilters}
            activeFilters={{
              sortBy: sortField,
              sortOrder: sortDirection
            }}
          />

          {/* View Mode Toggle */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-text-secondary">
              {filteredLinks.length} of {links.length} links
            </div>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'cards' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                iconName="Grid"
              />
              <Button
                variant={viewMode === 'table' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                iconName="List"
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-text-secondary">Loading your links...</p>
              </div>
            </div>
          )}

          {/* Content */}
          {!isLoading && (
            <>
              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentLinks.map(link => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onCopy={handleCopy}
                      onShare={handleShare}
                      onViewStats={handleViewStats}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))}
                </div>
              ) : (
                <LinkTable
                  links={currentLinks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onCopy={handleCopy}
                  onShare={handleShare}
                  onViewStats={handleViewStats}
                  onSort={handleSort}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onToggleStatus={handleToggleStatus}
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      iconName="ChevronLeft"
                    />
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      iconName="ChevronRight"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      {showStatsModal && selectedLink && (
        <LinkStatsModal
          link={selectedLink}
          isOpen={showStatsModal}
          onClose={() => setShowStatsModal(false)}
        />
      )}

      {showEditModal && editingLink && (
        <EditLinkModal
          link={editingLink}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveLink}
        />
      )}

      <UserBottomTabs />
    </div>
  );
};

export default LinkManagement;