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

import modelData from "@/Data/model_metrics.json";

export function F1Line() {
  const data = modelData.models.map(m => ({
    name: m.name,
    normal: m.normal.f1_score,
    attack: m.attack.f1_score
  }));

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h3>F1-Score (Normal vs Attack)</h3>

      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis domain={[0.9, 1]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="normal" />
          <Line type="monotone" dataKey="attack" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
