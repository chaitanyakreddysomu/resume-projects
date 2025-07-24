import React from 'react';
import Icon from '../../../components/AppIcon';

const WithdrawalTimer = ({ isWithdrawalWindow, timeRemaining }) => {
  const formatTimeRemaining = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  if (!timeRemaining) return null;

  const time = formatTimeRemaining(timeRemaining);

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      {isWithdrawalWindow ? (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold text-success">
              Withdrawal Window Active
            </h2>
          </div>
          
          <p className="text-text-secondary mb-6">
            Submit your withdrawal requests before the window closes
          </p>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="bg-success-50 rounded-lg p-3 mb-2">
                <div className="text-2xl font-bold text-success font-data">
                  {String(time.days).padStart(2, '0')}
                </div>
              </div>
              <div className="text-sm text-text-secondary">Days</div>
            </div>
            <div className="text-center">
              <div className="bg-success-50 rounded-lg p-3 mb-2">
                <div className="text-2xl font-bold text-success font-data">
                  {String(time.hours).padStart(2, '0')}
                </div>
              </div>
              <div className="text-sm text-text-secondary">Hours</div>
            </div>
            <div className="text-center">
              <div className="bg-success-50 rounded-lg p-3 mb-2">
                <div className="text-2xl font-bold text-success font-data">
                  {String(time.minutes).padStart(2, '0')}
                </div>
              </div>
              <div className="text-sm text-text-secondary">Minutes</div>
            </div>
            <div className="text-center">
              <div className="bg-success-50 rounded-lg p-3 mb-2">
                <div className="text-2xl font-bold text-success font-data">
                  {String(time.seconds).padStart(2, '0')}
                </div>
              </div>
              <div className="text-sm text-text-secondary">Seconds</div>
            </div>
          </div>
          
          <div className="bg-success-50 border border-success-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="CheckCircle" size={20} color="var(--color-success)" />
              <span className="text-sm text-success font-medium">
                Ready to accept withdrawal requests
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold text-warning">
              Next Withdrawal Window
            </h2>
          </div>
          
          <p className="text-text-secondary mb-6">
            Withdrawal requests will be available in the last 3 days of the month
          </p>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="bg-warning-50 rounded-lg p-3 mb-2">
                <div className="text-2xl font-bold text-warning font-data">
                  {String(time.days).padStart(2, '0')}
                </div>
              </div>
              <div className="text-sm text-text-secondary">Days</div>
            </div>
            <div className="text-center">
              <div className="bg-warning-50 rounded-lg p-3 mb-2">
                <div className="text-2xl font-bold text-warning font-data">
                  {String(time.hours).padStart(2, '0')}
                </div>
              </div>
              <div className="text-sm text-text-secondary">Hours</div>
            </div>
            <div className="text-center">
              <div className="bg-warning-50 rounded-lg p-3 mb-2">
                <div className="text-2xl font-bold text-warning font-data">
                  {String(time.minutes).padStart(2, '0')}
                </div>
              </div>
              <div className="text-sm text-text-secondary">Minutes</div>
            </div>
            <div className="text-center">
              <div className="bg-warning-50 rounded-lg p-3 mb-2">
                <div className="text-2xl font-bold text-warning font-data">
                  {String(time.seconds).padStart(2, '0')}
                </div>
              </div>
              <div className="text-sm text-text-secondary">Seconds</div>
            </div>
          </div>
          
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="Clock" size={20} color="var(--color-warning)" />
              <span className="text-sm text-warning font-medium">
                Withdrawal window opens in the last 3 days of each month
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalTimer;