import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Link } from 'react-router-dom';

const kids = [
  { id: 1, name: 'Mira' },
  { id: 2, name: 'Shea' }
];

function StatsPage() {
  const [selectedKid, setSelectedKid] = useState(null);
  const [kidData, setKidData] = useState(null);
  const [chartData, setChartData] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  // Process Cumulative Data
  const processCumulativeData = useCallback((data) => {
    const history = data.history || [];
    const labels = history.map((_, index) => `Day ${index + 1}`);
    const cumulativeStars = history.reduce((acc, curr) => {
      const total = acc.length ? acc[acc.length - 1] + curr : curr;
      return [...acc, total];
    }, []);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Cumulative Stars',
          data: cumulativeStars,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: true
        }
      ]
    });
  }, []);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    if (selectedKid) {
      const docRef = doc(db, 'stars', selectedKid.name);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setKidData(docSnap.data());
        processCumulativeData(docSnap.data());
      } else {
        setKidData(null);
      }
    }
  }, [selectedKid, processCumulativeData]);

  // Real-time Listener
  useEffect(() => {
    if (selectedKid) {
      const docRef = doc(db, 'stars', selectedKid.name);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setKidData(docSnap.data());
          processCumulativeData(docSnap.data());
        } else {
          setKidData(null);
        }
      });
      return () => unsubscribe();
    }
  }, [selectedKid, processCumulativeData]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Reset Stats for Selected Kid
  const clearAllStats = async () => {
    if (selectedKid) {
      const confirmClear = window.confirm(`Are you sure you want to reset all stats for ${selectedKid.name}?`);
      if (confirmClear) {
        const docRef = doc(db, 'stars', selectedKid.name);
        const resetData = {};

        // Reset categories to zero and clear history
        Object.keys(kidData).forEach((key) => {
          resetData[key] = key === 'history' ? [] : 0;
        });

        try {
          await updateDoc(docRef, resetData);
          setKidData((prev) => ({ ...resetData }));
          setChartData({});  // Reset the chart
          console.log(`${selectedKid.name}'s stats have been reset.`);
        } catch (error) {
          console.error("Error resetting stats:", error);
        }
      }
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src="/STARBOARD.gif" alt="Starboard Logo" style={styles.logo} />

        <div style={styles.rightSection}>
          <div style={styles.menuIcon} onClick={toggleMenu}>
            ☰
          </div>

          {menuOpen && (
            <div style={styles.menuDropdown}>
              <Link to="/dashboard" style={styles.menuItem}>Dashboard</Link>
              <Link to="/stats" style={styles.menuItem}>Stats</Link>
              <Link to="/about" style={styles.menuItem}>About</Link>
              <div style={styles.menuItem} onClick={logout}>Logout</div>
            </div>
          )}

          <img
            src={auth.currentUser?.photoURL}
            alt="User"
            style={styles.userIcon}
          />
        </div>
      </header>

      <h1>Stats Page</h1>
      <div>
        {kids.map((kid) => (
          <button
            key={kid.id}
            onClick={() => setSelectedKid(kid)}
            style={styles.kidButton}
          >
            {kid.name}
          </button>
        ))}
      </div>

      {selectedKid && !kidData && (
        <p style={styles.noDataText}>No data available for {selectedKid.name} yet.</p>
      )}

      {kidData && (
        <div style={styles.statsContainer}>
          <h2>{selectedKid.name}'s Stats</h2>
          <p>Total Stars: {kidData.history?.reduce((a, b) => a + b, 0)}</p>

          <div style={styles.categoryStats}>
            {Object.entries(kidData)
              .filter(([key]) => key !== 'history')
              .map(([category, stars]) => (
                <p key={category} style={styles.categoryItem}>
                  {category}: {stars} ⭐
                </p>
              ))}
          </div>

          <div style={styles.chartContainer}>
            <Bar data={chartData} options={{ responsive: true }} />
          </div>

          {/* Clear All Stats Button */}
          <button onClick={clearAllStats} style={styles.clearButton}>
            Clear All Stats
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '10px 20px'
  },
  clearButton: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#FF0000',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  statsContainer: {
    marginTop: '30px',
    padding: '20px',
    width: '80%',
    maxWidth: '800px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  }
};

export default StatsPage;
