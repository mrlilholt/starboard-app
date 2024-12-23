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
  // Updated styles to fix card sizes, header alignment, and dropdown
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
  },
  kidImage: {
    width: '100%',
    height: 'auto',
  },
};

export default Dashboard;
