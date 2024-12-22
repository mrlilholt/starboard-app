import { useState } from 'react';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth } from '../firebase/firebase';

const db = getFirestore();

function Dashboard() {
  const [hover, setHover] = useState(0);
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = '/';
  };

  const handleRating = async (value) => {
    if (!user) return;

    const userRef = doc(db, 'ratings', user.uid);
    await updateDoc(userRef, {
      ratings: arrayUnion({
        stars: value,
        date: new Date().toISOString(),
      })
    });

    alert(`You gave ${value} stars!`);
  };

  const getFillPercentage = (index) => {
    return Math.min(Math.max((hover - index) * 100, 0), 100);
  };

  return (
    <div style={styles.container}>
      <h1>Rate Your Child's Behavior</h1>
      <div style={styles.ratingContainer}>
        {[...Array(5)].map((_, index) => {
          const unicornValue = index + 1;

          return (
            <div
              key={index}
              onClick={() => handleRating(unicornValue)}
              onMouseMove={() => setHover(unicornValue)}
              onMouseLeave={() => setHover(0)}
              style={{
                ...styles.unicorn,
                background: `linear-gradient(90deg, #FF69B4 ${getFillPercentage(index)}%, #ccc ${getFillPercentage(index)}%)`,
              }}
            >
              🦄
            </div>
          );
        })}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  ratingContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '3rem',
    cursor: 'pointer',
  },
  unicorn: {
    display: 'inline-block',
    width: '50px',
    height: '50px',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitBackgroundClip: 'text',
  }
};

export default Dashboard;
