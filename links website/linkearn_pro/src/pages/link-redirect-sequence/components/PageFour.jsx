import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PageFour = ({ onRedirect, destinationUrl, linkId, creatorId }) => {
  const handleRedirect = () => {
    onRedirect?.();
  };

  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'destination';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-success-100 rounded-full flex items-center justify-center mx-auto">
            <Icon name="CheckCircle" size={48} color="var(--color-success)" />
          </div>

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
              Ready to Continue
            </h1>
            <p className="text-lg text-text-secondary">
              Thank you for supporting content creators! You can now proceed to your destination.
            </p>
          </div>

          {/* Destination Info */}
          <div className="bg-surface rounded-lg border border-border p-6 space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Icon name="ExternalLink" size={20} className="text-primary" />
              <span className="text-sm font-medium text-text-secondary">You're being redirected to:</span>
            </div>
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="text-lg font-medium text-primary break-all">
                {getDomainFromUrl(destinationUrl)}
              </div>
              <div className="text-sm text-text-secondary mt-1 break-all">
                {destinationUrl}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="space-y-4">
            <Button
              variant="filled"
              size="lg"
              onClick={handleRedirect}
              iconName="ArrowRight"
              iconSize={20}
              className="w-full sm:w-auto min-w-[200px] bg-success hover:bg-success/90"
            >
              Continue to Destination
            </Button>
            <p className="text-xs text-text-secondary">
              Click the button above to proceed to your destination
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-primary-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">₹2.50</div>
              <div className="text-xs text-text-secondary">Creator Earned</div>
            </div>
            <div className="bg-success-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-success">3.2s</div>
              <div className="text-xs text-text-secondary">Avg. Load Time</div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-6 border border-primary-200">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <Icon name="Heart" size={20} className="text-primary" />
              <span className="font-medium text-text-primary">Thank You!</span>
            </div>
            <p className="text-sm text-text-secondary">
              Your engagement helps creators earn revenue and continue producing quality content. 
              Every view makes a difference in supporting the creative community.
            </p>
          </div>

          {/* LinkEarn Pro Info */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">L</span>
              </div>
              <span className="font-medium text-text-primary">LinkEarn Pro</span>
            </div>
            <p className="text-xs text-text-secondary">
              Connecting creators with their audience through smart monetization
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="bg-surface border-t border-border p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <div className="text-sm text-text-secondary">
                Safe and secure redirect powered by LinkEarn Pro
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-xs text-success font-medium">Verified Safe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageFour;