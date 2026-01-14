"use client";

import React from 'react';
import FeatureImportanceChart from "@/components/Charts/FeatureImportanceChart";
import "./feature.css";

export default function Features() {
  return (
    <div className="feature-container">
      <header className="feature-header">
        <h1 className="feature-title">Feature Engineering Analysis</h1>
        <p className="feature-subtitle">
            Evaluating the predictive power of different network parameters across multiple classifiers.
        </p>
      </header>

      <div className="chart-container">
         <FeatureImportanceChart />
      </div>
    </div>
  );
}