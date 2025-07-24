import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'requested', label: 'Requested' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'completed', label: 'Completed' }
  ];

  const amountRanges = [
    { value: 'all', label: 'All Amounts' },
    { value: '0-500', label: '₹0 - ₹500' },
    { value: '500-1000', label: '₹500 - ₹1,000' },
    { value: '1000-5000', label: '₹1,000 - ₹5,000' },
    { value: '5000+', label: '₹5,000+' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4 space-y-4 w-full max-w-full min-w-0">
      <div className="flex items-center justify-between w-full">
        <h3 className="font-semibold text-text-primary">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          onClick={onClearFilters}
        >
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {/* Search */}
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium text-text-primary">Search User</label>
          <div className="relative w-full">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <Input
              type="text"
              placeholder="Name, email, UPI ID..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium text-text-primary">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Range */}
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium text-text-primary">Amount Range</label>
          <select
            value={filters.amountRange}
            onChange={(e) => handleFilterChange('amountRange', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {amountRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium text-text-primary">Date Range</label>
          <div className="flex space-x-2 w-full">
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="flex-1 min-w-0"
            />
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="flex-1 min-w-0"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.search || filters.status !== 'all' || filters.amountRange !== 'all' || filters.startDate || filters.endDate) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border w-full">
          <span className="text-sm text-text-secondary">Active filters:</span>
          {filters.search && (
            <span className="px-2 py-1 bg-primary-50 text-primary text-xs rounded-full">
              Search: {filters.search}
            </span>
          )}
          {filters.status !== 'all' && (
            <span className="px-2 py-1 bg-primary-50 text-primary text-xs rounded-full">
              Status: {filters.status}
            </span>
          )}
          {filters.amountRange !== 'all' && (
            <span className="px-2 py-1 bg-primary-50 text-primary text-xs rounded-full">
              Amount: {filters.amountRange}
            </span>
          )}
          {(filters.startDate || filters.endDate) && (
            <span className="px-2 py-1 bg-primary-50 text-primary text-xs rounded-full">
              Date: {filters.startDate || 'Start'} - {filters.endDate || 'End'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentFilters;