"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

import adaData from "@/Data/ada_feature_importance.json";
import dtData from "@/Data/dt_feature_importance.json";
import rfData from "@/Data/rf_feature_importance.json";
import xgbData from "@/Data/xgb_feature_importance.json";

const MODEL_DATA = {
  ada: { name: "AdaBoost", data: adaData },
  dt: { name: "Decision Tree", data: dtData },
  rf: { name: "Random Forest", data: rfData },
  xgb: { name: "XGBoost", data: xgbData }
};

export default function FeatureImportanceChart() {
  const [selectedModel, setSelectedModel] = useState("rf");

  // Get data for selected model
  const currentData = MODEL_DATA[selectedModel].data;

  // Sort by importance (descending) and take top 20
  const chartData = [...currentData]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 20);

  return (
    <div className="w-full">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center mb-6 gap-4">
            <h3 className="text-lg font-semibold text-gray-800">
                Top 20 Feature Importance
            </h3>
            
            <div className="relative">
                <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500 font-medium text-sm"
                >
                    {Object.entries(MODEL_DATA).map(([key, { name }]) => (
                        <option key={key} value={key}>{name}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>

        {/* Chart */}
        <div className="h-[500px] sm:h-[600px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={chartData}
                    margin={{ top: 5, bottom: 5 }} // Increased left margin for y-axis labels
                >
                    {/* <CartesianGrid strokeDasharray="3 3" horizontal={false} /> */}
                    <XAxis type="number" hide />
                    <YAxis 
                        dataKey="feature" 
                        type="category" 
                        width={120}
                        tick={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="importance" barSize={20} radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index < 3 ? '#111827' : '#9ca3af'} /> // Top 3 Black, others Gray
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
