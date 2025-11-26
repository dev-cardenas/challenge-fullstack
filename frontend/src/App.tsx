import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { FormPage } from './pages/FormPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="container nav-content">
          <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary-main)' }}>
            FullstackChallenge
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Formulario
            </NavLink>
            <NavLink 
              to="/admin" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Admin
            </NavLink>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
