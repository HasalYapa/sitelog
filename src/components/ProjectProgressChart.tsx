import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const data = [
  { month: 'Jan', planned: 5, actual: 4 },
  { month: 'Feb', planned: 15, actual: 12 },
  { month: 'Mar', planned: 28, actual: 25 },
  { month: 'Apr', planned: 45, actual: 42 },
  { month: 'May', planned: 65, actual: 60 },
  { month: 'Jun', planned: 85, actual: 78 },
  { month: 'Jul', planned: 100, actual: 95 },
];

export function ProjectProgressChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Project S-Curve</h2>
          <p className="text-sm text-slate-500">Planned vs actual cumulative progress</p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} unit="%" />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area
              type="monotone"
              dataKey="planned"
              name="Planned Progress"
              stroke="#94a3b8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPlanned)"
            />
            <Area
              type="monotone"
              dataKey="actual"
              name="Actual Progress"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorActual)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
