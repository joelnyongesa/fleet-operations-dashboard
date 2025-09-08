import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

function BarChartTemplate({ chartData, xKey, yKey, title }) {
  return (
    <div className="h-[300px] w-full">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey} fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartTemplate;
