import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageOne from './components/PageOne';
import PageTwo from './components/PageTwo';
import PageThree from './components/PageThree';
import PageFour from './components/PageFour';
import API_BASE_URL from 'utils/config';

const LinkRedirectSequence = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get destination URL from query parameters
  const destinationUrl = searchParams.get('url') || 'https://example.com';
  const linkId = searchParams.get('linkId') || null;
  const creatorId = searchParams.get('creatorId') || null;

  // Track analytics for each page view
  const trackPageView = (pageNumber) => {
    // Analytics tracking logic here
    console.log(`Page ${pageNumber} viewed for link ${linkId}`);
  };

  // Handle page progression
  const handleNextPage = () => {
    if (currentPage < 4) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      trackPageView(nextPage);
    }
  };

  // Handle final redirect to destination
  const handleFinalRedirect = () => {
    // Track final conversion
    console.log(`Redirecting to ${destinationUrl} for link ${linkId}`);
    
    // Redirect to destination URL
    window.location.href = destinationUrl;
  };

  // Track initial page view
  useEffect(() => {
    trackPageView(1);
  }, []);

  // Prevent navigation away during sequence
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentPage < 4) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentPage]);

  // Auto-progress for pages 2 and 3 after timer
  useEffect(() => {
    let timer;
    
    if (currentPage === 2 || currentPage === 3) {
      timer = setTimeout(() => {
        handleNextPage();
      }, 10000); // 10 seconds
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentPage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <PageOne 
            onNextPage={handleNextPage}
            linkId={linkId}
            creatorId={creatorId}
          />
        );
      case 2:
        return (
          <PageTwo 
            onNextPage={handleNextPage}
            linkId={linkId}
            creatorId={creatorId}
          />
        );
      case 3:
        return (
          <PageThree 
            onNextPage={handleNextPage}
            linkId={linkId}
            creatorId={creatorId}
          />
        );
      case 4:
        return (
          <PageFour 
            onRedirect={handleFinalRedirect}
            destinationUrl={destinationUrl}
            linkId={linkId}
            creatorId={creatorId}
          />
        );
      default:
        return (
          <PageOne 
            onNextPage={handleNextPage}
            linkId={linkId}
            creatorId={creatorId}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-surface border-b border-border px-4 py-3">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium text-text-primary">
                Step {currentPage} of 4
              </div>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step <= currentPage ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentPage / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16">
        {renderCurrentPage()}
      </div>

      {/* LinkEarn Pro Branding */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-surface/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <span className="text-xs font-medium text-text-primary">
              Powered by LinkEarn Pro
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkRedirectSequence;