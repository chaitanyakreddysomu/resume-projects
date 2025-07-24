import React from 'react';
import Icon from '../../../components/AppIcon';

const LinkPreview = ({ originalUrl, customAlias }) => {
  if (!originalUrl) return null;

  const shortCode = customAlias || 'abc123';
  const previewUrl = `https://lnk.pro/${shortCode}`;

  return (
    <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="Eye" size={20} color="var(--color-primary)" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-primary mb-2">Link Preview</h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-text-secondary mb-1">Shortened URL:</p>
              <p className="text-sm font-medium text-text-primary break-all">{previewUrl}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Original URL:</p>
              <p className="text-sm text-text-secondary break-all">{originalUrl}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkPreview;