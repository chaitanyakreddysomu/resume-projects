import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import UserBottomTabs from '../../components/ui/UserBottomTabs';
import Icon from '../../components/AppIcon';
import LinkCreationForm from './components/LinkCreationForm';
import LinkPreview from './components/LinkPreview';
import LinkCreatedSuccess from './components/LinkCreatedSuccess';
import QuickActions from './components/QuickActions';
import API_BASE_URL from 'utils/config';

const SHORT_LINK_DOMAIN = import.meta.env.VITE_SHORT_LINK_DOMAIN;

const LinkCreation = () => {
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'success'
  const [createdLink, setCreatedLink] = useState(null);
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: ''
  });
  const [todayStats, setTodayStats] = useState({
    clicks: 0,
    earnings: 0,
    links: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);

  const handleLinkCreated = (link) => {
    setCreatedLink(link);
    setCurrentStep('success');
  };

  const handleCreateAnother = () => {
    setCurrentStep('form');
    setCreatedLink(null);
    setFormData({ originalUrl: '', customAlias: '' });
  };

  const handleTemplateSelect = (template) => {
    // Apply template settings to form
    const expirationDate = template.settings.expirationDays 
      ? new Date(Date.now() + template.settings.expirationDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : '';
    
    // This would typically update form state in a real implementation
    console.log('Template selected:', template);
  };

  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchTodayStats = async () => {
      setLoadingStats(true);
      setErrorStats(null);
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) throw new Error('User not authenticated');
        const today = getTodayDate();
        // Fetch all links for the user
        const res = await fetch(`${API_BASE_URL}/api/links`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch links');
        const links = await res.json();
        // Filter links created today
        const todayLinks = links.filter(link => {
          const created = new Date(link.createdAt);
          return created.toISOString().slice(0, 10) === today;
        });
        // Sum clicks and earnings for today
        let todayClicks = 0;
        let todayEarnings = 0;
        links.forEach(link => {
          if (link.clicksByDay && link.clicksByDay[today]) {
            todayClicks += link.clicksByDay[today];
          }
          if (link.earningsByDay && link.earningsByDay[today]) {
            todayEarnings += link.earningsByDay[today];
          }
        });
        setTodayStats({
          clicks: todayClicks,
          earnings: todayEarnings,
          links: todayLinks.length,
        });
      } catch (err) {
        setErrorStats(err.message);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchTodayStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      {/* Main Content */}
      <main className="pt-16 pb-20 md:pt-30 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Icon name="Link" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Create Shortened Link</h1>
                <p className="text-text-secondary">Transform long URLs into monetized short links</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center space-x-2 text-sm">
              <div className={`flex items-center space-x-1 ${currentStep === 'form' ? 'text-primary' : 'text-success'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentStep === 'form' ? 'bg-primary text-white' : 'bg-success text-white'
                }`}>
                  {currentStep === 'form' ? '1' : <Icon name="Check" size={14} />}
                </div>
                <span>Create Link</span>
              </div>
              <div className={`w-8 h-0.5 ${currentStep === 'success' ? 'bg-success' : 'bg-border'}`}></div>
              <div className={`flex items-center space-x-1 ${currentStep === 'success' ? 'text-primary' : 'text-text-secondary'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentStep === 'success' ? 'bg-primary text-white' : 'bg-border text-text-secondary'
                }`}>
                  2
                </div>
                <span>Link Ready</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {currentStep === 'form' && (
                <>
                  {/* Link Creation Form */}
                  <div className="bg-surface rounded-lg border border-border p-6">
                    <LinkCreationForm onLinkCreated={handleLinkCreated} />
                  </div>

                  {/* Link Preview */}
                  {formData.originalUrl && (
                    <LinkPreview 
                      originalUrl={formData.originalUrl} 
                      customAlias={formData.customAlias} 
                    />
                  )}
                </>
              )}

              {currentStep === 'success' && createdLink && (
                <LinkCreatedSuccess 
                  link={createdLink} 
                  onCreateAnother={handleCreateAnother} 
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* {currentStep === 'form' && (
                  <QuickActions onTemplateSelect={handleTemplateSelect} />
                )} */}

                {/* Earnings Info */}
                <div className="bg-surface rounded-lg border border-border p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingUp" size={20} color="var(--color-accent)" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">Earnings Info</h3>
                      <p className="text-sm text-text-secondary">How you earn money</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-accent-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-text-primary">Per Click</p>
                        <p className="text-xs text-text-secondary">Indian traffic</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-accent">₹0.80<sup>*</sup> </p>
                        {/* <p className="text-xs text-text-secondary">avg rate</p> */}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Minimum payout:</span>
                        <span className="font-medium text-text-primary">₹400</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Payment method:</span>
                        <span className="font-medium text-text-primary">UPI</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Payment cycle:</span>
                        <span className="font-medium text-text-primary">Monthly</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-text-primary/40 text-xs"><sup>*</sup><i>Maximum</i></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
               
              </div>
            </div>
          </div>
        </div>
      </main>

      <UserBottomTabs />
    </div>
  );
};

export default LinkCreation;