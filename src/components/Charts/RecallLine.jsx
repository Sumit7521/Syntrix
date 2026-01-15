"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useState, useEffect } from "react";

export function RecallLine({ data }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!data) return null;

  const chartData = data.map(m => ({
    name: m.name,
    normal: m.normal.recall,
    attack: m.attack.recall
  }));

  const shouldRotate = (isMobile && data.length >= 3) || data.length >= 5;

  return (
    <div className="w-full h-[300px] md:h-[380px]">
      {/* Header removed */}

      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: 'bold' }} 
            axisLine={false} 
            tickLine={false}
            angle={shouldRotate ? -45 : 0}
            textAnchor={shouldRotate ? "end" : "middle"}
            interval={0}
            height={shouldRotate ? 100 : 30}
          />
          <YAxis domain={[0.9, 1]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
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
