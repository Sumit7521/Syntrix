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

export default function MetricsLine() {
  const data = modelData.models;

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h3>Precision, Recall & F1-score</h3>

      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis domain={[0.9, 1]} />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="precision" />
          <Line type="monotone" dataKey="recall" />
          <Line type="monotone" dataKey="f1_score" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
