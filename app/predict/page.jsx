"use client";

import { useState, useMemo } from "react";
import { predictSchema } from "@/Data/predictSchema";
import { predictAttack } from "@/utils/api";

const MODELS = [
  { value: "xgb", label: "XGBoost" },
  { value: "rf", label: "Random Forest" },
  { value: "dt", label: "Decision Tree" },
  { value: "knn", label: "K-Nearest Neighbors" },
  { value: "svc", label: "Support Vector Machine" },
  { value: "lr", label: "Logistic Regression" },
  { value: "cat", label: "CatBoost" },
  { value: "ada", label: "AdaBoost" },
  { value: "gb", label: "Gradient Boosting" }
];

export default function PredictPage() {
  // ✅ Hydration-safe defaults
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

  // ---------------- HANDLERS ----------------

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
        randomData[field.key] =
          Math.floor(Math.random() * (max - min + 1)) + min;
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

  // ---------------- UI ----------------

  return (
    <>
      <h1>Predict Attack</h1>

      {/* MODEL SELECT */}
      <div style={{ marginBottom: 16 }}>
        <label>Model: </label>
        <select value={model} onChange={e => setModel(e.target.value)}>
          {MODELS.map(m => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* INPUT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12
        }}
      >
        {predictSchema.map(field => (
          <div key={field.key}>
            <label>{field.key}</label>
            <input
              type="number"
              min={
                field.type === "binary" ? 0 :
                field.type === "rate" ? 0 :
                field.min
              }
              max={
                field.type === "binary" ? 1 :
                field.type === "rate" ? 1 :
                field.max
              }
              step={field.type === "rate" ? "0.01" : 1}
              value={form[field.key] ?? 0}
              onChange={e =>
                handleChange(field.key, e.target.value, field.type)
              }
            />
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ marginTop: 20 }}>
        <button onClick={fillRandomValues} style={{ marginRight: 12 }}>
          Random
        </button>

        <button onClick={fillAllOnes} style={{ marginRight: 12 }}>
          All Ones
        </button>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Prediction Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}