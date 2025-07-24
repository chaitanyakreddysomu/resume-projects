import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * UserGrowthChart
 * 
 * Props:
 *   - userGrowthTrends: Array of { month, year, count }
 *   - totalUsers: number (optional, for legend)
 *   - Optionally, you can pass the whole dashboardData object and extract userGrowthTrends
 * 
 * This chart expects userGrowthTrends from the API, e.g.:
 * [
 *   { month: 8, year: 2024, count: 0 },
 *   ...,
 *   { month: 7, year: 2025, count: 3 }
 * ]
 * 
 * The chart allows switching between "Monthly" and "Yearly" views.
 */
const MONTHS = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function getMonthLabel(month, year) {
  // month: 1-12
  return `${MONTHS[month]} '${String(year).slice(-2)}`;
}

function groupByYear(userGrowthTrends) {
  // Returns [{ year: 2024, count: X }, ...]
  const yearMap = {};
  userGrowthTrends.forEach(item => {
    if (!yearMap[item.year]) yearMap[item.year] = 0;
    yearMap[item.year] += item.count;
  });
  return Object.entries(yearMap).map(([year, count]) => ({
    year: Number(year),
    count
  })).sort((a, b) => a.year - b.year);
}

const UserGrowthChart = ({
  userGrowthTrends = [],
  totalUsers
}) => {
  const [view, setView] = useState('monthly'); // 'monthly' or 'yearly'

  // Prepare chart data for monthly view
  const monthlyData = useMemo(() => {
    if (!Array.isArray(userGrowthTrends) || userGrowthTrends.length === 0) return [];
    // Show month as "MMM 'YY" (e.g. Jul '25)
    return userGrowthTrends.map(item => ({
      label: getMonthLabel(item.month, item.year),
      users: item.count
    }));
  }, [userGrowthTrends]);

  // Calculate cumulative users for each month
  const monthlyCumulativeData = useMemo(() => {
    let runningTotal = 0;
    return monthlyData.map((item) => {
      runningTotal += item.users;
      return { ...item, cumulativeUsers: runningTotal };
    });
  }, [monthlyData]);

  // Prepare chart data for yearly view
  const yearlyData = useMemo(() => {
    const grouped = groupByYear(userGrowthTrends);
    return grouped.map(item => ({
      label: String(item.year),
      users: item.count
    }));
  }, [userGrowthTrends]);

  // Calculate cumulative users for each year
  const yearlyCumulativeData = useMemo(() => {
    let runningTotal = 0;
    return yearlyData.map((item) => {
      runningTotal += item.users;
      return { ...item, cumulativeUsers: runningTotal };
    });
  }, [yearlyData]);

  // Select data based on view
  const chartData = view === 'monthly' ? monthlyCumulativeData : yearlyCumulativeData;

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">User Growth Trends</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-text-secondary">New Users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm text-text-secondary">Cumulative Users</span>
          </div>
          <div>
            <select
              className="ml-4 px-2 py-1 border border-border rounded text-sm bg-surface-secondary text-text-primary focus:outline-none"
              value={view}
              onChange={e => setView(e.target.value)}
              aria-label="Select view: monthly or yearly"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>
      <div className="w-full h-80" aria-label="User Growth Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="label"
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis
              stroke="var(--color-text-secondary)"
              fontSize={12}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)'
              }}
              formatter={(value, name) => {
                if (name === 'users') return [value, 'New Users'];
                if (name === 'cumulativeUsers') return [value, 'Cumulative Users'];
                return [value, name];
              }}
              labelFormatter={label => (view === 'monthly' ? label : `Year ${label}`)}
            />
            <Line
              type="monotone"
              dataKey="users"
              name="New Users"
              stroke="var(--color-primary)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="cumulativeUsers"
              name="Cumulative Users"
              stroke="var(--color-success)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowthChart;