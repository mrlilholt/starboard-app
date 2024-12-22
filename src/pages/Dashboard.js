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
  const [categories, setCategories] = useState(initialCategories);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
          <button onClick={() => setMenuOpen(!menuOpen)} style={styles.menuButton}>☰</button>
        </div>
      </header>

      {menuOpen && (
        <div style={styles.dropdownMenu}>
          <div onClick={() => navigate('/dashboard')} style={styles.menuItem}>Dashboard</div>
          <div onClick={() => navigate('/stats')} style={styles.menuItem}>Stats</div>
          <div onClick={() => navigate('/about')} style={styles.menuItem}>About</div>
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
              <div key={cat} style={styles.categoryContainer}>
                <span>{cat}</span>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    style={styles.star}
                    onClick={() => handleRating(cat, i + 1)}>
                    {i < (ratings[cat] || 0) ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
            ))}
            <button onClick={handleAddCategory} style={styles.addButton}>+ Add Category</button>
          </div>
          <button onClick={handleSave} style={styles.saveButton}>Save</button>
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
    top: '70px',
    right: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '10px'
  },
  menuItem: {
    padding: '10px 20px',
    cursor: 'pointer',
    color: 'white',
    textAlign: 'center'
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
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '10px'
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
