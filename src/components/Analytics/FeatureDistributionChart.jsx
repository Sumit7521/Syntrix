"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'src_bytes (Avg)',
    Normal: 420,
    Attack: 1220,
  },
  {
    name: 'dst_bytes (Avg)',
    Normal: 2100,
    Attack: 580, // Attackers often send small packets or just flood
  },
  {
    name: 'count (Avg)',
    Normal: 12,
    Attack: 180, // High count typical of DoS
  }
];

export default function FeatureDistributionChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6"/>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280"}} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280"}}/>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            cursor={{ fill: '#f9fafb' }}
          />
          <Legend />
          <Bar dataKey="Normal" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
          <Bar dataKey="Attack" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
