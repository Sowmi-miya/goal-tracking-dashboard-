import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

export default function Navbar() {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Navbar on login/signup pages
  if (location.pathname === '/' || location.pathname === '/signup') {
    return null;
  }

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate('/'))
      .catch(err => alert('Logout failed: ' + err.message));
  };

  // 🎯 Custom Titles
  let title = '';
  if (location.pathname === '/dashboard') {
    title = 'Conquer Your Day 💪 – Let’s Set Some Powerful Goals!';
  } else if (location.pathname === '/mygoals') {
    title = 'Review Your Wins 📈';
  }

  return (
    <nav style={styles.nav}>
      <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.3rem', maxWidth: '80%' }}>
        {title}
      </div>

      {/* Hide links & logout on dashboard */}
      {location.pathname !== '/dashboard' && (
        <div>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/mygoals" style={styles.link}>My Goals</Link>
          {auth.currentUser && (
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#2b2b2b',
    padding: '12px 24px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  link: {
    color: '#fff',
    marginRight: 15,
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#ff4d4d',
    border: 'none',
    padding: '6px 12px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};
