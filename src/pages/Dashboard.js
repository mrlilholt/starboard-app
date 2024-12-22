import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import STARBOARD from '/public/STARBOARD.gif';
import defaultPic from '/public/default_kid.png';

const kids = [
  { id: 1, name: 'Mira', image: '/public/mira.png' },
  { id: 2, name: 'Shea', image: '/public/shea.png' }
];

function Dashboard() {
  const [selectedKid, setSelectedKid] = useState(null);
  const [stars, setStars] = useState(0);
  const [recommend, setRecommend] = useState(false);

  const handleSelectKid = (kid) => {
    setSelectedKid(kid);
    setStars(0);
    setRecommend(false);
  };

  const handleRating = (rating) => {
    setStars(rating);
    if (rating > 0) setRecommend(false);
  };

  const handleSave = () => {
    console.log(`Saving rating for ${selectedKid.name}: ${stars} stars`);
    if (recommend) console.log(`${selectedKid.name} marked as Would Not Recommend`);
    setSelectedKid(null);
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src={STARBOARD} alt="Starboard Logo" style={styles.logo} />
        <div style={styles.userSection}>
          <img src={auth.currentUser?.photoURL} alt="User" style={styles.userIcon} />
          <button onClick={logout} style={styles.logoutButton}>Logout</button>
        </div>
      </header>

      <h1>Rate Your Child's Behavior</h1>
      <div style={styles.cardContainer}>
        {kids.map((kid) => (
          <div key={kid.id} style={styles.card} onClick={() => handleSelectKid(kid)}>
            <img src={kid.image || defaultPic} alt={kid.name} style={styles.kidImage} />
            <p>{kid.name}</p>
          </div>
        ))}
      </div>

      {selectedKid && (
        <div style={styles.modal}>
          <h2>Rate {selectedKid.name}</h2>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={styles.star} onClick={() => handleRating(i + 1)}>
              {i < stars ? '⭐' : '☆'}
            </span>
          ))}
          {stars === 0 && (
            <div>
              <input
                type="checkbox"
                checked={recommend}
                onChange={() => setRecommend(!recommend)}
              /> Would Not Recommend
            </div>
          )}
          <button onClick={handleSave}>Save</button>
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
    height: '100vh',
    textAlign: 'center'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '10px 20px'
  },
  logo: {
    width: '150px'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center'
  },
  userIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px'
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  cardContainer: {
    display: 'flex',
    gap: '20px'
  },
  card: {
    cursor: 'pointer',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px'
  },
  kidImage: {
    width: '100px',
    height: '100px',
    borderRadius: '10px'
  },
  modal: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: 'white'
  },
  star: {
    fontSize: '2rem',
    cursor: 'pointer'
  }
};

export default Dashboard;
