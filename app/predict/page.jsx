"use client";

import { useState, useMemo } from "react";
import { predictSchema } from "@/Data/predictSchema";
import { predictAttack } from "@/utils/api";

const MODELS = [
  { value: "xgb", label: "XGBoost" },
  { value: "rf", label: "Random Forest" },
  { value: "dt", label: "Decision Tree" },
  { value: "knn", label: "K-Nearest Neighbors" },
  { value: "svc", label: "Vector Machine" },
  { value: "lr", label: "Logistic Regression" },
  { value: "cat", label: "CatBoost" },
  { value: "ada", label: "AdaBoost" },
  { value: "gb", label: "Gradient Boosting" }
];

export default function PredictPage() {
  const defaultFormValues = useMemo(() => {
    const values = {};
    predictSchema.forEach(f => {
      values[f.key] = 0;
    });
    return values;
  }, []);

  const [form, setForm] = useState(defaultFormValues);
  const [model, setModel] = useState("xgb");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (key, value, type) => {
    if (type === "binary" && !["0", "1"].includes(value)) return;
    if (type === "rate" && (isNaN(value) || value < 0 || value > 1)) return;

    setForm(prev => ({
      ...prev,
      [key]: Number(value)
    }));
  };

  const fillRandomValues = () => {
    const randomData = {};
    predictSchema.forEach(field => {
      if (field.type === "binary") {
        randomData[field.key] = Math.random() < 0.5 ? 0 : 1;
      } 
      else if (field.type === "rate") {
        randomData[field.key] = Number(Math.random().toFixed(2));
      } 
      else {
        const min = field.min ?? 0;
        const max = field.max ?? min + 10;
        randomData[field.key] = Math.floor(Math.random() * (max - min + 1)) + min;
      }
    });
    setForm(randomData);
  };

  const fillAllOnes = () => {
     const onesData = {};
    predictSchema.forEach(field => {
      onesData[field.key] = field.type === "rate" ? 1.0 : 1;
    });
    setForm(onesData);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {};
      predictSchema.forEach(f => {
        payload[f.key] = form[f.key];
      });

      const data = await predictAttack(payload, model);
      setResult(data);
    } catch (err) {
      if (err.response) {
        setError(
          `API ${err.response.status}: ${JSON.stringify(err.response.data)}`
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-space">Attack Prediction Engine</h1>
        <p className="text-gray-500">Analyze network traffic parameters to detect potential intrusion attempts.</p>
      </header>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-end justify-between">
         <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Classifier Model</label>
            <div className="relative">
                <select 
                    value={model} 
                    onChange={e => setModel(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-3 pr-8 appearance-none"
                >
                {MODELS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
         </div>

         <div className="flex gap-3">
             <button 
                onClick={fillRandomValues}
                className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
             >
                🎲 Randomize Data
             </button>
             <button 
                onClick={fillAllOnes}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
                Start with 1.0
             </button>
         </div>
      </div>

      {/* Input Grid */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6 font-space border-b border-gray-100 pb-2">Traffic Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {predictSchema.map(field => (
            <div key={field.key} className="group">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 group-hover:text-indigo-600 transition-colors">
                    {field.key.replace(/_/g, " ")}
                </label>
                <input
                type="number"
                min={field.type === "binary" ? 0 : field.type === "rate" ? 0 : field.min}
                max={field.type === "binary" ? 1 : field.type === "rate" ? 1 : field.max}
                step={field.type === "rate" ? "0.01" : 1}
                value={form[field.key] ?? 0}
                onChange={e => handleChange(field.key, e.target.value, field.type)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition-all"
                />
            </div>
            ))}
        </div>
      </div>

      {/* Action Area */}
      <div className="flex justify-end">
        <button 
            onClick={handleSubmit} 
            disabled={loading}
            className={`
                px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 
                transition-all transform hover:-translate-y-1 hover:shadow-2xl
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'}
            `}
        >
            {loading ? "Processing..." : "Run Prediction Analysis"}
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div className="mt-8 bg-gray-900 text-white p-8 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-space text-teal-400">Analysis Complete</h3>
              <span className="bg-gray-800 text-xs text-gray-400 px-2 py-1 rounded">JSON Output</span>
          </div>
          <pre className="font-mono text-sm bg-black/50 p-4 rounded-lg overflow-x-auto border border-gray-800">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded-r-lg">
            <p className="font-bold">Error Processing Request</p>
            <p className="text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  );
}