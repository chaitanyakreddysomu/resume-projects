import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import config from '../../../utils/config';
import API_BASE_URL from 'utils/config';

const EditLinkModal = ({ link, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customName: '',
    originalUrl: '',
    expiryDate: '',
    pages: 4,
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (link && isOpen) {
      setFormData({
        customName: link.customName || '',
        originalUrl: link.originalUrl || '',
        expiryDate: link.expiryDate ? new Date(link.expiryDate).toISOString().slice(0, 16) : '',
        pages: link.pages || 4,
        status: link.status || 'active'
      });
      setErrors({});
    }
  }, [link, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = 'Original URL is required';
    } else if (!isValidUrl(formData.originalUrl)) {
      newErrors.originalUrl = 'Please enter a valid URL';
    }

    if (formData.customName && !/^[a-zA-Z0-9-_]+$/.test(formData.customName)) {
      newErrors.customName = 'Only letters, numbers, hyphens and underscores allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch (err) {
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${API_BASE_URL}/api/links/${link.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          originalurl: formData.originalUrl,
          expirydate: formData.expiryDate || null,
          pages: formData.pages,
          status: formData.status
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update link');
      }

      const updatedLink = await response.json();
      onSave(updatedLink);
      onClose();
    } catch (error) {
      console.error('Error updating link:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${link.customName || 'this link'}"?`)) {
      return;
    }

    setIsLoading(true);
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

      onSave(null, 'delete'); // Signal deletion
      onClose();
    } catch (error) {
      console.error('Error deleting link:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Edit" size={20} color="var(--color-primary)" />
            <h2 className="text-lg font-semibold text-text-primary">Edit Link</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            disabled={isLoading}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} color="var(--color-error)" />
                <span className="text-error text-sm">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Custom Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Link Name
            </label>
            <Input
              type="text"
              value={formData.customName}
              onChange={(e) => handleInputChange('customName', e.target.value)}
              placeholder="Enter link name"
              className={errors.customName ? 'border-error' : ''}
            />
            {errors.customName && (
              <p className="text-sm text-error mt-1">{errors.customName}</p>
            )}
          </div>

          {/* Short URL (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Short URL
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-surface-secondary text-text-secondary text-sm">
                {config.SHORT_LINK_DOMAIN}/
              </span>
              <Input
                type="text"
                value={link.shortUrl || ''}
                readOnly
                className="rounded-l-none bg-surface-secondary"
              />
            </div>
          </div>

          {/* Original URL */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Original URL *
            </label>
            <Input
              type="url"
              value={formData.originalUrl}
              onChange={(e) => handleInputChange('originalUrl', e.target.value)}
              placeholder="https://example.com/your-long-url"
              className={errors.originalUrl ? 'border-error' : ''}
              required
            />
            {errors.originalUrl && (
              <p className="text-sm text-error mt-1">{errors.originalUrl}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full border border-border rounded-md p-2 bg-white"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Expiry Date
            </label>
            <Input
              type="datetime-local"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {/* Pages */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Number of Pages
            </label>
            <select
              value={formData.pages}
              onChange={(e) => handleInputChange('pages', Number(e.target.value))}
              className="w-full border border-border rounded-md p-2 bg-white"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Page' : 'Pages'}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="danger"
              size="md"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLinkModal; 