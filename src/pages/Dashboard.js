import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

const kids = [
  { id: 1, name: 'Mira', image: '/mira.png' },
  { id: 2, name: 'Shea', image: '/shea.png' }
];

const initialCategories = ['Cleaning', 'Kindness', 'Listening', 'Helping', 'Sharing'];

function Dashboard() {
  const [selectedKid, setSelectedKid] = useState(null);
  const [ratings, setRatings] = useState({});
  const [recommend, setRecommend] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState(initialCategories);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelectKid = (kid) => {
    setSelectedKid(kid);
    setRatings({});
    setRecommend(false);
    setActiveCategory(null);
  };

  const handleRating = (rating) => {
    if (activeCategory) {
      setRatings((prev) => ({ ...prev, [activeCategory]: rating }));
      if (rating > 0) setRecommend(false);
    }
  };

  const handleSave = () => {
    console.log(`Saving ratings for ${selectedKid.name}:`, ratings);
    if (recommend) console.log(`${selectedKid.name} marked as Would Not Recommend`);
    setSelectedKid(null);
    setActiveCategory(null);
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
          <button onClick={() => setMenuOpen(!menuOpen)} style={styles.menuButton}>☰</button>
        </div>
      </header>

      {menuOpen && (
        <div style={styles.dropdownMenu}>
          <p onClick={() => navigate('/dashboard')}>Dashboard</p>
          <p onClick={() => navigate('/stats')}>Stats</p>
          <p onClick={() => navigate('/about')}>About</p>
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

          {activeCategory && (
            <div style={styles.starsContainer}>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  style={styles.star}
                  onClick={() => handleRating(i + 1)}>
                  {i < ratings[activeCategory] ? '⭐' : '☆'}
                </span>
              ))}
            </div>
          )}
          
          {activeCategory && (
            <button onClick={handleSave} style={styles.saveButton}>Save</button>
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
  menuButton: {
    marginLeft: '10px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '60px',
    right: '30px',
    backgroundColor: '#333',
    color: 'white',
    borderRadius: '6px',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left'
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto'
  },
  card: {
    cursor: 'pointer',
    border: '1px solid #ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  kidImage: {
    width: '100%',
    height: '300px',  // Uniform height for all images
    objectFit: 'cover',  // Ensures the image scales correctly and crops if necessary
    borderBottom: '1px solid #ddd'  // Separates image from name
  }
};

export default Dashboard;
