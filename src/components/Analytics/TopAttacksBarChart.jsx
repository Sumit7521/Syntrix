"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { attack: "neptune", count: 41214 },
  { attack: "smurf", count: 28079 },
  { attack: "guess_passwd", count: 1201 },
  { attack: "satan", count: 3633 },
  { attack: "ipsweep", count: 3599 },
].sort((a, b) => b.count - a.count); // Sort descending

export default function TopAttacksBarChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="attack" 
            type="category" 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#6b7280", textTransform: 'capitalize' }}
            width={80}
          />
          <Tooltip
             cursor={{ fill: '#f9fafb' }}
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
             formatter={(value) => [value.toLocaleString(), 'Count']}
             labelStyle={{ textTransform: 'capitalize', fontWeight: 600, color: '#111827' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? 'black' : '#9ca3af'} /> // Top attack is black, others gray
             ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
