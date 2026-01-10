"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import modelData from "@/Data/model_metrics.json";

export default function AccuracyBar() {
  const data = modelData.models;

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h3>Model Accuracy</h3>

      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis domain={[0.9, 1]} />
          <Tooltip />
          <Bar dataKey="accuracy" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
