"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import { predictMulticlassAttack } from "@/utils/api";
import { predictSchema } from "@/Data/predictSchema";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { FiUploadCloud, FiFile, FiCheckCircle, FiAlertTriangle, FiTrash2 } from "react-icons/fi";
import "./batch-predict.css";

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

export default function BatchPredict() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (uploadedFile) => {
    setError(null);
    if (!uploadedFile.name.endsWith('.csv')) {
      setError("Please upload a valid CSV file.");
      return;
    }
    setFile(uploadedFile);
    setResults(null);
  };

  const mapProtocol = (val) => {
    if (val === "tcp" || val === 0 || val === "0") return "tcp";
    if (val === "udp" || val === 1 || val === "1") return "udp";
    if (val === "icmp" || val === 2 || val === "2") return "icmp";
    return "tcp";
  };

  const mapFlag = (val) => {
    const validFlags = ["S0", "SF", "REJ", "RSTO", "RSTR", "S1", "S2", "S3", "SH", "OTH"];
    if (validFlags.includes(val)) return val;
    // Map numbers to SF (most common) or standard fallback
    if (val === 1 || val === "1") return "SF";
    if (val === 0 || val === "0") return "S0";
    return "SF";
  };

  const mapService = (val) => {
    if (val === "http" || val === 34 || val === "34") return "http";
    if (val === "ftp" || val === 12 || val === "12") return "ftp";
    if (val === "smtp" || val === 54 || val === "54") return "smtp";
    if (val === "dns" || val === 14 || val === "14") return "dns";
    if (val === "private") return "private";
    return typeof val === "string" ? val : "http";
  };

  const processBatch = () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setResults(null);
    setProgress(0);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data;
        if (data.length === 0) {
          setError("The CSV file is empty.");
          setIsProcessing(false);
          return;
        }

        // Limit to 100 rows for the free HuggingFace API tier demo
        const batchSize = Math.min(data.length, 100);
        setTotalRows(batchSize);
        
        let processedResults = [];
        
        for (let i = 0; i < batchSize; i++) {
          const row = data[i];
          const payload = {};
          
          predictSchema.forEach(f => {
             // Fallback to 0 if column is missing or invalid
             let val = row[f.key] !== undefined ? row[f.key] : 0;
             if (f.key === "protocol_type") payload[f.key] = mapProtocol(val);
             else if (f.key === "flag") payload[f.key] = mapFlag(val);
             else if (f.key === "service") payload[f.key] = mapService(val);
             else payload[f.key] = Number(val) || 0;
          });

          try {
            const res = await predictMulticlassAttack(payload, "hybrid");
            const predText = res.prediction ?? res.Prediction ?? "Unknown";
            const conf = res.confidence ?? res.Confidence ?? 0;
            const isSafe = predText === "Normal";

            processedResults.push({
               id: i + 1,
               ...payload,
               prediction: predText,
               confidence: typeof conf === "number" ? conf > 1 ? conf : conf * 100 : 0,
               isSafe
            });
          } catch (err) {
            processedResults.push({
               id: i + 1,
               ...payload,
               prediction: "API Error",
               confidence: 0,
               isSafe: false
            });
          }
          setProgress(i + 1);
        }

        generateDashboards(processedResults);
        setIsProcessing(false);
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
        setIsProcessing(false);
      }
    });
  };

  const generateDashboards = (data) => {
    let safeCount = 0;
    let attackCount = 0;
    const attackTypes = {};

    data.forEach(item => {
       if (item.isSafe) {
          safeCount++;
       } else {
          attackCount++;
          const type = item.prediction;
          if (type !== "API Error") {
            attackTypes[type] = (attackTypes[type] || 0) + 1;
          }
       }
    });

    const pieData = [
       { name: "Normal Traffic", value: safeCount },
       { name: "Attacks", value: attackCount }
    ];

    const barData = Object.keys(attackTypes).map(key => ({
       name: key,
       count: attackTypes[key]
    }));

    setResults({
       rawData: data,
       pieData,
       barData,
       stats: {
          total: data.length,
          safe: safeCount,
          attacks: attackCount
       }
    });
  };

  const clearFile = () => {
    setFile(null);
    setResults(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="batch-container">
      <header className="batch-header">
        <h1 className="batch-title">Batch Data Analysis</h1>
        <p className="batch-subtitle">Upload a CSV file containing network packets to scan them in bulk using the Hybrid ML Model.</p>
      </header>

      {!isProcessing && !results && (
        <div 
           className="upload-zone" 
           onDragOver={handleDragOver} 
           onDrop={handleDrop}
           onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          <FiUploadCloud className="upload-icon" />
          <h3>Drag & Drop your CSV file here</h3>
          <p>or click to browse from your computer (Max 100 rows for demo)</p>
          
          {file && (
             <div className="selected-file" onClick={e => e.stopPropagation()}>
               <FiFile className="file-icon" />
               <span className="file-name">{file.name}</span>
               <button onClick={clearFile} className="btn-clear"><FiTrash2 /></button>
             </div>
          )}
        </div>
      )}

      {error && (
         <div className="batch-error">
           <FiAlertTriangle /> {error}
         </div>
      )}

      {file && !isProcessing && !results && (
         <button onClick={processBatch} className="btn-process">
            Start Bulk Scan
         </button>
      )}

      {isProcessing && (
         <div className="processing-zone">
            <h3>Scanning Packets...</h3>
            <div className="progress-bar-bg">
               <div className="progress-bar-fill" style={{ width: `${(progress / totalRows) * 100}%` }}></div>
            </div>
            <p>{progress} of {totalRows} packets processed</p>
            <p className="sub-text">Please wait. Do not close this window.</p>
         </div>
      )}

      {results && (
         <div className="dashboard-results">
            <div className="stats-cards">
               <div className="stat-card">
                  <h4>Total Scanned</h4>
                  <div className="stat-val">{results.stats.total}</div>
               </div>
               <div className="stat-card safe-card">
                  <h4>Safe Packets</h4>
                  <div className="stat-val text-green">{results.stats.safe}</div>
               </div>
               <div className="stat-card danger-card">
                  <h4>Threats Detected</h4>
                  <div className="stat-val text-red">{results.stats.attacks}</div>
               </div>
            </div>

            <div className="charts-grid">
               <div className="chart-box">
                  <h3>Traffic Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                     <PieChart>
                        <Pie data={results.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                           {results.pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.name === 'Normal Traffic' ? '#10b981' : '#ef4444'} />
                           ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               
               <div className="chart-box">
                  <h3>Attack Types Detected</h3>
                  {results.barData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                         <BarChart data={results.barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                               {results.barData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                               ))}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="no-attacks">
                          <FiCheckCircle size={40} color="#10b981" />
                          <p>No attacks detected in this batch.</p>
                      </div>
                  )}
               </div>
            </div>

            <div className="threat-log-section">
               <h3>Threat Log (Malicious Packets)</h3>
               {results.stats.attacks > 0 ? (
                  <div className="table-responsive">
                     <table className="threat-table">
                        <thead>
                           <tr>
                              <th>ID</th>
                              <th>Protocol</th>
                              <th>Service</th>
                              <th>Bytes (Src/Dst)</th>
                              <th>Detected Threat</th>
                              <th>Confidence</th>
                           </tr>
                        </thead>
                        <tbody>
                           {results.rawData.filter(r => !r.isSafe).map((row, idx) => (
                              <tr key={idx}>
                                 <td>#{row.id}</td>
                                 <td className="uppercase">{row.protocol_type}</td>
                                 <td>{row.service}</td>
                                 <td>{row.src_bytes} / {row.dst_bytes}</td>
                                 <td className="threat-cell">{row.prediction}</td>
                                 <td>{row.confidence.toFixed(1)}%</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               ) : (
                  <p className="clean-msg">All traffic is clean. Log is empty.</p>
               )}
            </div>
            
            <button onClick={clearFile} className="btn-new-scan">New Batch Scan</button>
         </div>
      )}
    </div>
  );
}
