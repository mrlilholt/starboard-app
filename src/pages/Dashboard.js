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
  const [newCategory, setNewCategory] = useState('');

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
    if (newCategory && !categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
      setNewCategory('');
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
          </div>
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              style={styles.star} 
              onClick={() => handleRating(activeCategory, i + 1)}>
              {i < ratings[activeCategory] ? '⭐' : '☆'}
            </span>
          ))}
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
          <div style={styles.addCategoryContainer}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add new category"
            />
            <button onClick={handleAddCategory}>Add</button>
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
  categoryTabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '10px'
  },
  tab: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    cursor: 'pointer',
    borderRadius: '6px'
  },
  activeTab: {
    padding: '8px 16px',
    border: '1px solid #007BFF',
    backgroundColor: '#007BFF',
    color: 'white',
    borderRadius: '6px'
  },
  star: {
    fontSize: '2rem',
    cursor: 'pointer'
  },
  saveButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  addCategoryContainer: {
    marginTop: '20px'
  }
};

export default Dashboard;
