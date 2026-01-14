"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import "./landing.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="bg-grid"></div>

      {/* Header */}
      <header className="landing-header">
        <div className="brand-logo">SyntriX</div>
        <Link href="/dashboard" className="nav-cta">
          Go to Console
        </Link>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="hero-badge">AI-Powered Security V2.0</span>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Autonomous Network Defense at Scale
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          SyntriX uses advanced ensemble learning to detect, analyze, and neutralize network threats with 99.9% accuracy.
          Monitor your infrastructure in real-time.
        </motion.p>

        <motion.div
          className="cta-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/dashboard" className="btn-primary">
            Launch Dashboard
          </Link>
          <Link href="https://github.com" className="btn-secondary">
            View Documentation
          </Link>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.div
        className="stats-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="stat-item">
          <span className="stat-value">2.4M+</span>
          <span className="stat-label">Packets Analyzed</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">99.9%</span>
          <span className="stat-label">Detection Accuracy</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">&lt;10ms</span>
          <span className="stat-label">Inference Latency</span>
        </div>
      </motion.div>

      {/* Features Section */}
      <section className="features-section">
        <motion.div
          className="features-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          <FeatureCard
            icon="⚡"
            title="Real-Time Inference"
            desc="Deploy random forest and XGBoost models that adapt to new attack vectors instantly."
          />
          <FeatureCard
            icon="🔍"
            title="Deep Forensics"
            desc="Granular feature importance analysis to understand exactly why a packet was flagged."
          />
          <FeatureCard
            icon="🛡️"
            title="Proactive Defense"
            desc="Predictive analytics that identify vulnerabilities before they can be exploited."
          />
        </motion.div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    className="feature-card"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
  >
    <div className="feature-icon-box">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-desc">{desc}</p>
  </motion.div>
);

export default LandingPage;