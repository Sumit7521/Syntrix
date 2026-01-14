"use client";

import React from 'react';
import CorrelationHeatmap from "@/components/Charts/CorrelationHeatmap";

// Analytics Components
import InsightCard from "@/components/Analytics/InsightCard";
import ClassDistributionPieChart from "@/components/Analytics/ClassDistributionPieChart";
import TopAttacksBarChart from "@/components/Analytics/TopAttacksBarChart";
import FeatureDistributionChart from "@/components/Analytics/FeatureDistributionChart";
import ModelPerformanceTable from "@/components/Analytics/ModelPerformanceTable";

// Icons
import { FiDatabase, FiShield, FiAlertTriangle, FiActivity, FiCpu, FiTrendingUp } from "react-icons/fi";
import "./heatmap.css";

const Heatmap = () => {
  return (
    <div className="heatmap-container">
      <header className="heatmap-header">
        <h1 className="heatmap-title">All Models Analysis</h1>
        <p className="heatmap-subtitle">Deep dive into dataset insights, feature correlations, and model performance metrics.</p>
      </header>

      {/* 1. Dataset Overview */}
      <section>
        <h2 className="section-title">
            <FiDatabase className="section-icon-blue"/> Dataset Overview
        </h2>
        <div className="overview-grid">
            <InsightCard 
                title="Total Records" 
                value="125,973" 
                icon={<FiDatabase size={20} />} 
                delta={{ value: "+12%", isPositive: true }}
            />
            <InsightCard 
                title="Normal Traffic" 
                value="53%" 
                icon={<FiShield size={20} />}
            />
            <InsightCard 
                title="Attack Traffic" 
                value="47%" 
                icon={<FiAlertTriangle size={20} />}
                delta={{ value: "+2.4%", isPositive: false }}
            />
            <InsightCard 
                title="Features Used" 
                value="41" 
                icon={<FiCpu size={20} />}
            />
        </div>
      </section>

      {/* 2. Distributions Row */}
      <section className="dual-column-section">
        {/* Class Distribution */}
        <div className="card">
            <h3 className="card-title">Class Distribution</h3>
            <p className="card-subtitle">Split between normal and malicious network traffic.</p>
            <ClassDistributionPieChart />
            <div className="insight-box insight-yellow">
                <span className="insight-label">Insight:</span> The dataset exhibits a near-balanced class distribution, limiting bias towards the majority class and justifying the use of accuracy as a primary metric.
            </div>
        </div>

        {/* Top Attack Types */}
        <div className="card">
            <h3 className="card-title">Top Attack Types</h3>
            <p className="card-subtitle">Most frequent intrusion categories in the dataset.</p>
            <TopAttacksBarChart />
            <div className="insight-box insight-red">
                <span className="insight-label">Insight:</span> <span className="font-mono">neptune</span> (DoS) and <span className="font-mono">smurf</span> (DoS) are the dominant attack vectors, indicating high prevalence of Denial of Service attempts.
            </div>
        </div>
      </section>

      {/* 4. Feature Distribution Comparison */}
      <section className="card">
        <h3 className="card-title">Feature Distribution: Normal vs Attack</h3>
        <p className="card-subtitle">Comparing average values of key features across classes to understand separability.</p>
        <FeatureDistributionChart />
        <div className="insight-box insight-gray">
            <span className="insight-label">Insight:</span> Attack traffic shows significantly higher average <span className="font-mono">src_bytes</span> and <span className="font-mono">count</span> compared to normal traffic, validating their high feature importance scores.
        </div>
      </section>

      {/* 5. Correlation Matrix */}
      <section className="card">
        <h3 className="card-title">Feature Correlation Matrix</h3>
        <p className="card-subtitle">
            Analysis of the relationships between different network traffic features.   
        </p>
        <CorrelationHeatmap />
        <div className="insight-box insight-purple">
             <span className="insight-label">Insight:</span> High correlation observed between <span className="font-mono">srv_count</span> and <span className="font-mono">same_srv_rate</span>, indicating repetitive patterns in service requests which are typical in automated attacks.
         </div>
      </section>

      {/* 6. Model Performance Summary */}
      <section className="card">
        <h3 className="section-title">
            <FiActivity className="section-icon-green"/> Model Performance Summary
        </h3>
        <ModelPerformanceTable />
        <div className="performance-footer">
            <p className="footer-text">* Evaluated on NSL-KDD Test Set (22,544 records)</p>
        </div>
      </section>

      {/* 7. Quick Prediction Insight (Static Demo) */}
      <section className="prediction-banner">
        <div className="banner-content">
            <div>
                <h3 className="banner-title">
                    <FiTrendingUp/> Live Prediction Insight
                </h3>
                <p className="banner-text">
                    Real-time analysis of incoming traffic packet.
                </p>
                <div className="badge-group">
                    <span className="glass-badge">Method: Ensemble (RF + XGB)</span>
                    <span className="glass-badge">Inference Time: 12ms</span>
                </div>
            </div>
            
            <div className="prediction-card">
                <div className="pred-card-header">
                    <span className="pred-label">Prediction</span>
                    <span className="status-badge">MALICIOUS</span>
                </div>
                <h4 className="attack-type-title">DoS Attack</h4>
                <p className="confidence-text">Confidence Score: <strong className="confidence-val">99.2%</strong></p>
                
                <div className="factors-section">
                    <p className="factors-title">Top Contributing Factors:</p>
                    <div className="factor-badges">
                        <span className="factor-badge">src_bytes</span>
                        <span className="factor-badge">service</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

    </div>
  )
}

export default Heatmap;