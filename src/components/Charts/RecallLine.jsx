"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export function RecallLine({ data }) {
  if (!data) return null;

  const chartData = data.map(m => ({
    name: m.name,
    normal: m.normal.recall,
    attack: m.attack.recall
  }));

  return (
    <div style={{ width: "100%", height: 350 }}>
      {/* Header removed */}

      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0.9, 1]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip 
             cursor={{ stroke: '#e5e7eb' }}
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }}/>
          <Line 
            type="monotone" 
            dataKey="normal" 
            stroke="#14b8a6" 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="attack" 
            stroke="#f43f5e" 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
