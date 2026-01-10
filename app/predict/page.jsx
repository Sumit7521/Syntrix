"use client";

import { useState } from "react";
import { predictSchema } from "@/Data/predictSchema";
import { predictAttack } from "@/utils/api";

// initialize defaults ONCE
const defaultFormValues = {};
predictSchema.forEach(f => {
  defaultFormValues[f.key] = 0;
});

const MODELS = ["xgb", "knn", "dt", "rf", "cat"];

export default function PredictPage() {
  const [form, setForm] = useState(defaultFormValues);
  const [model, setModel] = useState("xgb");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (key, value, type) => {
    if (type === "binary" && !["0", "1"].includes(value)) return;

    setForm(prev => ({
      ...prev,
      [key]: Number(value)
    }));
  };

  const fillRandomValues = () => {
    const randomData = {};
    predictSchema.forEach(field => {
      randomData[field.key] =
        field.type === "binary"
          ? Math.random() < 0.5 ? 0 : 1
          : 0;
    });
    setForm(randomData);
  };

  const fillAllOnes = () => {
    const onesData = {};
    predictSchema.forEach(field => {
      onesData[field.key] = 1;
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
    <>
      <h1>Predict Attack</h1>

      {/* MODEL SELECTOR */}
      <div style={{ marginBottom: 16 }}>
        <label>Model: </label>
        <select value={model} onChange={e => setModel(e.target.value)}>
          {MODELS.map(m => (
            <option key={m} value={m}>
              {m.toUpperCase()}
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
              min={field.type === "binary" ? 0 : field.min}
              max={field.type === "binary" ? 1 : undefined}
              step={1}
              value={form[field.key]}
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
