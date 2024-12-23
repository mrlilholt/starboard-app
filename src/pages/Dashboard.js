import React, { useState, useCallback, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { doc, setDoc, updateDoc, getDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { Link } from 'react-router-dom';

const kids = [
  { id: 1, name: 'Mira', image: '/mira.png' },
  { id: 2, name: 'Shea', image: '/shea.png' }
];

const initialCategories = ['Cleaning', 'Kindness', 'Listening', 'Helping', 'Sharing'];

function Dashboard() {
  const [selectedKid, setSelectedKid] = useState(null);
  const [ratings, setRatings] = useState({});
  const [categories, setCategories] = useState(initialCategories);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // const [kidData, setKidData] = useState(null);  // Commented out to avoid eslint error
  // Suppress unused warning for now
// eslint-disable-next-line no-unused-vars
const [kidData, setKidData] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const fetchStats = useCallback(async () => {
    console.log("Fetching stats...");
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (selectedKid) {
      const docRef = doc(db, 'stars', selectedKid.name);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setKidData(docSnap.data());
        } else {
          setKidData({});
        }
      });
      return () => unsubscribe();
    }
  }, [selectedKid]);

  const handleSelectKid = (kid) => {
    setSelectedKid(kid);
    setRatings({});
    setShowCategories(false);
    setActiveCategory(null);
  };

  const handleRating = (category, rating) => {
    setRatings((prev) => ({ ...prev, [category]: rating }));
    setShowCategories(false);
  };

  const handleSave = async () => {
    if (!selectedKid) return;

    const docRef = doc(db, 'stars', selectedKid.name);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        history: [],
        ...Object.fromEntries(categories.map((cat) => [cat, 0]))
      });
    }

    const updates = {};
    Object.entries(ratings).forEach(([category, stars]) => {
      updates[category] = (docSnap.data()?.[category] || 0) + stars;
    });

    const todayStars = Object.values(ratings).reduce((a, b) => a + b, 0);
    updates['history'] = arrayUnion(todayStars);

    try {
      await updateDoc(docRef, updates);
      console.log(`Saved ratings for ${selectedKid.name}`);
    } catch (error) {
      console.error("Error saving data:", error);
    }

    setSelectedKid(null);
    setRatings({});
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
      {/* Top Bar for Logo, Menu, and User Icon */}
      <div style={styles.topBar}>
        <img src="/STARBOARD.gif" alt="Starboard Logo" style={styles.logo} />
        <div style={styles.rightSection}>
          <div style={styles.menuIcon} onClick={toggleMenu}>
            ☰
          </div>
          <img
            src={auth.currentUser?.photoURL}
            alt="User"
            style={styles.userIcon}
          />
        </div>
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

          <div>
            <img
              src="/toybox-icon.png"
              alt="Select Category"
              style={styles.toyBoxIcon}
              onClick={() => setShowCategories(!showCategories)}
            />
            {showCategories && (
              <div style={styles.categoryDropdown}>
                {categories.map((cat) => (
                  <div
                    key={cat}
                    style={styles.categoryItem}
                    onClick={() => setActiveCategory(cat)}>
                    {cat}
                  </div>
                ))}
                <div style={styles.addCategory} onClick={handleAddCategory}>
                  + Add Category
                </div>
              </div>
            )}
          </div>

          {activeCategory && (
            <div>
              <h3>{activeCategory}</h3>
              <div style={styles.starsContainer}>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    style={styles.largeStar}
                    onClick={() => handleRating(activeCategory, i + 1)}>
                    {i < (ratings[activeCategory] || 0) ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleSave} style={styles.saveButton}>
            Save
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
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '150px',
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
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    right: '10px',
    top: '60px',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    zIndex: 10
  },
  menuItem: {
    padding: '12px 20px',
    textDecoration: 'none',
    color: '#333',
    fontSize: '1rem'
  },
  // Add spacing between menu items
  menuItemSpacing: {
    marginBottom: '10px'
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px'
  },
  card: {
    width: '200px',
    cursor: 'pointer',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  kidImage: {
    width: '100%',
    height: 'auto',
  },
  modal: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: 'white',
    maxWidth: '600px',
    width: '90%',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    overflowY: 'auto',
  },
  toyBoxIcon: {
    width: '120px',  // Shrink icon size
    cursor: 'pointer',
    marginTop: '10px'
  },
  categoryDropdown: {
    marginTop: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: '#f9f9f9'
  },
  categoryItem: {
    padding: '12px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s ease'
  },
  // Highlight category on hover
  categoryItemHover: {
    backgroundColor: '#efefef'
  },
  saveButton: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  largeStar: {
    fontSize: '2.5rem',
    cursor: 'pointer',
    margin: '0 5px'
  }
};

export default Dashboard;
