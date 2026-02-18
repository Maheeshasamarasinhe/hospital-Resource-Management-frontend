import './Navbar.css';

const Navbar = () => (
  <header className="navbar">
    <div className="navbar-inner">
      <div className="nav-brand">
        <div className="nav-logo">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </div>
        <div className="nav-title-group">
          <span className="nav-title">MediPredict AI</span>
          <span className="nav-subtitle">Hospital Resource Intelligence</span>
        </div>
      </div>
      <nav className="nav-links">
        <span className="nav-badge">
          <span className="badge-dot"></span>Model Active
        </span>
      </nav>
    </div>
  </header>
);

export default Navbar;
