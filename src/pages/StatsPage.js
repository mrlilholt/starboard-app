import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const kids = [
  { id: 1, name: 'Mira' },
  { id: 2, name: 'Shea' }
];

function StatsPage() {
  const [selectedKid, setSelectedKid] = useState(null);
  const [kidData, setKidData] = useState({});
  const [chartData, setChartData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (selectedKid) {
      const docRef = doc(db, 'stars', selectedKid.name);

      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setKidData(data);
          processCumulativeData(data.history);
        } else {
          setKidData({});
          setChartData(null);
        }
      });

      return () => unsubscribe();
    }
  }, [selectedKid, selectedCategory, startDate, endDate]);

  const processCumulativeData = (history) => {
    if (!history) return;

    let cumulativeSum = 0;
    const filteredHistory = history.filter((day) => {
      const date = new Date(day.date);
      const inRange = (!startDate || date >= new Date(startDate)) &&
                      (!endDate || date <= new Date(endDate));

      return selectedCategory === 'All' || day.category === selectedCategory ? inRange : false;
    });

    const labels = filteredHistory.map((_, i) => `Day ${i + 1}`);
    const dataset = filteredHistory.map((day) => {
      cumulativeSum += day.stars;
      return cumulativeSum;
    });

    const annotations = dataset.map((value, index) => {
      if (value % 50 === 0) {
        return {
          type: 'line',
          scaleID: 'y',
          value,
          borderColor: 'red',
          borderWidth: 2,
          label: {
            content: `🎉 ${value} Stars!`,
            enabled: true,
            position: 'start'
          }
        };
      }
      return null;
    }).filter(Boolean);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Cumulative Star Count',
          data: dataset,
          fill: true,
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.3,
          pointRadius: 5,
        }
      ],
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                return `Total Stars: ${tooltipItem.raw}`;
              }
            }
          },
          annotation: {
            annotations
          }
        }
      }
    });
  };

  const totalStars = Object.entries(kidData)
    .filter(([key]) => key !== 'history')
    .reduce((acc, [_, val]) => acc + val, 0);

  const categories = Object.keys(kidData).filter((key) => key !== 'history');

  return (
    <div style={styles.container}>
      <h1>Starboard Stats</h1>

      <div style={styles.selectKid}>
        {kids.map((kid) => (
          <button
            key={kid.id}
            style={styles.kidButton}
            onClick={() => setSelectedKid(kid)}
          >
            {kid.name}
          </button>
        ))}
      </div>

      {selectedKid && (
        <div style={styles.statsContainer}>
          <h2>{selectedKid.name}'s Stats</h2>
          <p>Total Stars: {totalStars}</p>

          <div style={styles.filters}>
            <label>Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.dropdown}
            >
              <option value="All">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={styles.dateInput}
            />

            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={styles.dateInput}
            />
          </div>

          {chartData && (
            <div style={styles.chartContainer}>
              <Line data={chartData} options={chartData.options} />
            </div>
          )}

          <div style={styles.breakdown}>
            <h3>Breakdown by Category:</h3>
            {categories.map((cat) => (
              <p key={cat}>
                {cat}: {kidData[cat]} ⭐
              </p>
            ))}
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
    textAlign: 'center'
  },
  selectKid: {
    display: 'flex',
    gap: '20px',
    margin: '20px 0'
  },
  kidButton: {
    padding: '10px 20px',
    fontSize: '18px',
    cursor: 'pointer',
    borderRadius: '8px',
    border: '1px solid #ccc'
  },
  statsContainer: {
    marginTop: '30px',
    textAlign: 'left'
  },
  filters: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    margin: '20px 0'
  },
  dropdown: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '6px'
  },
  dateInput: {
    padding: '6px',
    fontSize: '16px',
    borderRadius: '6px'
  },
  chartContainer: {
    margin: '30px 0',
    width: '600px'
  },
  breakdown: {
    marginTop: '20px',
    textAlign: 'left'
  }
};

export default StatsPage;
