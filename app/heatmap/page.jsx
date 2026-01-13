"use client";

import React from 'react';
import CorrelationHeatmap from "@/components/Charts/CorrelationHeatmap";

const ModelsPage = () => {
  return (
    <div className="space-y-8">
      <header className="border-b border-gray-100 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-space">All Models Analysis</h1>
        <p className="text-gray-500">Deep dive into feature correlations and model architectures.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6 text-gray-800">Feature Correlation Matrix</h3>
        <p className="text-sm text-gray-500 mb-4">
            Analysis of the relationships between different network traffic features used by our models.
            Strong correlations (red/blue) indicate potential redundancy or high predictive power.
        </p>
        <CorrelationHeatmap />
      </div>
    </div>
  )
}

export default ModelsPage;