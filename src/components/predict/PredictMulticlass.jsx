"use client";

import { useState, useMemo } from "react";
import { predictSchema, NORMAL_DEFAULT_VALUES, NEPTUNE_DDOS_VALUES, SMURF_DDOS_VALUES, PORT_SCAN_VALUES, BRUTE_FORCE_VALUES, ROOTKIT_VALUES } from "@/Data/predictSchema";
import { predictMulticlassAttack } from "@/utils/api";
import "./predict.css";
import "./predict-multiclass.css";

const MULTICLASS_MODELS = [
  { value: "all", label: "All Models" },
  { value: "hybrid", label: "Feature Fusion Hybrid (AE + XGBoost)" },
  { value: "xgb", label: "XGBoost Classifier" },
  { value: "rf", label: "Random Forest (SMOTE)" },
  { value: "cnn", label: "Convolutional Neural Network (CNN)" },
  { value: "knn", label: "K-Nearest Neighbors (KNN)" },
  { value: "svc", label: "Support Vector Machine (SVM)" },
  { value: "lr", label: "Naive Bayes Classifier" },
  { value: "cat", label: "CatBoost Classifier" },
  { value: "ada", label: "AdaBoost Classifier" }
];

export default function PredictMulticlass() {
  const defaultFormValues = useMemo(() => {
    const values = {};
    predictSchema.forEach(f => {
      values[f.key] = 0;
    });
    return values;
  }, []);

  const [form, setForm] = useState(defaultFormValues);
  const [model, setModel] = useState("hybrid");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("");

  const handleChange = (key, value, type) => {
    if (type === "binary" && !["0", "1"].includes(value)) return;
    if (type === "rate" && (isNaN(value) || value < 0 || value > 1)) return;

    setForm(prev => ({
      ...prev,
      [key]: Number(value)
    }));
  };

  const fillRandomValues = () => {
    setSelectedProfile("");
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

  const fillNormalValues = () => {
    setSelectedProfile("");
    const normalData = {};
    predictSchema.forEach(field => {
      normalData[field.key] = NORMAL_DEFAULT_VALUES[field.key] ?? 0;
    });
    setForm(normalData);
  };

  const handleProfileSelect = (e) => {
    const profile = e.target.value;
    setSelectedProfile(profile);

    if (profile === "dos") setForm({...NEPTUNE_DDOS_VALUES});
    else if (profile === "probe") setForm({...PORT_SCAN_VALUES});
    else if (profile === "r2l") setForm({...BRUTE_FORCE_VALUES});
    else if (profile === "u2r") setForm({...ROOTKIT_VALUES});
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setExplanation(null);

    const payload = {};
    predictSchema.forEach(f => {
      payload[f.key] = form[f.key];
    });

    // --- NEW: Map numerical inputs to strings for the backend ---
    // The backend's Pydantic schema expects strings for these categorical fields
    // and the model uses one-hot encoding (e.g., "tcp", "http", "SF").
    const protocolMap = ["tcp", "udp", "icmp"];
    
    // Most common flags mapping (1 is usually SF for normal connections)
    const flagMap = ["S0", "SF", "REJ", "RSTO", "RSTR", "S1", "S2", "S3", "SH", "OTH"];
    
    // Most common services (34 is mapped to http based on the default normal values)
    // We'll create a default fallback to 'http' or other common services
    const mapService = (val) => {
      if (val === 34) return "http";
      if (val === 12) return "ftp";
      if (val === 54) return "smtp";
      if (val === 14) return "dns";
      return "http"; // Fallback to http so it doesn't break
    };

    if (payload.protocol_type !== undefined) {
      payload.protocol_type = protocolMap[payload.protocol_type] || "tcp";
    }
    if (payload.flag !== undefined) {
      payload.flag = flagMap[payload.flag] || "SF";
    }
    if (payload.service !== undefined) {
      payload.service = mapService(payload.service);
    }
    // -------------------------------------------------------------

    try {
      if (model === "all") {
        const modelPromises = MULTICLASS_MODELS
          .filter(m => m.value !== "all")
          .map(async (m) => {
             try {
               const data = await predictMulticlassAttack(payload, m.value);
               return { modelName: m.label, data, error: null };
             } catch (err) {
               return { modelName: m.label, data: null, error: err.message || "Error" };
             }
          });
        
        const results = await Promise.all(modelPromises);
        setResult(results);
      } else {
        const data = await predictMulticlassAttack(payload, model);
        setResult(data);
        if (data && data.explanation) {
          generateExplanation(data);
        }
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

  // Helper to map predictions to beautiful labels & badges
  const getLabelDetails = (rawPred) => {
    const predStr = String(rawPred).trim().toLowerCase();
    
    if (predStr === "normal" || predStr === "0") {
      return { text: "Normal Traffic", class: "Normal", badge: "badge-green" };
    } else if (predStr === "dos" || predStr === "1") {
      return { text: "DoS Attack", class: "DoS", badge: "badge-red" };
    } else if (predStr === "probe" || predStr === "2") {
      return { text: "Probe Attack", class: "Probe", badge: "badge-purple" };
    } else if (predStr === "r2l" || predStr === "3") {
      return { text: "R2L Attack", class: "R2L", badge: "badge-orange" };
    } else if (predStr === "u2r" || predStr === "4") {
      return { text: "U2R Attack", class: "U2R", badge: "badge-yellow" };
    }
    
    return { text: rawPred || "Unknown", class: "Unknown", badge: "badge-gray" };
  };

  const generateExplanation = async (resultData) => {
    if (!resultData || !resultData.explanation) return;
    
    setIsExplaining(true);
    setExplanation(null);

    const rawPred = resultData.prediction ?? resultData.Prediction;
    const details = getLabelDetails(rawPred);
    const conf = resultData.confidence ?? resultData.Confidence ?? 0;
    const confVal = conf > 1 ? conf / 100 : conf;

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prediction: details.text,
          confidence: (confVal * 100).toFixed(1),
          topFeatures: resultData.explanation.top_features,
          isSafe: details.class === "Normal"
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate explanation");
      }

      setExplanation(data.explanation);
    } catch (err) {
      setExplanation("⚠️ AI Explanation Error: " + err.message);
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="predict-container">
      <header className="header-section">
        <h1 className="page-title">Multiclass Threat Classifier</h1>
        <p className="page-subtitle">Examine deep feature signatures with 9 specialized ML/DL models and Explainable AI (SHAP).</p>
      </header>

      {/* Control Panel */}
      <div className="control-panel">
         <div className="model-selector">
            <label className="input-label">Select Multiclass Model</label>
            <div className="select-wrapper">
                <select 
                    value={model} 
                    onChange={e => setModel(e.target.value)}
                    className="styled-select"
                >
                {MULTICLASS_MODELS.map(m => (
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
                onClick={fillNormalValues}
                className="btn-secondary"
             >
                🛡️ Normal
             </button>
             <button 
                onClick={fillRandomValues}
                className="btn-secondary"
             >
                🎲 Randomize
             </button>
             <div className="select-wrapper profile-select-wrapper">
                 <select 
                     value={selectedProfile}
                     onChange={handleProfileSelect}
                     className="styled-select"
                     style={{ minWidth: "220px" }}
                 >
                    <option value="" disabled>📥 Load Threat Profile...</option>
                    <option value="dos">🔴 DoS Attack</option>
                    <option value="probe">🟣 Probe Attack</option>
                    <option value="r2l">🟠 R2L (Remote to Local)</option>
                    <option value="u2r">🟡 U2R (User to Root)</option>
                 </select>
                 <div className="select-icon">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                 </div>
             </div>
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
            {loading ? "Processing..." : "Run Multiclass Analysis"}
        </button>
      </div>

      {/* Result Display - All Models Table */}
      {result && Array.isArray(result) && (
        <div className="result-section">
            <h3 className="result-title">Multiclass Model Comparison</h3>
            <div className="table-wrapper">
                <table className="result-table">
                    <thead className="table-head">
                        <tr>
                            <th className="table-cell-head">Model Name</th>
                            <th className="table-cell-head">Threat Prediction</th>
                            <th className="table-cell-head">Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.map((row, idx) => {
                            const rawPred = row.data?.prediction ?? row.data?.Prediction;
                            const details = getLabelDetails(rawPred);
                            const conf = row.data?.confidence ?? row.data?.Confidence ?? 0;
                            const confVal = conf > 1 ? conf / 100 : conf;

                            return (
                                <tr key={idx} className="table-row">
                                    <td className="table-cell model-name">{row.modelName}</td>
                                    <td className="table-cell">
                                        {row.error ? (
                                            <span className="error-text">Error</span>
                                        ) : (
                                            <span className={`badge ${details.badge}`}>
                                                {details.text}
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

      {/* Result Display - Single Model Card */}
      {result && !Array.isArray(result) && (
        <>
          <div className="single-result-card">
            <div className="result-header-row">
               <h3 className="result-card-title">Analysis Result</h3>
               <span className="model-badge">
                 {MULTICLASS_MODELS.find(m => m.value === model)?.label || "Model"}
               </span>
            </div>
            
            {(() => {
               const rawPred = result.prediction ?? result.Prediction;
               const details = getLabelDetails(rawPred);
               const conf = result.confidence ?? result.Confidence ?? 0;
               const confVal = conf > 1 ? conf / 100 : conf;

               return (
                 <div className="result-content-grid">
                    <div className="result-status-box">
                       <span className="label-text">Threat Category</span>
                       <div className={`status-indicator ${details.class === 'Normal' ? 'status-safe' : 'status-danger'}`}>
                          {details.class === 'Normal' ? (
                             <span className="icon-safe">🛡️</span> 
                          ) : (
                             <span className="icon-danger">⚠️</span>
                          )}
                          <span className="status-text">{details.text}</span>
                       </div>
                    </div>

                    <div className="result-metric-box">
                       <span className="label-text">Classification Confidence</span>
                       <div className="metric-value-row">
                          <span className="metric-number">
                             {(confVal * 100).toFixed(1)}%
                          </span>
                       </div>
                       <div className="single-progress-track">
                          <div 
                             className="single-progress-bar"
                             style={{ width: `${confVal * 100}%` }}
                          ></div>
                       </div>
                    </div>
                 </div>
               );
            })()}
          </div>

          {/* Interactive SHAP XAI Bar Chart for Hybrid Model */}
          {result.explanation && (
            <div className="shap-section">
              <div className="shap-header">
                <h3 className="shap-title">
                  🧠 Explainable AI (SHAP) - Feature Contribution
                </h3>
                <p className="shap-subtitle">
                  Visualizing how each specific network traffic parameter influenced the threat category prediction.
                </p>
              </div>

              <div className="base-value-box">
                <span>Model Base Probability Value:</span>
                <span className="base-value-num">{result.explanation.base_value}</span>
              </div>

              <div className="shap-chart-container">
                {result.explanation.top_features.map((item, idx) => {
                  const isPositive = item.shap_value >= 0;
                  const absVal = Math.abs(item.shap_value);
                  // Find the maximum absolute SHAP value in the list to scale the bars proportionally
                  const maxAbs = Math.max(...result.explanation.top_features.map(f => Math.abs(f.shap_value))) || 1;
                  const barWidth = (absVal / maxAbs) * 100;

                  return (
                    <div key={idx} className="shap-row">
                      <div className="shap-feature-name" title={item.feature}>
                        {item.feature.replace(/_/g, " ")}
                      </div>
                      <div className="shap-bar-wrapper">
                        <div className="shap-bar-track">
                          <div 
                            className={`shap-bar-fill ${isPositive ? 'shap-fill-positive' : 'shap-fill-negative'}`}
                            style={{ width: `${barWidth}%` }}
                          ></div>
                        </div>
                        <span className={`shap-value-badge ${isPositive ? 'shap-val-pos' : 'shap-val-neg'}`}>
                          {isPositive ? "+" : ""}{item.shap_value.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="shap-legend">
                <div className="legend-item">
                  <div className="legend-color-box legend-pos"></div>
                  <span>Increases Cyber Threat Probability</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color-box legend-neg"></div>
                  <span>Decreases Cyber Threat Probability</span>
                </div>
              </div>

              {/* LangChain AI Explanation Block */}
              <div className="ai-explanation-section">
                 <div className="ai-header">
                    <h3 className="ai-title">
                       ✨ AI Human Explanation
                    </h3>
                    <button 
                       className="ai-button"
                       onClick={() => generateExplanation(result)}
                       disabled={isExplaining}
                    >
                       {isExplaining ? "Generating..." : "Generate Explanation"}
                    </button>
                 </div>
                 
                 {explanation && (
                    <div className="ai-content">
                       {(() => {
                           if (!explanation) return null;
                           // Split by ** to parse bold text
                           const parts = explanation.split(/(\*\*.*?\*\*)/g);
                           return parts.map((part, i) => {
                               if (part.startsWith('**') && part.endsWith('**')) {
                                   return <strong key={i} style={{ color: '#111827', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
                               }
                               return <span key={i}>{part}</span>;
                           });
                       })()}
                    </div>
                 )}
              </div>

            </div>
          )}
        </>
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
