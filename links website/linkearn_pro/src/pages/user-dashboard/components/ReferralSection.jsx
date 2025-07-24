import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import API_BASE_URL from 'utils/config';

const ReferralSection = () => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      
      if (!token) {
        console.log('No token found');
        return;
      }

      console.log('Fetching referral data...');
      const response = await fetch(`${API_BASE_URL}/api/auth/referral-info`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Referral data received:', data);
        setReferralData(data);
        console.log('Referral data received:', data);
      } else {
        const errorText = await response.text();
        console.error('API error:', errorText);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferralLink = async () => {
    if (data?.referralUrl) {
      try {
        await navigator.clipboard.writeText(data.referralUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 4
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // Fallback data for testing
  const fallbackData = {
    referralUrl: 'http://localhost:3000/refer/test-user-id',
    referredUsersCount: 0,
    totalReferralEarnings: 0,
    totalReferredEarnings: 0,
    referredUsers: []
  };

  const data = referralData || fallbackData;

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Referral Program</h3>
        <Icon name="Users" className="text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-secondary rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {data.referredUsersCount || 0}
          </div>
          <div className="text-sm text-text-secondary">Referred Users</div>
        </div>
        
        
        
        {/* <div className="bg-surface-secondary rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(data.totalReferredEarnings || 0)}
          </div>
          <div className="text-sm text-text-secondary">Total Referred Earnings</div>
        </div> */}
        <div className="bg-surface-secondary rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(data.totalReferralEarnings || 0)}
          </div>
          <div className="text-sm text-text-secondary">Earnings from Referrals</div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Your Referral Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={data.referralUrl || ''}
            readOnly
            className="flex-1 border border-border rounded px-3 py-2 text-sm bg-surface-secondary"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleCopyReferralLink}
            iconName={copied ? "Check" : "Copy"}
            className="w-9 h-9 flex items-center justify-center mx-auto"
          >
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </Button>



        </div>
        <p className="text-xs text-text-secondary mt-2">
          Share this link with friends and earn 5% of their earnings!
        </p>
      </div>

      {data?.referredUsers && data.referredUsers.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-text-primary mb-4">Referred Users</h4>
          <div className="space-y-3">
            {data.referredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <div>
                  <div className="font-medium text-text-primary">{user.name}</div>
                  <div className="text-sm text-text-secondary">{user.email}</div>
                  <div className="text-xs text-text-secondary">
                    Joined: {new Date(user.joinedAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      timeZone: 'Asia/Kolkata'
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">
                    {formatCurrency(user.earningsFromReferral)}
                  </div>
                  <div className="text-xs text-text-secondary">
                    Your earnings
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!data?.referredUsers || data.referredUsers.length === 0) && (
        <div className="text-center py-8">
          <Icon name="Users" className="text-gray-400 mx-auto mb-4" size={48} />
          <p className="text-text-secondary mb-4">No referred users yet</p>
          <p className="text-sm text-text-secondary">
            Share your referral link to start earning from your friends' success!
          </p>
        </div>
      )}


    </div>
  );
};

export default ReferralSection; 