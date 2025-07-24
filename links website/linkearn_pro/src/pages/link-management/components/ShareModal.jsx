import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import config from '../../../utils/config';

const ShareModal = ({ link, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shortUrl = `${link?.url || link?.shortUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen || !link) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black focus:outline-none"
          aria-label="Close share modal"
        >
          <Icon name="X" size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-3">Share Link</h2>

        {/* URL Display with Copy Icon */}
        <div className="relative bg-slate-100 p-3 pr-10 rounded break-words text-sm mb-4">
          <span className="select-all">{shortUrl}</span>
          <button
            onClick={handleCopy}
            className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-slate-200 transition"
            aria-label="Copy link"
          >
            <Icon name={copied ? 'Check' : 'Copy'} size={16} color="var(--color-text-secondary)" />
          </button>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <ShareButton app="Telegram" link={link} />
          <ShareButton app="WhatsApp" link={link} />
        </div>
      </div>
    </div>
  );
};

const ShareButton = ({ app, link }) => {
  const shortUrl = `${config.SHORT_LINK_DOMAIN}/${link?.url || link?.shortUrl}`;

  const getShareUrl = () => {
    switch (app) {
      case 'Telegram':
        return `https://t.me/share/url?url=${encodeURIComponent(shortUrl)}`;
      case 'WhatsApp':
        return `https://wa.me/?text=${encodeURIComponent(shortUrl)}`;
      default:
        return null;
    }
  };

  const getStyle = () => {
    switch (app) {
      case 'Telegram':
        return 'bg-[#229ED9] text-white';
      case 'WhatsApp':
        return 'bg-[#25D366] text-white';
      default:
        return 'bg-gray-200 text-black';
    }
  };

  const getIconName = () => {
    switch (app) {
      case 'Telegram':
        return 'Send';
      case 'WhatsApp':
        return 'PhoneCall';
      default:
        return '';
    }
  };

  const handleClick = () => {
    const shareUrl = getShareUrl();
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm ${getStyle()} hover:opacity-90 transition`}
      aria-label={`Share on ${app}`}
      type="button"
    >
      <Icon name={getIconName()} size={16} color="white" />
      {app}
    </button>
  );
};

export default ShareModal;
