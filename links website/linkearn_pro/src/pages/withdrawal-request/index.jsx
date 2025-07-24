import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import UserBottomTabs from '../../components/ui/UserBottomTabs';
import Icon from '../../components/AppIcon';
import WithdrawalHistory from './components/WithdrawalHistory';
import BalanceCard from './components/BalanceCard';
import API_BASE_URL from 'utils/config';
const WithdrawalRequest = () => {
  const [userBalance, setUserBalance] = useState({
    availableBalance: 0,
    pendingBalance: 0,
    totalWithdrawn: 0,
    minimumWithdrawal: 400,
    processingFee: 2.5,
    currency: 'INR'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user balance and earnings data
  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        
        if (!token) {
          throw new Error('User not authenticated');
        }

        // Fetch user earnings
        const earningsResponse = await fetch(`${API_BASE_URL}/api/user/earnings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!earningsResponse.ok) {
          const errorData = await earningsResponse.json();
          throw new Error(errorData.error || 'Failed to fetch earnings data');
        }

        const earningsData = await earningsResponse.json();
        console.log('Earnings data:', earningsData);

        // Fetch user withdrawals to calculate pending balance
        const withdrawalsResponse = await fetch(`${API_BASE_URL}/api/withdrawal/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!withdrawalsResponse.ok) {
          const errorData = await withdrawalsResponse.json();
          throw new Error(errorData.error || 'Failed to fetch withdrawal data');
        }

        const withdrawalsData = await withdrawalsResponse.json();
        console.log('Withdrawals data:', withdrawalsData);

        // Calculate pending balance from requested withdrawals
        const pendingWithdrawals = withdrawalsData.filter(w => w.status === 'requested');
        const pendingBalance = pendingWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

        // Calculate total withdrawn amount from completed withdrawals
        const completedWithdrawals = withdrawalsData.filter(w => w.status === 'completed');
        const totalWithdrawn = completedWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

        // Calculate available balance: total earnings - pending - withdrawn
        const totalEarnings = earningsData.total || 0;
        const availableBalance = Math.max(0, totalEarnings - pendingBalance - totalWithdrawn);

        console.log('Balance calculation:', {
          totalEarnings,
          pendingBalance,
          totalWithdrawn,
          availableBalance
        });

        setUserBalance({
          availableBalance: availableBalance,
          pendingBalance: pendingBalance,
          totalWithdrawn: totalWithdrawn,
          minimumWithdrawal: 400, // Minimum withdrawal amount
          processingFee: 2.5, // Processing fee percentage
          currency: 'INR'
        });
      } catch (err) {
        console.error('Error fetching user balance:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBalance();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <main className="pt-16 pb-20 md:pt-20 md:pb-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-text-secondary">Loading withdrawal data...</p>
              </div>
            </div>
          </div>
        </main>
        <UserBottomTabs />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <main className="pt-16 pb-20 md:pt-20 md:pb-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertCircle" size={32} color="var(--color-error)" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                Failed to load withdrawal data
              </h3>
              <p className="text-error mb-4">{error}</p>
              <button 
                className="px-4 py-2 border border-border rounded-md hover:bg-surface-secondary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <UserBottomTabs />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <main className="pt-16 pb-20 md:pt-20 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Withdrawal History
            </h1>
            <p className="text-text-secondary">
              View your withdrawal history and transaction details
            </p>
          </div>

          {/* Balance Overview */}
          <div className="mb-6">
            <BalanceCard 
              balance={userBalance}
              isWithdrawalWindow={false}
            />
          </div>

          {/* Withdrawal History */}
          <div className="space-y-6">
            <WithdrawalHistory />
          </div>

          {/* Help Section - Desktop Only */}
          <div className="hidden md:block mt-8 p-6 bg-surface border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Withdrawal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-text-primary mb-2">Processing Timeline</h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• UPI transfers: 24-48 hours</li>
                  <li>• Bank holidays may cause delays</li>
                  <li>• Weekend requests process on Monday</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-2">Requirements</h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Valid UPI ID required</li>
                  <li>• <b className='bold'>Minimum withdrawal:</b>  ₹{userBalance.minimumWithdrawal}</li>
                  {/* <li>• Processing fee: {userBalance.processingFee}%</li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <UserBottomTabs />
    </div>
  );
};

export default WithdrawalRequest;