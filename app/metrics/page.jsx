
"use client";

import { useState } from "react";
import AccuracyBar from "@/components/Charts/AccuracyBar";
import { F1Line } from "@/components/Charts/F1Line";
import { PrecisionLine } from "@/components/Charts/PrecisionLine";
import { RecallLine } from "@/components/Charts/RecallLine";
import modelData from "@/Data/model_metrics.json";

export default function ModelsPage() {
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
    <div className="space-y-8">
      <header className="border-b border-gray-100 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-space">Model Performance</h1>
        <p className="text-gray-500">Comparative metrics across all deployed detection models.</p>
      </header>

      {/* Model Selection Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Select Models to Compare (Min 2)</h3>
        <div className="flex flex-wrap gap-3">
            {allModels.map(model => {
                const isSelected = selectedIds.includes(model.name);
                const isDisabled = isSelected && selectedIds.length <= 2;
                return (
                    <button
                        key={model.name}
                        onClick={() => toggleModel(model.name)}
                        disabled={isDisabled}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${isSelected 
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }
                            ${isDisabled ? 'opacity-90 cursor-not-allowed' : ''}
                        `}
                    >
                        {model.name}
                        {isSelected && <span className="ml-2">✓</span>}
                    </button>
                )
            })}
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Accuracy Comparison</h3>
            <AccuracyBar data={filteredData} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Precision Trends</h3>
            <PrecisionLine data={filteredData} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-semibold mb-4 text-gray-800">Recall Analysis</h3>
            <RecallLine data={filteredData} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">F1 Score Distribution</h3>
            <F1Line data={filteredData} />
        </div>
      </div>
    </div>
  );
}
