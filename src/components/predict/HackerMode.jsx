"use client";

import { useState, useEffect, useRef } from "react";
import { predictMulticlassAttack } from "@/utils/api";
import { NORMAL_DEFAULT_VALUES } from "@/Data/predictSchema";
import { FiTerminal, FiShield, FiAlertTriangle, FiActivity, FiCrosshair } from "react-icons/fi";
import "./hacker-mode.css";


const HACKER_FEATURES = [
  { key: "num_failed_logins", min: 0, max: 10, step: 1, hint: "Triggers Brute Force / R2L" },
  { key: "count", min: 0, max: 511, step: 5, hint: "High volume triggers SYN Flood / DoS" },
  { key: "wrong_fragment", min: 0, max: 3, step: 1, hint: "Triggers Teardrop DoS attacks" },
  { key: "hot", min: 0, max: 30, step: 1, hint: "Triggers Probe / U2R attacks" },
  { key: "duration", min: 0, max: 1000, step: 10, hint: "Long connection duration" },
  { key: "src_bytes", min: 0, max: 50000, step: 100, hint: "Bytes sent by source" },
  { key: "dst_bytes", min: 0, max: 50000, step: 100, hint: "Bytes sent by destination" },
  { key: "logged_in", min: 0, max: 1, step: 1, hint: "Successful login status" },
  { key: "num_compromised", min: 0, max: 20, step: 1, hint: "Number of compromised conditions" },
  { key: "root_shell", min: 0, max: 1, step: 1, hint: "Root shell obtained" },
  { key: "su_attempted", min: 0, max: 1, step: 1, hint: "SU command attempted" },
  { key: "num_file_creations", min: 0, max: 20, step: 1, hint: "Files created during session" },
  { key: "srv_count", min: 0, max: 511, step: 5, hint: "Connections to same service" },
  { key: "serror_rate", min: 0, max: 1, step: 0.01, hint: "SYN error percentage" },
  { key: "rerror_rate", min: 0, max: 1, step: 0.01, hint: "REJ error percentage" },
  { key: "same_srv_rate", min: 0, max: 1, step: 0.01, hint: "Connections to same service" },
  { key: "diff_srv_rate", min: 0, max: 1, step: 0.01, hint: "Connections to different services" },
  { key: "dst_host_count", min: 0, max: 255, step: 5, hint: "Destination host connections" },
  { key: "dst_host_srv_count", min: 0, max: 255, step: 5, hint: "Destination host service count" },
  { key: "dst_host_same_srv_rate", min: 0, max: 1, step: 0.01, hint: "Same service rate for host" }
];

export default function HackerMode() {
  const [payload, setPayload] = useState({ ...NORMAL_DEFAULT_VALUES });
  const [prediction, setPrediction] = useState("Normal");
  const [confidence, setConfidence] = useState(100);
  const [isScanning, setIsScanning] = useState(false);
  const debounceRef = useRef(null);

  // Helper mappings
  const mapProtocol = (val) => {
    if (val === "tcp" || val === 0) return "tcp";
    if (val === "udp" || val === 1) return "udp";
    if (val === "icmp" || val === 2) return "icmp";
    return "tcp";
  };
  const mapFlag = (val) => (val === 1 ? "SF" : val === 0 ? "S0" : val === 2 ? "REJ" : "SF");
  const mapService = (val) => {
    if (val === 34) return "http";
    if (val === 12) return "ftp";
    if (val === 54) return "smtp";
    if (val === 14) return "dns";
    return "http";
  };

  const formatPayload = (rawPayload) => {
    const formatted = { ...rawPayload };
    formatted.protocol_type = mapProtocol(formatted.protocol_type);
    formatted.flag = mapFlag(formatted.flag);
    formatted.service = mapService(formatted.service);
    return formatted;
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setPayload(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  useEffect(() => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setIsScanning(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const formatted = formatPayload(payload);
        const res = await predictMulticlassAttack(formatted, "hybrid");
        
        let predText = res.prediction ?? res.Prediction ?? "Unknown";
        let conf = res.confidence ?? res.Confidence ?? 0;
        if (typeof conf === "number" && conf <= 1) {
          conf = conf * 100;
        }

        setPrediction(predText);
        setConfidence(conf);
      } catch (err) {
        setPrediction("API Error");
        setConfidence(0);
      } finally {
        setIsScanning(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(debounceRef.current);
  }, [payload]);

  const cleanPrediction = String(prediction).trim().toLowerCase();
  const isAttack = cleanPrediction !== "normal" && !cleanPrediction.includes("normal") && prediction !== "API Error";

  return (
    <div className="hacker-container">
      <header className="hacker-header">
        <h1>WHAT-IF ANALYSIS</h1>
        <p>Interactive Command Center. Modify network parameters and watch the AI react in real-time.</p>
      </header>

      <div className="hacker-grid">
        {/* Sliders Panel */}
        <div className="panel control-panel">
          <div className="panel-header">
            <FiTerminal /> Parameter Modulation
          </div>
          
          {HACKER_FEATURES.map(feat => (
            <div className="slider-group" key={feat.key}>
              <div className="slider-labels">
                <label>{feat.key.replace(/_/g, " ")}</label>
                <span className="slider-val">{payload[feat.key]}</span>
              </div>
              <input 
                type="range" 
                name={feat.key} 
                min={feat.min} max={feat.max} step={feat.step} 
                value={payload[feat.key]} 
                onChange={handleSliderChange} 
                className="hacker-slider"
              />
              <small className="hint">{feat.hint}</small>
            </div>
          ))}
          
          <button className="btn-reset" onClick={() => setPayload({ ...NORMAL_DEFAULT_VALUES })}>
            Initialize Base Payload
          </button>
        </div>

        {/* Real-time Result Panel */}
        <div className="panel monitor-panel">
           <div className="panel-header">
              <FiActivity /> Hybrid AI Monitor
           </div>
           
           <div className="monitor-display">
              <div className={`status-ring ${isAttack ? 'ring-danger' : 'ring-safe'}`}>
                 <div className="status-core">
                    {isScanning ? (
                       <div className="scanning-pulse"></div>
                    ) : (
                       isAttack ? <FiCrosshair size={70} /> : <FiShield size={70} />
                    )}
                 </div>
              </div>
              
              <div className="threat-info">
                 <div className={`threat-name ${isAttack ? 'text-neon-red' : 'text-neon-green'}`}>
                    {isScanning ? "ANALYZING..." : (isAttack ? prediction.toUpperCase() : "NORMAL TRAFFIC")}
                 </div>
                 <div className="confidence-meter">
                    <span>CONF</span>
                    <div className="meter-bg">
                       <div 
                          className="meter-fill" 
                          style={{ 
                             width: `${confidence}%`, 
                             backgroundColor: isAttack ? '#ff3366' : '#00ffcc'
                          }}
                       ></div>
                    </div>
                    <span className="conf-text">{confidence.toFixed(1)}%</span>
                 </div>
              </div>
           </div>

           <div className="terminal-log">
              <div className="log-line"><span className="log-prefix">~</span> LIVE_STREAM: CONNECTED</div>
              <div className="log-line"><span className="log-prefix">~</span> PAYLOAD_SIZE: 41_FEATURES</div>
              <div className="log-line"><span className="log-prefix">~</span> MODEL: HYBRID (AutoEncoder+XGB)</div>
              {isScanning && <div className="log-line blink"><span className="log-prefix">~</span> RECALCULATING_TRAJECTORY...</div>}
              {!isScanning && isAttack && <div className="log-line text-neon-red"><span className="log-prefix text-neon-red">!</span> THREAT_DETECTED_AT_CURRENT_VECTORS!</div>}
              {!isScanning && !isAttack && <div className="log-line text-neon-green"><span className="log-prefix text-neon-green">&gt;</span> PACKET_SAFE. SECURE.</div>}
           </div>
        </div>
      </div>
    </div>
  );
}
