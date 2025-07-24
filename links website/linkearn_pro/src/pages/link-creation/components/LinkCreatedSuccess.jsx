import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LinkCreatedSuccess = ({ link, onCreateAnother }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(link.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log('Failed to copy link');
    }
  };

  const handleShare = (platform) => {
    const text = `Check out this link: ${link.shortUrl}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(link.shortUrl);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=Check out this link&body=${encodedText}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="bg-success-50 rounded-lg p-6 border border-success-200">
      <div className="text-center space-y-4">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
          <Icon name="CheckCircle" size={32} color="var(--color-success)" />
        </div>

        {/* Success Message */}
        <div>
          <h3 className="text-lg font-semibold text-success mb-2">Link Created Successfully!</h3>
          <p className="text-sm text-text-secondary">
            Your shortened link is ready to use and start earning money.
          </p>
        </div>

        {/* Link Display */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between space-x-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary break-all">{link.shortUrl}</p>
            </div>
            <Button
              variant={copied ? "success" : "outline"}
              size="sm"
              iconName={copied ? "Check" : "Copy"}
              iconSize={16}
              onClick={handleCopyLink}
              className="flex-shrink-0"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="text-center">
            <div className="text-lg font-bold text-text-primary font-data">{link.clicks}</div>
            <div className="text-xs text-text-secondary">Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent font-data">₹{link.earnings.toFixed(2)}</div>
            <div className="text-xs text-text-secondary">Earned</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary font-data">
              {link.createdAt.toLocaleDateString('en-IN')}
            </div>
            <div className="text-xs text-text-secondary">Created</div>
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-text-primary">Share your link:</p>
          <div className="flex justify-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              iconName="MessageCircle"
              iconSize={16}
              onClick={() => handleShare('whatsapp')}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Twitter"
              iconSize={16}
              onClick={() => handleShare('twitter')}
              className="text-blue-500 border-blue-500 hover:bg-blue-50"
            >
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Mail"
              iconSize={16}
              onClick={() => handleShare('email')}
              className="text-gray-600 border-gray-600 hover:bg-gray-50"
            >
              Email
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="primary"
            size="md"
            iconName="Plus"
            iconPosition="left"
            onClick={onCreateAnother}
            className="flex-1"
          >
            Create Another Link
          </Button>
          <Button
            variant="outline"
            size="md"
            iconName="BarChart3"
            iconPosition="left"
            onClick={() => window.location.href = '/link-management'}
            className="flex-1"
          >
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LinkCreatedSuccess;