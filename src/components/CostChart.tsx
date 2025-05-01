import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CostChartProps {
  totalCost: number;
  projectedValue: number;
}

const CostChart: React.FC<CostChartProps> = ({ totalCost, projectedValue }) => {
  const data = [
    {
      name: 'Investment vs. Return',
      'Investment Cost': totalCost,
      'Projected Value': projectedValue,
    },
  ];

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-medium text-gray-900 mb-1">{`${payload[0].name}: ${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(payload[0].value)}`}</p>
          <p className="font-medium text-gray-900">{`${payload[1].name}: ${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(payload[1].value)}`}</p>
          
          {payload[1].value > payload[0].value && (
            <p className="text-sm text-green-600 mt-2 font-medium">
              +{new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(payload[1].value - payload[0].value)} potential gain
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Investment vs. Return Analysis</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barGap={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" hide />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Bar 
              dataKey="Investment Cost" 
              fill="url(#colorInvestment)" 
              radius={[8, 8, 0, 0]} 
              barSize={60}
              name="Investment Cost"
            />
            <Bar 
              dataKey="Projected Value" 
              fill="url(#colorValue)" 
              radius={[8, 8, 0, 0]} 
              barSize={60}
              name="Projected Value"
            />
            <defs>
              <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CostChart;
