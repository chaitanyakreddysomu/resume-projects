import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PageThree = ({ onNextPage, linkId, creatorId }) => {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onNextPage?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onNextPage]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full">
          <div className="text-center space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                Almost There!
              </h1>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Thank you for supporting content creators. Your destination is just moments away.
              </p>
            </div>

            {/* Final Advertisement */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-8 md:p-12">
              <div className="max-w-3xl mx-auto">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="Gift" size={40} color="white" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
                      Exclusive Offer Just for You!
                    </h3>
                    <p className="text-lg text-text-secondary">
                      Don't miss out on our limited-time special offers. Get premium access with incredible savings.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border border-border max-w-md mx-auto">
                    <div className="space-y-4">
                      <div className="text-xs text-text-secondary">Special Promotion</div>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-primary">50% OFF</div>
                        <div className="text-text-primary font-medium">Premium Subscription</div>
                        <div className="text-sm text-text-secondary">Limited time offer - expires soon!</div>
                      </div>
                      <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105">
                        Claim Offer Now
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <Icon name="Check" size={16} className="text-success" />
                      <span className="text-text-secondary">No Hidden Fees</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Icon name="Check" size={16} className="text-success" />
                      <span className="text-text-secondary">Cancel Anytime</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Icon name="Check" size={16} className="text-success" />
                      <span className="text-text-secondary">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Message */}
            <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="Heart" size={20} color="var(--color-primary)" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-text-primary">Supporting Creators</div>
                  <div className="text-sm text-text-secondary">Your view helps fund quality content</div>
                </div>
              </div>
              <p className="text-sm text-text-secondary text-center max-w-md mx-auto">
                By viewing these pages, you're directly contributing to the creator's earnings and helping them produce more amazing content.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="bg-surface border-t border-border p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <div className="text-sm text-text-secondary">
                Redirecting in <span className="font-medium text-primary">{timeLeft} seconds</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-end space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-text-secondary">Preparing final destination...</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((10 - timeLeft) / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageThree;