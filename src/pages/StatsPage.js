import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Bar } from 'react-chartjs-2';

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
  }, [selectedKid, processCumulativeData]);  // Dependency Fixed

  // Real-time Listener
  useEffect(() => {
    if (selectedKid) {
      const docRef = doc(db, 'stars', selectedKid.name);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setKidData(docSnap.data());
          processCumulativeData(docSnap.data());
        }
      });
      return () => unsubscribe();
    }
  }, [selectedKid, processCumulativeData]);  // Dependency Fixed

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

      {kidData && (
        <div style={styles.statsContainer}>
          <h2>{selectedKid.name}'s Stats</h2>
          <p>Total Stars: {kidData.history?.reduce((a, b) => a + b, 0)}</p>
          <Bar data={chartData} />
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
    padding: '20px'
  },
  kidButton: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#007BFF',
    color: 'white'
  },
  statsContainer: {
    marginTop: '30px',
    width: '80%',
    maxWidth: '800px'
  }
};

export default StatsPage;
