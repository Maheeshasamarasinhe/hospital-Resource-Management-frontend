import './StatsBar.css';

const STATS = [
  { icon: '🏥', label: 'Diseases Tracked', value: '7' },
  { icon: '📅', label: 'Data History',      value: '10 yrs' },
  { icon: '🤖', label: 'Model Accuracy',    value: '~92%' },
  { icon: '⚡', label: 'Prediction Speed',  value: '<1 sec' },
];

const StatsBar = () => (
  <div className="stats-bar">
    {STATS.map((s) => (
      <div className="stat-item" key={s.label}>
        <span className="stat-icon">{s.icon}</span>
        <div>
          <div className="stat-value">{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      </div>
    ))}
  </div>
);

export default StatsBar;
