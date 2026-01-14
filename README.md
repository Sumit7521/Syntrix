# SyntriX | AI-Powered Autonomous Network Defense

![SyntriX Hero Banner](public/hero.png)

**SyntriX** is a next-generation security dashboard that uses advanced machine learning ensemble models (Random Forest, XGBoost, AdaBoost) to detect, analyze, and neutralize network threats in real-time.

Designed for enterprise security operations centers (SOCs), SyntriX provides deep visibility into network traffic, feature importance analysis, and predictive threat modelling.

---

## 🚀 Key Features

### 🛡️ Autonomous Threat Detection
- **Real-Time Inference**: Analyzes packet data with <10ms latency using pre-trained ML models.
- **Ensemble Learning**: compare performance across multiple classifiers (RF, XGB, DT, AdaBoost).
- **Attack Classification**: Identifies specific attack vectors (DoS, Probe, U2R, R2L).

### 📊 Deep Analytics & Forensics
- **Feature Importance**: Visualizes which network parameters (e.g., `src_bytes`, `dst_host_count`) triggered the alert.
- **Correlation Heatmaps**: Interactive heatmaps to uncover hidden relationships between network features.
- **Model Metrics**: Detailed breakdown of Accuracy, Precision, Recall, and F1-Scores.

### 🌐 Modern Enterprise UX
- **Professional Landing Page**: High-trust, animation-driven entrance.
- **Responsive Dashboard**: Mobile-optimized sidebar and layout.
- **Dark Mode**: Engineered "Deep Navy" theme for reduced eye strain in dark SOC environments.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: React 19
- **Styling**: Custom CSS Variables (No external UI libraries for core layout)
- **Animations**: Framer Motion
- **Visualization**: Recharts
- **Icons**: React Icons

---

## 📂 Project Structure

The project uses the **Next.js App Router** with **Route Groups** to manage different layouts.

```
c:\Users\LENOVO\Desktop\SyntriX
├── app/
│   ├── (main)/                 # Application Pages (Sidebar Layout)
│   │   ├── dashboard/          # Main System Overview
│   │   ├── feature/            # Feature Importance Analysis
│   │   ├── heatmap/            # Correlation Heatmaps
│   │   ├── metrics/            # Model Performance Metrics
│   │   ├── predict/            # Interactive Attack Prediction
│   │   └── layout.js           # Layout with Sidebar
│   ├── layout.js               # Root Layout (Clean, for Landing Page)
│   ├── page.js                 # Landing Page (Marketing)
│   ├── globals.css             # Base Styles
│   └── landing.css             # Landing Page Specific Styles
├── src/
│   ├── components/             # Reusable UI Components
│   │   ├── Charts/             # Visualization Components
│   │   ├── Sidebar.jsx         # Navigation Sidebar
│   │   └── ...
└── public/                     # Static Assets
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18.17 or later

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/syntrix.git
    cd syntrix
    ```

2.  Install dependencies:
    ```bash
    npm install
    # Note: Requires framer-motion, recharts, react-icons
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Layout System

SyntriX uses a **Dual Layout System**:
1.  **Landing Page (`/`)**: Uses `app/layout.js`. A clean, full-screen marketing layout without persistent navigation.
2.  **Dashboard App (`/dashboard`, `/predict`, etc.)**: Moved into `app/(main)/`. These pages inherit `app/(main)/layout.js`, which includes the **Sidebar** and the main content wrapper.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
