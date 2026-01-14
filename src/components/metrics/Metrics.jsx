"use client";

import { useState } from "react";
import AccuracyBar from "@/components/Charts/AccuracyBar";
import { F1Line } from "@/components/Charts/F1Line";
import { PrecisionLine } from "@/components/Charts/PrecisionLine";
import { RecallLine } from "@/components/Charts/RecallLine";
import modelData from "@/Data/model_metrics.json";
import "./metrics.css";

export default function Metrics() {
  const allModels = modelData.models;
  // Initialize with first two models
  const [selectedIds, setSelectedIds] = useState(allModels.slice(0, 2).map(m => m.name));

  const toggleModel = (modelName) => {
    if (selectedIds.includes(modelName)) {
      if (selectedIds.length <= 2) return; // Minimum 2 rule
      setSelectedIds(selectedIds.filter(id => id !== modelName));
    } else {
      setSelectedIds([...selectedIds, modelName]);
    }
  };

  const filteredData = allModels.filter(m => selectedIds.includes(m.name));

  return (
    <div className="metrics-container">
      <header className="metrics-header">
        <h1 className="metrics-title">Model Performance</h1>
        <p className="metrics-subtitle">Comparative metrics across all deployed detection models.</p>
      </header>

      {/* Model Selection Panel */}
      <div className="selection-panel">
        <h3 className="panel-label">Select Models to Compare (Min 2)</h3>
        <div className="button-group">
            {allModels.map(model => {
                const isSelected = selectedIds.includes(model.name);
                const isDisabled = isSelected && selectedIds.length <= 2;
                return (
                    <button
                        key={model.name}
                        onClick={() => toggleModel(model.name)}
                        disabled={isDisabled}
                        className={`model-btn ${isSelected ? 'selected' : 'unselected'}`}
                    >
                        {model.name}
                        {isSelected && <span className="check-icon">✓</span>}
                    </button>
                )
            })}
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
            <h3 className="chart-title">Accuracy Comparison</h3>
            <AccuracyBar data={filteredData} />
        </div>
        <div className="chart-card">
            <h3 className="chart-title">Precision Trends</h3>
            <PrecisionLine data={filteredData} />
        </div>
        <div className="chart-card">
             <h3 className="chart-title">Recall Analysis</h3>
            <RecallLine data={filteredData} />
        </div>
        <div className="chart-card">
            <h3 className="chart-title">F1 Score Distribution</h3>
            <F1Line data={filteredData} />
        </div>
      </div>
    </div>
  );
}
