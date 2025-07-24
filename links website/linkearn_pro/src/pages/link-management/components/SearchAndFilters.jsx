import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchAndFilters = ({ onSearch, onFilter, onSort, activeFilters, onClearFilters }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    minClicks: '',
    maxClicks: '',
    minEarnings: '',
    maxEarnings: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      status: 'all',
      dateRange: 'all',
      minClicks: '',
      maxClicks: '',
      minEarnings: '',
      maxEarnings: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    setSearchQuery('');
    onClearFilters();
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    // { value: 'paused', label: 'Paused' },
    { value: 'expired', label: 'Expired' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'clicks', label: 'Click Count' },
    { value: 'earnings', label: 'Earnings' },
    { value: 'customName', label: 'Link Name' }
  ];

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.minClicks) count++;
    if (filters.maxClicks) count++;
    if (filters.minEarnings) count++;
    if (filters.maxEarnings) count++;
    return count;
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4 space-y-4 md:space-y-0">
  {/* Search Bar */}
  <div className="relative flex-1">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon name="Search" size={16} color="var(--color-text-muted)" />
    </div>
    <Input
      type="search"
      placeholder="Search links by name, URL, or custom name..."
      value={searchQuery}
      onChange={handleSearchChange}
      className="pl-10 pr-4 w-full"
    />
    {searchQuery && (
      <button
        onClick={() => {
          setSearchQuery('');
          onSearch('');
        }}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <Icon name="X" size={16} color="var(--color-text-muted)" />
      </button>
    )}
  </div>

  {/* Filters and Buttons */}
  <div className="flex items-center space-x-2 flex-wrap mt-1 md:mt-0">
    {/* Status Filter */}
    <select
      value={filters.status}
      onChange={(e) => handleFilterChange('status', e.target.value)}
      className="px-3 py-1.5 text-sm border border-border rounded-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {statusOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>

    {/* Date Range Filter */}
    <select
      value={filters.dateRange}
      onChange={(e) => handleFilterChange('dateRange', e.target.value)}
      className="px-3 py-1.5 text-sm border border-border rounded-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {dateRangeOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>

    {/* Sort By */}
    <select
      value={filters.sortBy}
      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
      className="px-3 py-1.5 text-sm border border-border rounded-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {sortOptions.map(option => (
        <option key={option.value} value={option.value}>
          Sort by {option.label}
        </option>
      ))}
    </select>

    {/* Sort Order */}
    <Button
      variant="outline"
      size="sm"
      iconName={filters.sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
      onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
      title={`Sort ${filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
    />

    {/* Advanced Filters Toggle */}
    <Button
      variant={showAdvancedFilters ? 'primary' : 'outline'}
      size="sm"
      iconName="Filter"
      iconPosition="left"
      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
    >
      Filters
      {getActiveFilterCount() > 0 && (
        <span className="ml-1 px-1.5 py-0.5 text-xs bg-accent text-white rounded-full">
          {getActiveFilterCount()}
        </span>
      )}
    </Button>

    {/* Clear Filters */}
    {(getActiveFilterCount() > 0 || searchQuery) && (
      <Button
        variant="ghost"
        size="sm"
        iconName="X"
        iconPosition="left"
        onClick={handleClearFilters}
      >
        Clear
      </Button>
    )}
  </div>
</div>

  );
};

export default SearchAndFilters;