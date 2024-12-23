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
        const data = docSnap.data();
        setKidData(data);
  
        // Recalculate Total Stars from Categories
        const totalStars = Object.entries(data)
          .filter(([key]) => key !== 'history')  // Exclude history from category calc
          .reduce((acc, [_, value]) => acc + value, 0);
  
        // Process for Chart (Cumulative Graph)
        const history = data.history || [];
        const labels = history.map((_, index) => `Day ${index + 1}`);
        
        const cumulativeStars = history.reduce((acc, curr) => {
          const total = acc.length ? acc[acc.length - 1] + curr : curr;
          return [...acc, total];
        }, []);
  
        // Add category totals to cumulative graph if missing
        const latestTotal = cumulativeStars.length ? cumulativeStars[cumulativeStars.length - 1] : 0;
        if (totalStars > latestTotal) {
          cumulativeStars.push(totalStars);
          labels.push(`Day ${labels.length + 1}`);
        }
  
        setChartData({
          labels,
          datasets: [
            {
              label: 'Cumulative Stars',
              data: cumulativeStars,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
          ]
        });
      } else {
        setKidData(null);
      }
    }
  }, [selectedKid]);
  

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

        Object.keys(kidData).forEach((key) => {
          resetData[key] = key === 'history' ? [] : 0;
        });

        try {
          await updateDoc(docRef, resetData);
          setKidData((prev) => ({ ...resetData }));
          setChartData({});
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
              <Link to="/leaderboard" style={styles.menuItem}>Leaderboard</Link>
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
          <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
  Total Stars: {Object.values(kidData).reduce((acc, val) => typeof val === 'number' ? acc + val : acc, 0)}
</p>

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
    textAlign: 'center',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '150px',  // Match Dashboard
    height: 'auto'
  },
  menuIcon: {
    fontSize: '2rem',
    cursor: 'pointer',
    marginRight: '20px'
  },
  userIcon: {
    width: '40px',
    borderRadius: '50%',
  },
  menuDropdown: {
    position: 'absolute',
    top: '50px',
    right: '0',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 100
  },
  menuItem: {
    padding: '12px 20px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#333',
    display: 'block'
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
  }
};

export default StatsPage;
