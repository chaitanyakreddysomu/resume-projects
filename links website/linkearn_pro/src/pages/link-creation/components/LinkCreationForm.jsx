import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { format } from 'date-fns-tz';
import config from '../../../utils/config';
import API_BASE_URL from 'utils/config';

const LinkCreationForm = ({ onLinkCreated }) => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    expiryDate: '',
    pages: 4,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [shortLinkDomain, setShortLinkDomain] = useState('linkearn.pro');
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key

  const [urlError, setUrlError] = useState('');
  const [aliasError, setAliasError] = useState('');
  const [aliasAvailable, setAliasAvailable] = useState(null);

  const [debouncedAlias, setDebouncedAlias] = useState('');
  const IST_TIMEZONE = 'Asia/Kolkata';

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
          setShortLinkDomain(data.generalSettings?.shortLinkDomain || 'linkearn.pro');
        }
      } catch (error) {
        console.error('Error fetching short link domain:', error);
      }
    };

    fetchShortLinkDomain();
  }, [refreshKey]); // Add refreshKey as dependency

  const getISTDateTimeLocalString = () => {
    const now = new Date();
    return format(now, "yyyy-MM-dd'T'HH:mm", { timeZone: IST_TIMEZONE });
  };
  // Debounce alias input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedAlias(formData.customAlias.trim());
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData.customAlias]);

  // Check alias availability
  useEffect(() => {
    const checkAvailability = async () => {
      const alias = debouncedAlias;
      if (!alias) {
        setAliasAvailable(null);
        setAliasError('');
        return;
      }

      if (alias.length < 3) {
        setAliasAvailable(false);
        setAliasError('Alias must be at least 3 characters');
        return;
      }

      if (!/^[a-zA-Z0-9-_]+$/.test(alias)) {
        setAliasAvailable(false);
        setAliasError('Only letters, numbers, hyphens and underscores allowed');
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/links/check-alias?alias=${alias}`);
        const data = await res.json();
        if (res.ok && data.available) {
          setAliasAvailable(true);
          setAliasError('');
        } else {
          setAliasAvailable(false);
          setAliasError(data.message || 'Alias is already taken');
        }
      } catch (err) {
        setAliasAvailable(false);
        setAliasError('Failed to check alias');
      }
    };

    checkAvailability();
  }, [debouncedAlias]);

  const validateUrl = (url) => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch (err) {
      return false;
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, originalUrl: url }));
    setUrlError(url && !validateUrl(url) ? 'Please enter a valid URL' : '');
  };

  const handleAliasChange = (e) => {
    const alias = e.target.value.toLowerCase().replace(/[^a-zA-Z0-9-_]/g, '');
    setFormData(prev => ({ ...prev, customAlias: alias }));
  };

  const handlePasteUrl = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFormData(prev => ({ ...prev, originalUrl: text }));
      setUrlError(!validateUrl(text) ? 'Please enter a valid URL' : '');
    } catch {
      console.log('Failed to read clipboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevent shortening a link that is already a short link
    if (
      formData.originalUrl.trim().toLowerCase().startsWith(shortLinkDomain.toLowerCase())
    ) {
      setUrlError('You cannot shorten a link that is already a short link.');
      return;
    }
    if (!formData.originalUrl || urlError || (formData.customAlias && aliasError)) return;

    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) throw new Error('User not authenticated');

      const shortCode = formData.customAlias || Math.random().toString(36).substring(2, 8);
      const shortUrl = (shortLinkDomain.endsWith('/') ? shortLinkDomain : shortLinkDomain + '/') + shortCode;

      const body = {
        url: shortCode,
        originalUrl: formData.originalUrl,
        expiryDate: formData.expiryDate || null,
        pages: formData.pages,
      };

      const res = await fetch(`${API_BASE_URL}/api/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create link');
      }

      const data = await res.json();
      const newLink = {
        id: Date.now(),
        originalUrl: formData.originalUrl,
        shortUrl,
        shortCode,
        clicks: 0,
        earnings: 0,
        createdAt: new Date(),
        expiryDate: formData.expiryDate || null,
        isActive: true
      };

      onLinkCreated(newLink);
      setFormData({ originalUrl: '', customAlias: '', expiryDate: '', pages: 4 });
      setAliasAvailable(null);
    } catch (err) {
      setUrlError(err.message || 'Failed to create link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* URL Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">Enter URL to shorten *</label>
        <div className="relative">
          <Input
            type="url"
            placeholder="https://example.com/your-long-url"
            value={formData.originalUrl}
            onChange={handleUrlChange}
            className={`pr-12 ${urlError ? 'border-error' : ''}`}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconName="Clipboard"
            iconSize={16}
            onClick={handlePasteUrl}
            className="absolute right-2 top-1/2 -translate-y-1/2"
            title="Paste from clipboard"
          />
        </div>
        {urlError && (
          <p className="text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{urlError}</span>
          </p>
        )}
      </div>

      {/* Custom Alias Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">Custom alias (optional)</label>
        <div className="relative">
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-surface-secondary text-text-secondary text-sm">
              {shortLinkDomain}/
            </span>
            <Input
              type="text"
              placeholder="my-custom-link"
              value={formData.customAlias}
              onChange={handleAliasChange}
              className={`rounded-l-none ${
                aliasAvailable === false ? 'border-error' :
                aliasAvailable === true ? 'border-success' : ''
              }`}
            />
          </div>
          {formData.customAlias && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {aliasAvailable === true && <Icon name="Check" size={16} color="var(--color-success)" />}
              {aliasAvailable === false && <Icon name="X" size={16} color="var(--color-error)" />}
            </div>
          )}
        </div>

        {aliasAvailable !== null && (
          <p className={`text-sm flex items-center space-x-1 ${
            aliasAvailable ? 'text-success' : 'text-error'
          }`}>
            <Icon name={aliasAvailable ? 'CheckCircle' : 'XCircle'} size={14} />
            <span>{aliasAvailable ? 'Alias is available!' : aliasError}</span>
          </p>
        )}
      </div>

      {/* More Settings Toggle */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-primary"
        >
          More Settings
        </Button>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-4 p-4 bg-surface-secondary rounded-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">Link Expiry </label>
              <Input
                type="datetime-local"
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                min={getISTDateTimeLocalString()}
              />

            </div> */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">Select Number of Pages</label>
              <select
                value={formData.pages}
                onChange={(e) => setFormData(prev => ({ ...prev, pages: Number(e.target.value) }))}
                className="w-full border border-border rounded-md p-2 bg-white"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Page' : 'Pages'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        iconName="Link"
        iconPosition="left"
        loading={isLoading}
        disabled={!formData.originalUrl || !!urlError || (formData.customAlias && !aliasAvailable)}
        className="w-full"
      >
        {isLoading ? 'Creating Link...' : 'Create Shortened Link'}
      </Button>
    </form>
  );
};

export default LinkCreationForm;
