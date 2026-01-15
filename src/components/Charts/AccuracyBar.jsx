"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useState, useEffect } from "react";

export default function AccuracyBar({ data }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!data) return null;

  const shouldRotate = (isMobile && data.length >= 3) || data.length >= 5;

  return (
    <div className="w-full h-[300px] md:h-[380px]">
      <ResponsiveContainer>
        <BarChart data={data}>
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
          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          <Bar dataKey="accuracy" name="Accuracy" fill="black" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
