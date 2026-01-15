"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AccuracyBar({ data }) {
  if (!data) return null;

  return (
    <div style={{ width: "100%", height: 380 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: 'bold' }} 
            axisLine={false} 
            tickLine={false} 
            angle={data.length >= 5 ? -45 : 0}
            textAnchor={data.length >= 5 ? "end" : "middle"}
            interval={0}
            height={data.length >= 5 ? 100 : 30}
          />
          <YAxis domain={[0.9, 1]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip 
            cursor={{ fill: '#f3f4f6' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Bar dataKey="accuracy" name="Accuracy" fill="black" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
