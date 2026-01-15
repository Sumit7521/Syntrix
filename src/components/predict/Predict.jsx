"use client";

import { useState, useMemo } from "react";
import { predictSchema } from "@/Data/predictSchema";
import { predictAttack } from "@/utils/api";
import "./predict.css";

const MODELS = [
  { value: "all", label: "All Models" },
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

export default function Predict() {
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

  const fillAllZeros = () => {
    const zerosData = {};
    predictSchema.forEach(field => {
      zerosData[field.key] = 0;
    });
    setForm(zerosData);
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

    const payload = {};
    predictSchema.forEach(f => {
      payload[f.key] = form[f.key];
    });

    try {
      if (model === "all") {
        const modelPromises = MODELS
          .filter(m => m.value !== "all")
          .map(async (m) => {
             try {
               const data = await predictAttack(payload, m.value);
               return { modelName: m.label, data, error: null };
             } catch (err) {
               return { modelName: m.label, data: null, error: err.message || "Error" };
             }
          });
        
        const results = await Promise.all(modelPromises);
        setResult(results);
      } else {
        const data = await predictAttack(payload, model);
        setResult(data);
      }
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
    <div className="predict-container">
      <header className="header-section">
        <h1 className="page-title">Attack Prediction Engine</h1>
        <p className="page-subtitle">Analyze network traffic parameters to detect potential intrusion attempts.</p>
      </header>

      {/* Control Panel */}
      <div className="control-panel">
         <div className="model-selector">
            <label className="input-label">Select Classifier Model</label>
            <div className="select-wrapper">
                <select 
                    value={model} 
                    onChange={e => setModel(e.target.value)}
                    className="styled-select"
                >
                {MODELS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                ))}
                </select>
                <div className="select-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
         </div>

         <div className="button-group">
             <button 
                onClick={fillRandomValues}
                className="btn-secondary"
             >
                🎲 Randomize
             </button>
             <button 
                onClick={fillAllOnes}
                className="btn-secondary"
            >
                Set All 1
            </button>
             <button 
                onClick={fillAllZeros}
                className="btn-secondary"
            >
                Set All 0
            </button>
         </div>
      </div>

      {/* Input Grid */}
      <div className="input-section">
        <h3 className="section-title">Traffic Parameters</h3>
        <div className="input-grid">
            {predictSchema.map(field => (
            <div key={field.key} className="input-group group">
                <label className="tiny-label">
                    {field.key.replace(/_/g, " ")}
                </label>
                <input
                type="number"
                min={field.type === "binary" ? 0 : field.type === "rate" ? 0 : field.min}
                max={field.type === "binary" ? 1 : field.type === "rate" ? 1 : field.max}
                step={field.type === "rate" ? "0.01" : 1}
                value={form[field.key] ?? 0}
                onChange={e => handleChange(field.key, e.target.value, field.type)}
                className="styled-input"
                />
            </div>
            ))}
        </div>
      </div>

      {/* Action Area */}
      <div className="action-area">
        <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="btn-primary"
        >
            {loading ? "Processing..." : "Run Prediction Analysis"}
        </button>
      </div>

      {/* Result Display */}
      {result && Array.isArray(result) && (
        <div className="result-section">
            <h3 className="result-title">Model Comparison Results</h3>
            <div className="table-wrapper">
                <table className="result-table">
                    <thead className="table-head">
                        <tr>
                            <th className="table-cell-head">Model Name</th>
                            <th className="table-cell-head">Prediction</th>
                            <th className="table-cell-head">Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.map((row, idx) => {
                            const pred = row.data?.prediction || row.data?.Prediction || "Unknown";
                            const conf = row.data?.confidence ?? row.data?.Confidence ?? 0;
                            const confVal = conf > 1 ? conf / 100 : conf; // Normalize to 0-1 if receiving 0-100

                            return (
                                <tr key={idx} className="table-row">
                                    <td className="table-cell model-name">{row.modelName}</td>
                                    <td className="table-cell">
                                        {row.error ? (
                                            <span className="error-text">Error</span>
                                        ) : (
                                            <span className={`badge ${pred === 'Normal' ? 'badge-green' : 'badge-red'}`}>
                                                {pred}
                                            </span>
                                        )}
                                    </td>
                                    <td className="table-cell confidence-cell">
                                        {row.error ? "-" : (
                                            <div className="confidence-wrapper">
                                                <div className="progress-track">
                                                    <div 
                                                        className="progress-bar" 
                                                        style={{ width: `${confVal * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span>{(confVal * 100).toFixed(1)}%</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {result && !Array.isArray(result) && (
        <div className="single-result-card">
          <div className="result-header-row">
             <h3 className="result-card-title">Analysis Result</h3>
             <span className="model-badge">Current Model</span>
          </div>
          
          <div className="result-content-grid">
             <div className="result-status-box">
                <span className="label-text">Prediction Status</span>
                <div className={`status-indicator ${result.prediction === 'Normal' ? 'status-safe' : 'status-danger'}`}>
                   {result.prediction === 'Normal' ? (
                      <span className="icon-safe">🛡️</span> 
                   ) : (
                      <span className="icon-danger">⚠️</span>
                   )}
                   <span className="status-text">{result.prediction || "Unknown"}</span>
                </div>
             </div>

             <div className="result-metric-box">
                <span className="label-text">Confidence Score</span>
                <div className="metric-value-row">
                   <span className="metric-number">
                      {(result.confidence > 1 ? result.confidence : result.confidence * 100).toFixed(1)}%
                   </span>
                </div>
                <div className="single-progress-track">
                   <div 
                      className="single-progress-bar"
                      style={{ width: `${result.confidence > 1 ? result.confidence : result.confidence * 100}%` }}
                   ></div>
                </div>
             </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-container">
            <p className="error-title">Error Processing Request</p>
            <p className="error-msg">{error}</p>
        </div>
      )}
    </div>
  );
}