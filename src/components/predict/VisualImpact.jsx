"use client";

import { useState, useEffect, useRef } from "react";
import { FiMonitor, FiSliders, FiPlayCircle, FiShield, FiCrosshair, FiActivity } from "react-icons/fi";
import "./visual-impact.css";

export default function VisualImpact() {
  const canvasRef = useRef(null);
  const [count, setCount] = useState(5);
  const [serrorRate, setSerrorRate] = useState(0.0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const particlesRef = useRef([]);
  const explosionsRef = useRef([]);
  const animationRef = useRef(null);
  const lastSpawnTimeRef = useRef(0);

  // Constants
  const SERVER_RADIUS = 40;
  const PARTICLE_SPEED = 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const renderLoop = (timestamp) => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Clear canvas with trail effect
      ctx.fillStyle = "rgba(5, 11, 20, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Server Node
      ctx.beginPath();
      ctx.arc(cx, cy, SERVER_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = count > 200 ? "rgba(255, 0, 60, 0.1)" : "rgba(0, 255, 204, 0.1)";
      ctx.fill();
      ctx.strokeStyle = count > 200 ? "#ff003c" : "#00ffcc";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Server Pulse
      const pulseRadius = SERVER_RADIUS + (Math.sin(timestamp * 0.005) * 5) + (count > 200 ? 10 : 0);
      ctx.beginPath();
      ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = count > 200 ? "rgba(255, 0, 60, 0.3)" : "rgba(0, 255, 204, 0.3)";
      ctx.stroke();

      // Spawn Logic based on \`count\`
      // count ranges from 0 to 511
      const spawnInterval = count === 0 ? Infinity : (1000 / (count / 2)); // Connections per second roughly

      if (timestamp - lastSpawnTimeRef.current > spawnInterval) {
         spawnParticle(canvas.width, canvas.height, cx, cy);
         lastSpawnTimeRef.current = timestamp;
      }

      // Update and Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
         const p = particlesRef.current[i];
         
         // Move towards center
         const dx = cx - p.x;
         const dy = cy - p.y;
         const dist = Math.sqrt(dx * dx + dy * dy);
         
         if (dist < SERVER_RADIUS) {
            // Hit server!
            particlesRef.current.splice(i, 1);
            
            // Check for error/explosion
            if (Math.random() < serrorRate) {
               explosionsRef.current.push({ x: p.x, y: p.y, radius: 5, maxRadius: 30, alpha: 1, color: "#ff003c" });
            } else {
               // Safe merge
               if (count <= 200) {
                  explosionsRef.current.push({ x: p.x, y: p.y, radius: 5, maxRadius: 15, alpha: 0.5, color: "#00ffcc" });
               }
            }
            continue;
         }

         p.x += (dx / dist) * p.speed;
         p.y += (dy / dist) * p.speed;

         // Draw particle
         ctx.beginPath();
         ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
         ctx.fillStyle = p.color;
         ctx.fill();
         // Trail
         ctx.shadowBlur = 10;
         ctx.shadowColor = p.color;
         ctx.fill();
         ctx.shadowBlur = 0; // reset
      }

      // Update and Draw Explosions
      for (let i = explosionsRef.current.length - 1; i >= 0; i--) {
         const ex = explosionsRef.current[i];
         ex.radius += 1;
         ex.alpha -= 0.03;

         if (ex.alpha <= 0) {
            explosionsRef.current.splice(i, 1);
            continue;
         }

         ctx.beginPath();
         ctx.arc(ex.x, ex.y, ex.radius, 0, Math.PI * 2);
         ctx.strokeStyle = `rgba(${ex.color === '#ff003c' ? '255,0,60' : '0,255,204'}, ${ex.alpha})`;
         ctx.lineWidth = 2;
         ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(renderLoop);
    };

    animationRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [count, serrorRate, isPlaying]);

  const spawnParticle = (w, h, cx, cy) => {
     // Determine edge (0: top, 1: right, 2: bottom, 3: left)
     const edge = Math.floor(Math.random() * 4);
     let x, y;
     if (edge === 0) { x = Math.random() * w; y = -10; }
     else if (edge === 1) { x = w + 10; y = Math.random() * h; }
     else if (edge === 2) { x = Math.random() * w; y = h + 10; }
     else { x = -10; y = Math.random() * h; }

     const isThreat = count > 200;
     
     particlesRef.current.push({
        x, y,
        radius: isThreat ? 2 : 3,
        color: isThreat ? "#ff003c" : "#00ffcc",
        speed: PARTICLE_SPEED + (Math.random() * 2) + (isThreat ? 3 : 0)
     });
  };

  const applyPreset = (presetName) => {
     if (presetName === "normal") { setCount(5); setSerrorRate(0.0); }
     if (presetName === "smurf") { setCount(511); setSerrorRate(0.0); }
     if (presetName === "neptune") { setCount(250); setSerrorRate(1.0); }
     if (presetName === "rootkit") { setCount(1); setSerrorRate(0.0); }
  };

  return (
    <div className="visual-container">
      <header className="visual-header">
         <h1 className="visual-title">🕸️ Visual Threat Impact</h1>
         <p>See exactly how NSL-KDD parameters translate into real-world network traffic.</p>
      </header>

      <div className="visual-layout">
         <div className="controls-panel">
            <div className="panel-header">
               <FiSliders /> Controls
            </div>
            
            <div className="slider-group">
               <div className="slider-labels">
                  <label>Count (Connections)</label>
                  <span className="slider-val">{count}</span>
               </div>
               <input 
                  type="range" min="0" max="511" 
                  value={count} 
                  onChange={e => setCount(Number(e.target.value))} 
                  className="visual-slider" 
               />
               <small className="hint">Number of connections to the same host in 2 seconds.</small>
            </div>

            <div className="slider-group">
               <div className="slider-labels">
                  <label>Serror_Rate (SYN Errors)</label>
                  <span className="slider-val">{(serrorRate * 100).toFixed(0)}%</span>
               </div>
               <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={serrorRate} 
                  onChange={e => setSerrorRate(Number(e.target.value))} 
                  className="visual-slider" 
               />
               <small className="hint">Percentage of connections that have SYN errors.</small>
            </div>

            <div className="presets-section">
               <h4>Quick Presets</h4>
               <div className="preset-buttons">
                  <button onClick={() => applyPreset('normal')} className="btn-preset safe">
                     <FiShield /> Normal (5)
                  </button>
                  <button onClick={() => applyPreset('smurf')} className="btn-preset danger">
                     <FiCrosshair /> Smurf DDoS (511)
                  </button>
                  <button onClick={() => applyPreset('neptune')} className="btn-preset danger">
                     <FiAlertCircle /> Neptune SYN Flood (250, 100% Err)
                  </button>
                  <button onClick={() => applyPreset('rootkit')} className="btn-preset stealth">
                     <FiActivity /> Stealth Rootkit (1)
                  </button>
               </div>
            </div>

            <div className="playback-controls">
               <button className="btn-play" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? "⏸️ Pause Animation" : "▶️ Resume Animation"}
               </button>
               <button className="btn-clear" onClick={() => { particlesRef.current = []; explosionsRef.current = []; }}>
                  🧹 Clear Packets
               </button>
            </div>
         </div>

         <div className="canvas-wrapper">
            <div className="canvas-overlay">
               {count > 200 ? (
                  <span className="status-blinker red">CRITICAL TRAFFIC LOAD</span>
               ) : (
                  <span className="status-blinker green">NETWORK STABLE</span>
               )}
            </div>
            <canvas ref={canvasRef} className="impact-canvas"></canvas>
         </div>
      </div>
    </div>
  );
}

// Temporary fallback for icon
const FiAlertCircle = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);
