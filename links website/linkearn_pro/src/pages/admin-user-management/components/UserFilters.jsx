import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const UserFilters = ({ filters = {}, onFilterChange, totalUsers = 0 }) => {
  const handleInputChange = (field, value) => {
    onFilterChange?.({ [field]: value });
  };

  const handleDateRangeChange = (field, value) => {
    onFilterChange?.({
      dateRange: { ...filters?.dateRange, [field]: value }
    });
  };

  const clearFilters = () => {
    onFilterChange?.({
      searchQuery: '',
      dateRange: { start: '', end: '' },
      status: 'all',
      earningsMin: '',
      earningsMax: '',
      activityLevel: 'all',
      referralStatus: 'all'
    });
  };

  const hasActiveFilters = () => {
    return filters?.searchQuery ||
           filters?.dateRange?.start ||
           filters?.dateRange?.end ||
           filters?.status !== 'all' ||
           filters?.earningsMin ||
           filters?.earningsMax ||
           filters?.activityLevel !== 'all' ||
           filters?.referralStatus !== 'all';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <div className="flex items-center space-x-2 mb-4 lg:mb-0">
          <Icon name="Filter" size={20} className="text-text-secondary" />
          <h3 className="text-lg font-medium text-text-primary">Filters</h3>
          <span className="px-2 py-1 bg-primary-50 text-primary text-sm rounded-md">
            {totalUsers} users
          </span>
        </div>
        {hasActiveFilters() && (
          <Button
            variant="outline"
            size="sm"
            iconName="X"
            iconSize={16}
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Search Users
          </label>
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
            />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={filters?.searchQuery || ''}
              onChange={(e) => handleInputChange('searchQuery', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Status
          </label>
          <select
            value={filters?.status || 'all'}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending_verification">Pending Verification</option>
          </select>
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Activity Level
          </label>
          <select
            value={filters?.activityLevel || 'all'}
            onChange={(e) => handleInputChange('activityLevel', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="high">High (15+ links)</option>
            <option value="medium">Medium (5-15 links)</option>
            <option value="low">Low (&lt;5 links)</option>
          </select>
        </div>

        {/* Referral Filter */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Referral Status
          </label>
          <select
            value={filters?.referralStatus || 'all'}
            onChange={(e) => handleInputChange('referralStatus', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Users</option>
            <option value="referred">Referred Users</option>
            <option value="not_referred">Non-Referred Users</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Registration From
            </label>
            <Input
              type="date"
              value={filters?.dateRange?.start || ''}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Registration To
            </label>
            <Input
              type="date"
              value={filters?.dateRange?.end || ''}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
            />
          </div>

          {/* Earnings Range */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Min Earnings (₹)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={filters?.earningsMin || ''}
              onChange={(e) => handleInputChange('earningsMin', e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Max Earnings (₹)
            </label>
            <Input
              type="number"
              placeholder="No limit"
              value={filters?.earningsMax || ''}
              onChange={(e) => handleInputChange('earningsMax', e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;