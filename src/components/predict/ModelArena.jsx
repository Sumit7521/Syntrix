"use client";

import { useState, useEffect } from "react";
import { predictMulticlassAttack } from "@/utils/api";
import { NORMAL_DEFAULT_VALUES, NEPTUNE_DDOS_VALUES, SMURF_DDOS_VALUES, PORT_SCAN_VALUES, BRUTE_FORCE_VALUES, ROOTKIT_VALUES } from "@/Data/predictSchema";
import { FiPlay, FiRefreshCw, FiAward, FiAlertCircle } from "react-icons/fi";
import "./model-arena.css";

const ARENA_MODELS = [
  { id: "hybrid", name: "Hybrid (AE + XGBoost)", color: "#10b981" },
  { id: "xgb", name: "XGBoost", color: "#3b82f6" },
  { id: "rf", name: "Random Forest", color: "#8b5cf6" },
  { id: "cnn", name: "CNN Deep Learning", color: "#ec4899" },
  { id: "knn", name: "K-Nearest Neighbors", color: "#f59e0b" },
  { id: "svc", name: "Support Vector Machine", color: "#6366f1" },
  { id: "lr", name: "Naive Bayes", color: "#14b8a6" },
  { id: "cat", name: "CatBoost", color: "#f43f5e" },
  { id: "ada", name: "AdaBoost", color: "#84cc16" }
];

const ATTACK_PROFILES = [
  { value: "normal", label: "🛡️ Normal Traffic", payload: NORMAL_DEFAULT_VALUES, expected: "Normal" },
  { value: "dos", label: "🔴 DoS Attack", payload: NEPTUNE_DDOS_VALUES, expected: "DoS" },
  { value: "probe", label: "🟣 Probe Attack", payload: PORT_SCAN_VALUES, expected: "Probe" },
  { value: "r2l", label: "🟠 R2L (Remote to Local)", payload: BRUTE_FORCE_VALUES, expected: "R2L" },
  { value: "u2r", label: "🟡 U2R (User to Root)", payload: ROOTKIT_VALUES, expected: "U2R" }
];

export default function ModelArena() {
  const [selectedProfile, setSelectedProfile] = useState(ATTACK_PROFILES[1]);
  const [raceState, setRaceState] = useState("idle"); // idle, racing, finished
  const [results, setResults] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);

  // Setup initial empty state for progress bars
  useEffect(() => {
    if (raceState === "idle") {
      const initial = {};
      ARENA_MODELS.forEach(m => {
        initial[m.id] = { status: "waiting", time: 0, prediction: "-", confidence: 0 };
      });
      setResults(initial);
      setLeaderboard([]);
    }
  }, [raceState]);

  const mapProtocol = (val) => {
    if (val === "tcp" || val === 0) return "tcp";
    if (val === "udp" || val === 1) return "udp";
    if (val === "icmp" || val === 2) return "icmp";
    return "tcp";
  };

  const mapFlag = (val) => {
    if (val === 1) return "SF";
    if (val === 0) return "S0";
    if (val === 2) return "REJ";
    return "SF";
  };

  const mapService = (val) => {
    if (val === 34) return "http";
    if (val === 12) return "ftp";
    if (val === 54) return "smtp";
    if (val === 14) return "dns";
    if (val === 12 && selectedProfile.value === 'bruteforce') return "ftp"; // Hack for brute force
    if (val === 12) return "private";
    return "http";
  };

  const formatPayload = (rawPayload) => {
    const payload = { ...rawPayload };
    payload.protocol_type = mapProtocol(payload.protocol_type);
    payload.flag = mapFlag(payload.flag);
    payload.service = mapService(payload.service);
    return payload;
  };

  const startRace = async () => {
    setRaceState("racing");
    const formattedPayload = formatPayload(selectedProfile.payload);
    
    // Update all models to "running"
    const runningState = {};
    ARENA_MODELS.forEach(m => {
      runningState[m.id] = { status: "running", time: 0, prediction: "...", confidence: 0 };
    });
    setResults(runningState);

    const racePromises = ARENA_MODELS.map(async (model) => {
      const startTime = performance.now();
      try {
        const res = await predictMulticlassAttack(formattedPayload, model.id);
        const endTime = performance.now();
        const timeTaken = Math.round(endTime - startTime);
        
        const prediction = res.prediction ?? res.Prediction ?? "Error";
        const confidence = res.confidence ?? res.Confidence ?? 0;
        const isCorrect = prediction.toLowerCase() === selectedProfile.expected.toLowerCase() || 
                         (selectedProfile.expected === "Normal" && prediction === "Normal");
                         
        const finalResult = {
           status: "finished",
           time: timeTaken,
           prediction,
           confidence: typeof confidence === "number" ? (confidence > 1 ? confidence : confidence * 100) : 0,
           isCorrect
        };
        
        // Update individual progress bar dynamically as they finish
        setResults(prev => ({ ...prev, [model.id]: finalResult }));
        
        return { model, ...finalResult };
      } catch (err) {
        const endTime = performance.now();
        const errorResult = {
           status: "error",
           time: Math.round(endTime - startTime),
           prediction: "API Failed",
           confidence: 0,
           isCorrect: false
        };
        setResults(prev => ({ ...prev, [model.id]: errorResult }));
        return { model, ...errorResult };
      }
    });

    const finishedResults = await Promise.all(racePromises);
    
    // Sort leaderboard by fastest time that got it correct
    const sortedLeaderboard = [...finishedResults].sort((a, b) => {
       if (a.isCorrect && !b.isCorrect) return -1;
       if (!a.isCorrect && b.isCorrect) return 1;
       return a.time - b.time;
    });
    
    setLeaderboard(sortedLeaderboard);
    setRaceState("finished");
  };

  return (
    <div className="arena-container">
      <header className="arena-header">
        <h1 className="arena-title">🏎️ Model Arena (Benchmarking)</h1>
        <p className="arena-subtitle">Pit all 9 machine learning models against each other concurrently to test their speed and accuracy.</p>
      </header>

      <div className="arena-controls">
         <div className="selector-group">
            <label>Select Attack Profile to Send:</label>
            <select 
               value={selectedProfile.value} 
               onChange={e => setSelectedProfile(ATTACK_PROFILES.find(p => p.value === e.target.value))}
               disabled={raceState === "racing"}
            >
               {ATTACK_PROFILES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
               ))}
            </select>
         </div>
         
         <div className="expected-badge">
            Target Expectation: <strong>{selectedProfile.expected}</strong>
         </div>

         {raceState !== "racing" ? (
            <button className="btn-race-start" onClick={startRace}>
               <FiPlay /> {raceState === "idle" ? "Start Race" : "Race Again"}
            </button>
         ) : (
            <button className="btn-race-running" disabled>
               <FiRefreshCw className="spin" /> Racing...
            </button>
         )}
      </div>

      <div className="race-tracks">
         {ARENA_MODELS.map(model => {
            const res = results[model.id] || { status: "waiting" };
            const isRunning = res.status === "running";
            const isFinished = res.status === "finished";
            const isError = res.status === "error";
            
            let trackClass = "track-bar ";
            if (isRunning) trackClass += "animating";
            if (isFinished) trackClass += "full";
            if (isError) trackClass += "error-bar";

            return (
               <div key={model.id} className="track-row">
                  <div className="track-label" style={{ color: model.color }}>
                     {model.name}
                  </div>
                  <div className="track-container">
                     <div 
                        className={trackClass} 
                        style={{ 
                           backgroundColor: isError ? '#ef4444' : model.color,
                           width: isFinished || isError ? '100%' : (isRunning ? '70%' : '0%') 
                        }}
                     ></div>
                     
                     {isFinished && (
                        <div className="track-stats fade-in">
                           <span className={res.isCorrect ? "stat-correct" : "stat-wrong"}>
                              {res.prediction} ({res.confidence.toFixed(1)}%)
                           </span>
                           <span className="stat-time">{res.time}ms</span>
                        </div>
                     )}
                     {isError && (
                        <div className="track-stats fade-in text-red">
                           <FiAlertCircle /> API Error
                        </div>
                     )}
                  </div>
               </div>
            );
         })}
      </div>

      {raceState === "finished" && leaderboard.length > 0 && (
         <div className="leaderboard-section fade-in">
            <h3>🏆 Race Leaderboard</h3>
            <table className="leaderboard-table">
               <thead>
                  <tr>
                     <th>Rank</th>
                     <th>Model Name</th>
                     <th>Prediction</th>
                     <th>Confidence</th>
                     <th>Latency</th>
                     <th>Result</th>
                  </tr>
               </thead>
               <tbody>
                  {leaderboard.map((item, index) => (
                     <tr key={item.model.id} className={index === 0 ? "winner-row" : ""}>
                        <td>
                           {index === 0 ? <FiAward className="winner-icon" /> : `#${index + 1}`}
                        </td>
                        <td style={{ fontWeight: 600, color: item.model.color }}>
                           {item.model.name}
                        </td>
                        <td>{item.prediction}</td>
                        <td>{item.confidence.toFixed(1)}%</td>
                        <td className="time-cell">{item.time}ms</td>
                        <td>
                           {item.isCorrect ? (
                              <span className="badge badge-success">Correct</span>
                           ) : item.status === "error" ? (
                              <span className="badge badge-error">Failed</span>
                           ) : (
                              <span className="badge badge-warning">Incorrect</span>
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      )}
    </div>
  );
}
