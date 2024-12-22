import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const kids = [
  { id: 1, name: 'Mira', image: '/mira.png' },
  { id: 2, name: 'Shea', image: '/shea.png' }
];

const initialCategories = ['Cleaning', 'Kindness', 'Listening', 'Helping', 'Sharing'];

function Dashboard() {
  const [selectedKid, setSelectedKid] = useState(null);
  const [ratings, setRatings] = useState({});
  const [recommend, setRecommend] = useState(false);
  const [activeCategory, setActiveCategory] = useState(initialCategories[0]);
  const [categories, setCategories] = useState(initialCategories);

  const handleSelectKid = (kid) => {
    setSelectedKid(kid);
    setRatings({});
    setRecommend(false);
  };

  const handleRating = (category, rating) => {
    setRatings((prev) => ({ ...prev, [category]: rating }));
    if (rating > 0) setRecommend(false);
  };

  const handleSave = () => {
    console.log(`Saving ratings for ${selectedKid.name}:`, ratings);
    if (recommend) console.log(`${selectedKid.name} marked as Would Not Recommend`);
    setSelectedKid(null);
  };

  const handleAddCategory = () => {
    const newCategory = prompt('Enter new category:');
    if (newCategory && !categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
    }
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src="/STARBOARD.gif" alt="Starboard Logo" style={styles.logo} />
        <div style={styles.userSection}>
          <img src={auth.currentUser?.photoURL} alt="User" style={styles.userIcon} />
          <button onClick={logout} style={styles.logoutButton}>Logout</button>
        </div>
      </header>

      <h1>Rate Your Child's Behavior</h1>
      <div style={styles.cardContainer}>
        {kids.map((kid) => (
          <div key={kid.id} style={styles.card} onClick={() => handleSelectKid(kid)}>
            <img src={kid.image} alt={kid.name} style={styles.kidImage} />
            <p>{kid.name}</p>
          </div>
        ))}
      </div>

      {selectedKid && (
        <div style={styles.modal}>
          <h2>Rate {selectedKid.name}</h2>
          <div style={styles.categoryTabs}>
            {categories.map((cat) => (
              <button 
                key={cat} 
                style={cat === activeCategory ? styles.activeTab : styles.tab}
                onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
            <button onClick={handleAddCategory} style={styles.addButton}>+ Add Category</button>
          </div>
          <div style={styles.starsContainer}>
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                style={styles.star} 
                onClick={() => handleRating(activeCategory, i + 1)}>
                {i < ratings[activeCategory] ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          <button onClick={handleSave} style={styles.saveButton}>Save</button>
          {ratings[activeCategory] === 0 && (
            <div>
              <input
                type="checkbox"
                checked={recommend}
                onChange={() => setRecommend(!recommend)}
              /> Would Not Recommend
            </div>
          )}
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
    minHeight: '100vh',
    textAlign: 'center',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '10px 20px',
    boxSizing: 'border-box'
  },
  logo: {
    width: '120px',
    height: 'auto'
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
    padding: '8px 12px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto'
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
  categoryTabs: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px'
  },
  starsContainer: {
    marginBottom: '15px'
  },
  star: {
    fontSize: '2.5rem',
    cursor: 'pointer'
  },
  saveButton: {
    marginTop: '15px',
    padding: '10px 24px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};

export default Dashboard;
