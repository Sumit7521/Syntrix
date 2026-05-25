"use client";

import { useState } from "react";
import AccuracyBar from "@/components/Charts/AccuracyBar";
import { F1Line } from "@/components/Charts/F1Line";
import { PrecisionLine } from "@/components/Charts/PrecisionLine";
import { RecallLine } from "@/components/Charts/RecallLine";
import modelData from "@/Data/model_metrics.json";
import "./metrics.css";

export default function Metrics() {
  const binaryModels = modelData.models;
  const multiModels = modelData.multiclass_models || [];
  
  const [classificationType, setClassificationType] = useState('binary');
  
  // Separate selection states for binary and multiclass
  const [selectedBinaryIds, setSelectedBinaryIds] = useState(binaryModels.slice(0, 2).map(m => m.name));
  const [selectedMultiIds, setSelectedMultiIds] = useState(multiModels.slice(0, 2).map(m => m.name));

  const isBinary = classificationType === 'binary';
  const currentModels = isBinary ? binaryModels : multiModels;
  const currentSelectedIds = isBinary ? selectedBinaryIds : selectedMultiIds;

  const toggleModel = (modelName) => {
    if (currentSelectedIds.includes(modelName)) {
      if (currentSelectedIds.length <= 2) return; // Minimum 2 rule
      if (isBinary) {
        setSelectedBinaryIds(selectedBinaryIds.filter(id => id !== modelName));
      } else {
        setSelectedMultiIds(selectedMultiIds.filter(id => id !== modelName));
      }
    } else {
      if (isBinary) {
        setSelectedBinaryIds([...selectedBinaryIds, modelName]);
      } else {
        setSelectedMultiIds([...selectedMultiIds, modelName]);
      }
    }
  };

  const filteredData = currentModels.filter(m => currentSelectedIds.includes(m.name));

  return (
    <div className="metrics-container">
      <header className="metrics-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="metrics-title">Model Performance</h1>
          <p className="metrics-subtitle">Comparative metrics across all deployed detection models.</p>
        </div>
        
        <div className="classification-toggle" style={{ marginBottom: 0 }}>
          <button 
             className={`toggle-btn ${classificationType === 'binary' ? 'active' : ''}`}
             onClick={() => setClassificationType('binary')}
          >
             Binary
          </button>
          <button 
             className={`toggle-btn ${classificationType === 'multiclass' ? 'active' : ''}`}
             onClick={() => setClassificationType('multiclass')}
          >
             Multiclass
          </button>
        </div>
      </header>

      {/* Model Selection Panel */}
      <div className="selection-panel">
        <h3 className="panel-label">Select Models to Compare (Min 2) - {isBinary ? "Binary" : "Multiclass"}</h3>
        <div className="button-group">
            {currentModels.map(model => {
                const isSelected = currentSelectedIds.includes(model.name);
                const isDisabled = isSelected && currentSelectedIds.length <= 2;
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
