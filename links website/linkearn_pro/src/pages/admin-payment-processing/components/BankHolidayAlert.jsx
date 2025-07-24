import React from 'react';
import Icon from '../../../components/AppIcon';

const BankHolidayAlert = () => {
  const bankHolidays = [
    { date: "2024-01-26", name: "Republic Day" },
    { date: "2024-03-08", name: "Holi" },
    { date: "2024-03-29", name: "Good Friday" },
    { date: "2024-08-15", name: "Independence Day" },
    { date: "2024-10-02", name: "Gandhi Jayanti" },
    { date: "2024-11-01", name: "Diwali" },
    { date: "2024-12-25", name: "Christmas Day" }
  ];

  const getUpcomingHolidays = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return bankHolidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate >= today && holidayDate <= nextWeek;
    });
  };

  const upcomingHolidays = getUpcomingHolidays();

  if (upcomingHolidays.length === 0) return null;

  return (
    <div className="bg-warning-50 border border-warning rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
        <div className="flex-1">
          <h3 className="font-medium text-warning mb-2">Bank Holiday Alert</h3>
          <p className="text-sm text-text-secondary mb-3">
            Payment processing may be delayed due to upcoming bank holidays:
          </p>
          <div className="space-y-1">
            {upcomingHolidays.map((holiday, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-text-primary font-medium">{holiday.name}</span>
                <span className="text-text-secondary">
                  {new Date(holiday.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-secondary mt-2">
            UPI transactions may experience delays during these periods.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankHolidayAlert;