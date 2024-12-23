import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const kids = [
  { id: 1, name: 'Mira' },
  { id: 2, name: 'Shea' }
];

function StatsPage() {
  const [selectedKid, setSelectedKid] = useState(null);
  const [kidData, setKidData] = useState(null);
  const [chartData, setChartData] = useState({});

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

  // Fetch Stats (Memoized)
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

  // Fetch stats on kid selection
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div style={styles.container}>
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
          <div style={styles.chartContainer}>
            <Bar data={chartData} options={{ responsive: true }} />
          </div>
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
  kidButton: {
    margin: '10px',
    padding: '12px 24px',
    fontSize: '18px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#007BFF',
    color: 'white',
    transition: 'background-color 0.3s ease'
  },
  kidButtonHover: {
    backgroundColor: '#0056b3'
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
  },
  chartContainer: {
    marginTop: '20px',
    height: '400px'
  },
  noDataText: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#666'
  }
};

export default StatsPage;
