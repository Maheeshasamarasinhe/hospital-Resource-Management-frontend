import { useState } from "react";
import Navbar from "./components/Navbar";
import StatsBar from "./components/StatsBar";
import PredictionForm from "./components/PredictionForm";
import ResultPanel from "./components/ResultPanel";
import "./App.css";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="app-root">
      <Navbar />
      <StatsBar />

      <main className="app-main">
        {/* Left sidebar */}
        <aside className="sidebar">
          <div className="sidebar-card">
            <h4>ℹ️ How It Works</h4>
            <ol>
              <li>Select a disease category and target month</li>
              <li>Past case counts load automatically from the database</li>
              <li>Enter current environmental readings</li>
              <li>Set festival &amp; awareness indicators</li>
              <li>Click Generate to get AI predictions</li>
            </ol>
          </div>
          <div className="sidebar-card accent">
            <h4>🤖 Model Info</h4>
            <p>Hybrid Bidirectional LSTM + Attention mechanism trained on 10 years of Sri Lanka hospital data.</p>
            <div className="model-tags">
              <span>LSTM</span><span>Attention</span><span>Multi-Output</span>
            </div>
          </div>
          <div className="sidebar-card">
            <h4>📌 Disease Categories</h4>
            <ul className="disease-list">
              <li><span>🦟</span> Dengue</li>
              <li><span>🚗</span> Road Accidents</li>
              <li><span>❤️</span> Heart Patients</li>
              <li><span>🤢</span> Gastroenteritis</li>
              <li><span>🫁</span> Tuberculosis</li>
              <li><span>🤧</span> Common Cold</li>
              <li><span>🌡️</span> Fever</li>
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <section className="content">
          <div className="content-header">
            <div className="content-title-group">
              <h1>Disease Case Prediction</h1>
              <p>AI-powered monthly hospital resource planning for Sri Lanka</p>
            </div>
          </div>
          {!result
            ? <PredictionForm onResult={setResult} />
            : <ResultPanel result={result} onReset={() => setResult(null)} />
          }
        </section>
      </main>

      <footer className="app-footer">
        <span>© 2026 MediPredict AI · Hospital Resource Intelligence System</span>
        <span>Powered by Hybrid Bidirectional LSTM + Attention Neural Network</span>
      </footer>
    </div>
  );
}
