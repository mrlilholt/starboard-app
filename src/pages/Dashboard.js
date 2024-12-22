import React, { useState, useCallback, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { doc, setDoc, updateDoc, getDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { Link } from 'react-router-dom';  // Import for navigation

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
  const [kidData, setKidData] = useState(null);  // Real-time data from Firestore

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const fetchStats = useCallback(async () => {
    console.log("Fetching stats...");
    // Placeholder for fetching logic
  }, []);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);  

  // Real-time listener for Firestore updates
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
  };

  const handleRating = (category, rating) => {
    setRatings((prev) => ({ ...prev, [category]: rating }));
    setShowCategories(false);
  };

  const handleSave = async () => {
    if (!selectedKid) return;

    const docRef = doc(db, 'stars', selectedKid.name);
    const docSnap = await getDoc(docRef);

    // Initialize if not exists
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        history: [],
        ...Object.fromEntries(categories.map((cat) => [cat, 0]))
      });
    }

    // Update Firestore ratings
    const updates = {};
    Object.entries(ratings).forEach(([category, stars]) => {
      updates[category] = (docSnap.data()?.[category] || 0) + stars;
    });

    // Track daily stars
    const todayStars = Object.values(ratings).reduce((a, b) => a + b, 0);
    updates['history'] = arrayUnion(todayStars);

    try {
      await updateDoc(docRef, updates);
      console.log(`Saved ratings for ${selectedKid.name}`);
    } catch (error) {
      console.error("Error saving data:", error);
    }

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
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  logo: {
    width: '120px',
    height: 'auto'
  },
  menuIcon: {
    fontSize: '2rem',
    cursor: 'pointer',
    marginRight: '20px'
  },
  menuDropdown: {
    position: 'absolute',
    top: '50px',
    right: '0',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    zIndex: 100
  },
  menuItem: {
    padding: '12px 20px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#333',
    display: 'block'
  },
  userIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginLeft: '10px'
  }
};

export default Dashboard;
