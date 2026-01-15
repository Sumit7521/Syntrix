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

export function F1Line({ data }) {
  if (!data) return null;

  const chartData = data.map(m => ({
    name: m.name,
    normal: m.normal.f1_score,
    attack: m.attack.f1_score
  }));

  return (
    <div style={{ width: "100%", height: 380 }}>
      {/* Header removed */}

      <ResponsiveContainer>
        <LineChart data={chartData}>
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
             cursor={{ stroke: 'black', strokeWidth: 1, strokeDasharray: '5 5', opacity: 0.5 }}
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }}/>
          <Line 
            type="monotone" 
            dataKey="normal"
            name="Normal"
            stroke="black" 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="attack"
            name="Attack"
            stroke="#9ca3af" 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
