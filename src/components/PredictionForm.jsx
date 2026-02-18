import { useState, useEffect } from 'react';
import axios from 'axios';
import './PredictionForm.css';

// Use proxy in development, or set VITE_API_URL in production
const API = import.meta.env.VITE_API_URL || '/api';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const DISEASE_CATEGORIES = [
  { value: 'all',            label: 'All Diseases',          icon: '🏥' },
  { value: 'Dengue',         label: 'Dengue',                icon: '🦟' },
  { value: 'Road_Accidents', label: 'Road Accidents',        icon: '🚗' },
  { value: 'Heart_Patients', label: 'Heart Disease',         icon: '❤️' },
  { value: 'Hadisi_Anthuru', label: 'Gastroenteritis',       icon: '🤢' },
  { value: 'Tuberculosis',   label: 'Tuberculosis',          icon: '🫁' },
  { value: 'Cold',           label: 'Common Cold',           icon: '🤧' },
  { value: 'Fever',          label: 'Fever',                 icon: '🌡️' },
];

const defaultEnv   = { humidity: '', rainfall: '', temperature: '' };
const defaultIndic = { festive: 'no', awareness: 0.5 };

export default function PredictionForm({ onResult }) {
  const [selection, setSelection] = useState({ category: 'all', month: new Date().getMonth() + 1 });
  const [env,       setEnv]       = useState(defaultEnv);
  const [indic,     setIndic]     = useState(defaultIndic);
  const [dbData,    setDbData]    = useState(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError,   setDbError]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  /* Auto-fetch case counts from DB when month changes */
  useEffect(() => {
    fetchDbCounts(selection.month);
  }, [selection.month]);

  const fetchDbCounts = async (month) => {
    setDbLoading(true);
    setDbError('');
    try {
      const res = await axios.get(`${API}/history`, { params: { month } });
      setDbData(res.data);
    } catch {
      setDbError('Could not auto-load past cases. You can still run prediction.');
      setDbData(null);
    } finally {
      setDbLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!env.humidity || !env.rainfall || !env.temperature) {
      setError('Please fill all Environmental Factor fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/predict-frontend`, {
        month:       selection.month,
        category:    selection.category,
        humidity:    parseFloat(env.humidity),
        rainfall:    parseFloat(env.rainfall),
        temperature: parseFloat(env.temperature),
        festive:     indic.festive === 'yes' ? 1 : 0,
        awareness:   parseFloat(indic.awareness),
      });
      onResult({ ...res.data, category: selection.category, month: MONTHS[selection.month - 1] });
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed. Make sure the Flask server is running.');
    } finally {
      setLoading(false);
    }
  };

  const awarVal = parseFloat(indic.awareness);
  const awarLevel = awarVal < 0.34 ? { label: 'Low', color: '#e63c3c' }
                  : awarVal < 0.67 ? { label: 'Moderate', color: '#f59e0b' }
                                   : { label: 'High', color: '#10b981' };

  return (
    <form className="pred-form" onSubmit={handleSubmit}>

      {/* ── Section 1: Selection Inputs ─────────────────── */}
      <div className="form-section">
        <div className="section-header">
          <span className="section-icon">🎯</span>
          <div>
            <h3>Selection Inputs</h3>
            <p>Choose disease category and prediction target month</p>
          </div>
        </div>

        <div className="field-grid-2">
          {/* Disease Category */}
          <div className="field-group">
            <label className="field-label">Disease Category</label>
            <div className="disease-grid">
              {DISEASE_CATEGORIES.map((d) => (
                <button
                  type="button"
                  key={d.value}
                  className={`disease-chip ${selection.category === d.value ? 'active' : ''}`}
                  onClick={() => setSelection(s => ({ ...s, category: d.value }))}
                >
                  <span>{d.icon}</span>
                  <span>{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Month */}
          <div className="field-group">
            <label className="field-label">Target Month</label>
            <div className="month-grid">
              {MONTHS.map((m, i) => (
                <button
                  type="button"
                  key={m}
                  className={`month-chip ${selection.month === i + 1 ? 'active' : ''}`}
                  onClick={() => setSelection(s => ({ ...s, month: i + 1 }))}
                >
                  {m.slice(0,3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Data Inputs ───────────────────────── */}
      <div className="form-section">
        <div className="section-header">
          <span className="section-icon">📊</span>
          <div>
            <h3>Data Inputs</h3>
            <p>Historical case counts are loaded automatically from the database</p>
          </div>
        </div>

        {/* DB Case Counts */}
        <div className="db-panel">
          <div className="db-panel-title">
            <span>📂 Current / Past Case Counts</span>
            <button type="button" className="btn-refresh" onClick={() => fetchDbCounts(selection.month)}>
              {dbLoading ? '⟳ Loading…' : '⟳ Refresh'}
            </button>
          </div>
          {dbLoading && <div className="db-loading"><span className="spinner"></span> Fetching from database…</div>}
          {dbError   && <div className="db-error">⚠ {dbError}</div>}
          {dbData && !dbLoading && (
            <div className="db-counts-grid">
              {Object.entries(dbData.avg_cases || {}).map(([disease, count]) => (
                <div className="db-count-card" key={disease}>
                  <div className="db-count-val">{Math.round(count)}</div>
                  <div className="db-count-label">{disease.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          )}
          {!dbData && !dbLoading && !dbError && (
            <p className="db-placeholder">Select a month to load historical averages.</p>
          )}
        </div>

        {/* Environmental Factors */}
        <div className="env-title">🌦 Environmental Factors <span className="manual-tag">Manual Input</span></div>
        <div className="field-grid-3">
          <div className="field-group">
            <label className="field-label">Humidity <span className="unit">(%)</span></label>
            <input
              className="field-input"
              type="number" min="0" max="100" step="0.1"
              placeholder="e.g. 78.5"
              value={env.humidity}
              onChange={e => setEnv(v => ({ ...v, humidity: e.target.value }))}
              required
            />
          </div>
          <div className="field-group">
            <label className="field-label">Rainfall <span className="unit">(mm)</span></label>
            <input
              className="field-input"
              type="number" min="0" step="0.1"
              placeholder="e.g. 215.4"
              value={env.rainfall}
              onChange={e => setEnv(v => ({ ...v, rainfall: e.target.value }))}
              required
            />
          </div>
          <div className="field-group">
            <label className="field-label">Temperature <span className="unit">(°C)</span></label>
            <input
              className="field-input"
              type="number" step="0.1"
              placeholder="e.g. 31.2"
              value={env.temperature}
              onChange={e => setEnv(v => ({ ...v, temperature: e.target.value }))}
              required
            />
          </div>
        </div>
      </div>

      {/* ── Section 3: Indicator Inputs ─────────────────── */}
      <div className="form-section">
        <div className="section-header">
          <span className="section-icon">🏮</span>
          <div>
            <h3>Indicator Inputs</h3>
            <p>Social and awareness indicators affecting disease spread</p>
          </div>
        </div>

        <div className="field-grid-2">
          {/* Festival Indicator */}
          <div className="field-group">
            <label className="field-label">Festival / Event Indicator</label>
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle-btn ${indic.festive === 'no' ? 'active-no' : ''}`}
                onClick={() => setIndic(v => ({ ...v, festive: 'no' }))}
              >
                ✗ No
              </button>
              <button
                type="button"
                className={`toggle-btn ${indic.festive === 'yes' ? 'active-yes' : ''}`}
                onClick={() => setIndic(v => ({ ...v, festive: 'yes' }))}
              >
                ✓ Yes
              </button>
            </div>
            <p className="field-hint">Are there major festivals or public events this month?</p>
          </div>

          {/* Awareness Slider */}
          <div className="field-group">
            <label className="field-label">
              Public Awareness Level
              <span className="awareness-badge" style={{ background: awarLevel.color }}>
                {awarLevel.label} — {awarVal.toFixed(2)}
              </span>
            </label>
            <div className="slider-wrap">
              <span className="slider-edge">0</span>
              <input
                className="range-slider"
                type="range" min="0" max="1" step="0.01"
                value={indic.awareness}
                onChange={e => setIndic(v => ({ ...v, awareness: e.target.value }))}
              />
              <span className="slider-edge">1</span>
            </div>
            <div className="slider-ticks">
              <span>Low</span><span>Moderate</span><span>High</span>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="form-error">⚠ {error}</div>}

      <button className="btn-predict" type="submit" disabled={loading}>
        {loading
          ? <><span className="spinner-btn"></span> Running Prediction…</>
          : <><span>🔮</span> Generate AI Prediction</>
        }
      </button>
    </form>
  );
}
