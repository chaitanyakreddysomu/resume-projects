import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const EarningsDistribution = () => {
  const data = [
    { name: 'Social Media', value: 45, amount: '₹2,25,000' },
    { name: 'Blog Posts', value: 30, amount: '₹1,50,000' },
    { name: 'Email Marketing', value: 15, amount: '₹75,000' },
    { name: 'Direct Sharing', value: 10, amount: '₹50,000' }
  ];

  const COLORS = [
    'var(--color-primary)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-secondary)'
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary">{data.name}</p>
          <p className="text-sm text-text-secondary">{data.value}% • {data.amount}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Earnings Distribution</h3>
        <div className="text-sm text-text-secondary">Total: ₹5,00,000</div>
      </div>
      
      <div className="w-full h-80" aria-label="Earnings Distribution Chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }} className="text-sm">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index] }}
            ></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-text-primary">{item.name}</div>
              <div className="text-xs text-text-secondary">{item.amount}</div>
            </div>
            <div className="text-sm font-medium text-text-primary">{item.value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarningsDistribution;