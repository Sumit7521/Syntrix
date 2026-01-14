"use client";

import React from 'react';
import CorrelationHeatmap from "@/components/Charts/CorrelationHeatmap";
import FeatureImportanceChart from "@/components/Charts/FeatureImportanceChart";

// Analytics Components
import InsightCard from "@/components/Analytics/InsightCard";
import ClassDistributionPieChart from "@/components/Analytics/ClassDistributionPieChart";
import TopAttacksBarChart from "@/components/Analytics/TopAttacksBarChart";
import FeatureDistributionChart from "@/components/Analytics/FeatureDistributionChart";
import ModelPerformanceTable from "@/components/Analytics/ModelPerformanceTable";

// Icons
import { FiDatabase, FiShield, FiAlertTriangle, FiActivity, FiCpu, FiTrendingUp } from "react-icons/fi";

const ModelsPage = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <header className="border-b border-gray-100 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-space">All Models Analysis</h1>
        <p className="text-gray-500">Deep dive into dataset insights, feature correlations, and model performance metrics.</p>
      </header>

      {/* 1. Dataset Overview */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiDatabase className="text-blue-500"/> Dataset Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Class Distribution</h3>
            <p className="text-sm text-gray-500 mb-6">Split between normal and malicious network traffic.</p>
            <ClassDistributionPieChart />
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                <span className="font-semibold">Insight:</span> The dataset exhibits a near-balanced class distribution, limiting bias towards the majority class and justifying the use of accuracy as a primary metric.
            </div>
        </div>

        {/* Top Attack Types */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Top Attack Types</h3>
            <p className="text-sm text-gray-500 mb-6">Most frequent intrusion categories in the dataset.</p>
            <TopAttacksBarChart />
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100 text-sm text-red-800">
                <span className="font-semibold">Insight:</span> <span className="font-mono">neptune</span> (DoS) and <span className="font-mono">smurf</span> (DoS) are the dominant attack vectors, indicating high prevalence of Denial of Service attempts.
            </div>
        </div>
      </section>

      {/* 3. Feature Importance */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
         <h3 className="text-lg font-semibold mb-2 text-gray-800">Feature Importance Analysis</h3>
         <p className="text-sm text-gray-500 mb-6">Key features contributing to model decision making.</p>
         <FeatureImportanceChart />
         <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
             <span className="font-semibold">Insight:</span> Features such as <span className="font-mono font-semibold">src_bytes</span>, <span className="font-mono font-semibold">dst_bytes</span>, and <span className="font-mono font-semibold">count</span> consistently rank high across models. This confirms that traffic volume and connection frequency are critical indicators of malicious activity.
         </div>
      </section>

      {/* 4. Feature Distribution Comparison */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Feature Distribution: Normal vs Attack</h3>
        <p className="text-sm text-gray-500 mb-6">Comparing average values of key features across classes to understand separability.</p>
        <FeatureDistributionChart />
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700">
            <span className="font-semibold">Insight:</span> Attack traffic shows significantly higher average <span className="font-mono">src_bytes</span> and <span className="font-mono">count</span> compared to normal traffic, validating their high feature importance scores.
        </div>
      </section>

      {/* 5. Correlation Matrix */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Feature Correlation Matrix</h3>
        <p className="text-sm text-gray-500 mb-4">
            Analysis of the relationships between different network traffic features.   
        </p>
        <CorrelationHeatmap />
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100 text-sm text-purple-800">
             <span className="font-semibold">Insight:</span> High correlation observed between <span className="font-mono">srv_count</span> and <span className="font-mono">same_srv_rate</span>, indicating repetitive patterns in service requests which are typical in automated attacks.
         </div>
      </section>

      {/* 6. Model Performance Summary */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <FiActivity className="text-green-500"/> Model Performance Summary
        </h3>
        <ModelPerformanceTable />
        <div className="mt-4 flex justify-end">
            <p className="text-xs text-gray-400 italic">* Evaluated on NSL-KDD Test Set (22,544 records)</p>
        </div>
      </section>

      {/* 7. Quick Prediction Insight (Static Demo) */}
      <section className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-2xl text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <FiTrendingUp/> Live Prediction Insight
                </h3>
                <p className="text-indigo-100 opacity-90 mb-4">
                    Real-time analysis of incoming traffic packet.
                </p>
                <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm border border-white/10">Method: Ensemble (RF + XGB)</span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm border border-white/10">Inference Time: 12ms</span>
                </div>
            </div>
            
            <div className="bg-white text-gray-800 p-6 rounded-xl shadow-xl min-w-[300px] border-l-4 border-red-500">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prediction</span>
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">MALICIOUS</span>
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-1">DoS Attack</h4>
                <p className="text-sm text-gray-500 mb-3">Confidence Score: <strong className="text-gray-900">99.2%</strong></p>
                
                <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-400 mb-1">Top Contributing Factors:</p>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-semibold">src_bytes</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-semibold">service</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

    </div>
  )
}

export default ModelsPage;