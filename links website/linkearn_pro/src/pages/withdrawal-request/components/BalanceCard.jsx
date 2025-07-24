import React from 'react';
import Icon from '../../../components/AppIcon';

const BalanceCard = ({ balance, isWithdrawalWindow }) => {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Available Balance</h2>
        <Icon name="Wallet" size={24} color="white" />
      </div>
      
      <div className="mb-6">
        <div className="text-3xl font-bold mb-1 font-data">
          ₹{balance?.availableBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        <div className="text-primary-100 text-sm">
          Ready for withdrawal
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-sm text-primary-100 mb-1">Pending Balance</div>
          <div className="font-semibold">
            ₹{balance?.pendingBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-sm text-primary-100 mb-1">Total Withdrawn</div>
          <div className="font-semibold">
            ₹{balance?.totalWithdrawn?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-sm text-primary-100 mb-1">Minimum Withdrawal</div>
          <div className="font-semibold">
            ₹{balance?.minimumWithdrawal?.toLocaleString('en-IN')}
          </div>
        </div>
      </div>
{/*       
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-sm text-primary-100 mb-1">Processing Fee</div>
          <div className="font-semibold">
            {balance?.processingFee}%
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-sm text-primary-100 mb-1">Currency</div>
          <div className="font-semibold">
            {balance?.currency || 'INR'}
          </div>
        </div>
      </div> */}
      
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isWithdrawalWindow ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
          <span className="text-sm text-primary-100">
            Withdrawal Status: {isWithdrawalWindow ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;