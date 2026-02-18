import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import "./ResultPanel.css";

const DISEASE_META = {
  Dengue:         { icon: "🦟", color: "#e63c3c", ward: "Infectious Disease Ward" },
  Road_Accidents: { icon: "🚗", color: "#f59e0b", ward: "Emergency / Trauma Ward" },
  Heart_Patients: { icon: "❤️", color: "#ef4444", ward: "Cardiac ICU" },
  Hadisi_Anthuru: { icon: "🤢", color: "#8b5cf6", ward: "General Medicine Ward" },
  Tuberculosis:   { icon: "🫁", color: "#0a5c7f", ward: "Respiratory Ward" },
  Cold:           { icon: "🤧", color: "#3b82f6", ward: "OPD / Outpatient" },
  Fever:          { icon: "🌡️", color: "#10b981", ward: "General Ward" },
};

function severity(count) {
  if (count > 150) return { label: "Critical", cls: "sev-critical" };
  if (count > 100) return { label: "High",     cls: "sev-high" };
  if (count > 60)  return { label: "Moderate", cls: "sev-moderate" };
  return               { label: "Low",      cls: "sev-low" };
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label.replace("_", " ")}</strong>
      <span>{payload[0].value} expected cases</span>
    </div>
  );
};

export default function ResultPanel({ result, onReset }) {
  const { predictions, total_expected_patients, recommendation, month, category } = result;

  const displayPredictions = category === "all"
    ? predictions
    : { [category]: predictions[category] };

  const maxCount = Math.max(...Object.values(displayPredictions));

  const barData   = Object.entries(predictions).map(([k, v]) => ({
    name: k.replace("_", " "), value: v, fill: DISEASE_META[k]?.color || "#0a5c7f"
  }));
  const radarData = Object.entries(predictions).map(([k, v]) => ({
    subject: k.replace("_", " "), A: v
  }));

  return (
    <div className="result-panel">
      <div className="result-header">
        <div>
          <h2>Prediction Results</h2>
          <p>Target: <strong>{month}</strong> · Category: <strong>{category === "all" ? "All Diseases" : category.replace("_", " ")}</strong></p>
        </div>
        <button className="btn-reset" onClick={onReset}>← New Prediction</button>
      </div>

      <div className="summary-card">
        <span className="summary-icon">🏥</span>
        <div>
          <div className="summary-total">
            {total_expected_patients.toLocaleString()}
            <span>total expected patients</span>
          </div>
          <div className="summary-sub">Across all disease categories · {month} forecast</div>
        </div>
      </div>

      <div className="disease-cards">
        {Object.entries(displayPredictions).map(([disease, count]) => {
          const meta = DISEASE_META[disease] || { icon: "🔬", color: "#0a5c7f", ward: "General Ward" };
          const sev  = severity(count);
          const pct  = maxCount > 0 ? (count / maxCount) * 100 : 0;
          return (
            <div className="d-card" key={disease} style={{ "--c": meta.color }}>
              <div className="d-card-top">
                <span className="d-icon">{meta.icon}</span>
                <span className={`d-sev ${sev.cls}`}>{sev.label}</span>
              </div>
              <div className="d-count">{count}</div>
              <div className="d-name">{disease.replace("_", " ")}</div>
              <div className="d-ward">{meta.ward}</div>
              <div className="d-bar-wrap">
                <div className="d-bar-fill" style={{ width: `${pct}%`, background: meta.color }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h4>Case Count Comparison</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 4, right: 10, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#4a6178" }} angle={-35} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: "#4a6178" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#1399c6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Disease Distribution Radar</h4>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#dde3ec" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#4a6178" }} />
              <PolarRadiusAxis tick={{ fontSize: 9 }} />
              <Radar name="Cases" dataKey="A" stroke="#1399c6" fill="#1399c6" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recommendations">
        <h4>🩺 Resource Allocation Recommendations</h4>
        <ul>
          {recommendation.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>
    </div>
  );
}
