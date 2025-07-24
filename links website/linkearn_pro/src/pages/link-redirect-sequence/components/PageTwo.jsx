import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PageTwo = ({ onNextPage, linkId, creatorId }) => {
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
        <div className="max-w-6xl w-full">
          <div className="text-center space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                Exploring Quality Content
              </h1>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                We're preparing something special for you. Our platform ensures creators get rewarded for their valuable content.
              </p>
            </div>

            {/* Main Advertisement Area */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Ad Content */}
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto lg:mx-0">
                    <Icon name="Globe" size={32} color="white" />
                  </div>
                  <div className="text-center lg:text-left space-y-3">
                    <h3 className="text-2xl font-bold text-text-primary">
                      Discover Amazing Products
                    </h3>
                    <p className="text-text-secondary">
                      Find the latest trends and products that match your interests. Exclusive deals and offers await!
                    </p>
                  </div>
                  <div className="flex justify-center lg:justify-start">
                    <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105">
                      Explore Now
                    </button>
                  </div>
                </div>

                {/* Visual Element */}
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="h-24 bg-white rounded-lg shadow-sm border border-border p-4">
                        <div className="w-8 h-8 bg-purple-100 rounded mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2 mt-1"></div>
                      </div>
                      <div className="h-32 bg-white rounded-lg shadow-sm border border-border p-4">
                        <div className="w-8 h-8 bg-blue-100 rounded mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-2/3 mt-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4 mt-1"></div>
                      </div>
                    </div>
                    <div className="space-y-4 pt-8">
                      <div className="h-32 bg-white rounded-lg shadow-sm border border-border p-4">
                        <div className="w-8 h-8 bg-green-100 rounded mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4 mt-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2 mt-1"></div>
                      </div>
                      <div className="h-24 bg-white rounded-lg shadow-sm border border-border p-4">
                        <div className="w-8 h-8 bg-yellow-100 rounded mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2 mt-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface rounded-lg p-6 border border-border">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Users" size={20} color="var(--color-primary)" />
                </div>
                <h4 className="font-medium text-text-primary mb-2">Community Driven</h4>
                <p className="text-sm text-text-secondary">Join millions of users discovering great content</p>
              </div>
              
              <div className="bg-surface rounded-lg p-6 border border-border">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" size={20} color="var(--color-success)" />
                </div>
                <h4 className="font-medium text-text-primary mb-2">Safe & Secure</h4>
                <p className="text-sm text-text-secondary">Your data and privacy are our top priority</p>
              </div>

              <div className="bg-surface rounded-lg p-6 border border-border">
                <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Zap" size={20} color="var(--color-warning)" />
                </div>
                <h4 className="font-medium text-text-primary mb-2">Fast Loading</h4>
                <p className="text-sm text-text-secondary">Optimized for the best viewing experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="bg-surface border-t border-border p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <div className="text-sm text-text-secondary">
                Automatically proceeding in <span className="font-medium text-primary">{timeLeft} seconds</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-end space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-text-secondary">Loading next content...</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((10 - timeLeft) / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTwo;