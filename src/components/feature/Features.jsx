"use client";

import React from 'react';
import FeatureImportanceChart from "@/components/Charts/FeatureImportanceChart";
import { FiBarChart2, FiTarget, FiZap } from "react-icons/fi";
import "./feature.css";

export default function Features() {
  return (
    <div className="feature-container">
      {/* Header */}
      <header className="feature-header">
        <h1 className="feature-title">Feature Engineering Analysis</h1>
        <p className="feature-subtitle">
            Evaluating the predictive power of different network parameters across multiple classifiers.
        </p>
      </header>

      {/* Insight Stats Row */}
      <div className="insights-grid">
         <div className="feature-card-stat">
            <div className="stat-icon-box icon-blue">
                <FiBarChart2 />
            </div>
            <div className="stat-label">Total Features</div>
            <div className="stat-val">41</div>
         </div>
         <div className="feature-card-stat">
            <div className="stat-icon-box icon-purple">
                <FiTarget />
            </div>
            <div className="stat-label">Top Predictor</div>
            <div className="stat-val text-xl">src_bytes</div>
         </div>
         <div className="feature-card-stat">
            <div className="stat-icon-box icon-green">
                <FiZap />
            </div>
            <div className="stat-label">Efficiency</div>
            <div className="stat-val">High</div>
         </div>
      </div>

      {/* Main Chart Area */}
      <div className="chart-container">
         <div className="chart-header">
            <h3 className="chart-title-text">Relative Importance Ranking</h3>
         </div>
         <FeatureImportanceChart />
      </div>
    </div>
  );
}