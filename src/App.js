import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import StatsPage from './pages/StatsPage';
import AboutPage from './pages/About';  // Import AboutPage
import LeaderboardPage from './pages/LeaderboardPage';  // Import the LeaderboardPage


import { auth } from './firebase/firebase';
import { useEffect, useState } from 'react';

function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/stats" element={
          <PrivateRoute>
            <StatsPage />
          </PrivateRoute>
        } />
        <Route path="/about" element={
  <PrivateRoute>
    <AboutPage />
  </PrivateRoute>
} />
<Route path="/leaderboard" element={
  <PrivateRoute>
    <LeaderboardPage />
  </PrivateRoute>
} />
      </Routes>
    </Router>
  );
}

export default App;
