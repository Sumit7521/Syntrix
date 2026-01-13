"use client";

import React from 'react';
import FeatureImportanceChart from "@/components/Charts/FeatureImportanceChart";

export default function FeaturesPage() {
  return (
    <div className="space-y-8">
      <header className="border-b border-gray-100 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-space">Feature Engineering Analysis</h1>
        <p className="text-gray-500">
            Evaluating the predictive power of different network parameters across multiple classifiers.
        </p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
         <FeatureImportanceChart />
      </div>
    </div>
  );
}