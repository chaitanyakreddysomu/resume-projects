import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PageOne = ({ onNextPage, linkId, creatorId }) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanProceed(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNextClick = () => {
    if (canProceed) {
      onNextPage?.();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary leading-tight">
                  Welcome to
                  <span className="text-primary block">LinkEarn Pro</span>
                </h1>
                <p className="text-lg text-text-secondary max-w-md mx-auto lg:mx-0">
                  Discover amazing content while supporting your favorite creators through our revenue-sharing platform.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Icon name="Zap" size={24} color="var(--color-primary)" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-text-primary">Fast & Secure</div>
                    <div className="text-sm text-text-secondary">Lightning-fast content delivery</div>
                  </div>
                </div>

                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                    <Icon name="Shield" size={24} color="var(--color-success)" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-text-primary">Creator Support</div>
                    <div className="text-sm text-text-secondary">Every view supports content creators</div>
                  </div>
                </div>

                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                    <Icon name="TrendingUp" size={24} color="var(--color-warning)" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-text-primary">Quality Content</div>
                    <div className="text-sm text-text-secondary">Curated high-quality content</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Ad Space */}
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg p-8 text-center space-y-6">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <Icon name="Star" size={32} color="white" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">
                  Premium Content Awaits
                </h3>
                <p className="text-text-secondary">
                  Get ready to explore exclusive content carefully selected for you.
                </p>
              </div>

              {/* Mock Advertisement */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
                <div className="text-xs text-text-secondary mb-2">Advertisement</div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gray-200 rounded mx-auto"></div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="bg-surface border-t border-border p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <div className="text-sm text-text-secondary">
                {timeLeft > 0 ? (
                  <>Please wait <span className="font-medium text-primary">{timeLeft} seconds</span> before proceeding</>
                ) : (
                  'Ready to proceed to next step'
                )}
              </div>
            </div>

            <div className="flex justify-center sm:justify-end">
              <Button
                variant={canProceed ? "filled" : "outline"}
                size="lg"
                onClick={handleNextClick}
                disabled={!canProceed}
                iconName="ArrowRight"
                iconSize={20}
                className={`min-w-[160px] ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {canProceed ? 'Next Page' : `Wait ${timeLeft}s`}
              </Button>
            </div>
          </div>

          {/* Timer Visualization */}
          {timeLeft > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((10 - timeLeft) / 10) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageOne;