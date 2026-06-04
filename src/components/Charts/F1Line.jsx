"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useState, useEffect } from "react";

export function F1Line({ data, isMulticlass = false }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!data) return null;

  const chartData = data.map(m => {
    if (isMulticlass) {
      return {
        name: m.name,
        normal: m.normal?.f1_score ?? m.overall.f1_score,
        dos: m.DoS?.f1_score ?? m.overall.f1_score,
        probe: m.Probe?.f1_score ?? m.overall.f1_score,
        r2l: m.R2L?.f1_score ?? m.overall.f1_score,
        u2r: m.U2R?.f1_score ?? m.overall.f1_score,
      };
    }
    return {
      name: m.name,
      normal: m.normal?.f1_score ?? m.overall.f1_score,
      attack: m.attack?.f1_score ?? m.overall.f1_score
    };
  });

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
          <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip cursor={false} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          <Legend wrapperStyle={{ paddingTop: '10px' }}/>
          <Line type="monotone" dataKey="normal" name="Normal" stroke="black" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          {!isMulticlass && (
            <Line type="monotone" dataKey="attack" name="Attack" stroke="#9ca3af" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          )}
          {isMulticlass && (
            <>
              <Line type="monotone" dataKey="dos" name="DoS" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="probe" name="Probe" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="r2l" name="R2L" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="u2r" name="U2R" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
