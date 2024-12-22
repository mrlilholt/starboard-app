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
  const [activeCategory, setActiveCategory] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const navigate = useNavigate();

  const handleSelectKid = (kid) => {
    setSelectedKid(kid);
    setRatings({});
    setRecommend(false);
  };

  const handleRating = (category, rating) => {
    setRatings((prev) => ({ ...prev, [category]: rating }));
    setShowCategories(false);
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
          <div style={{ position: 'relative', display: 'inline-block' }}>
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
                    onClick={() => {
                      setActiveCategory(cat);
                      setShowCategories(false);  // Close after selecting
                    }}>
                    {cat}
                  </div>
                ))}
                <div 
                  style={styles.addCategory} 
                  onClick={handleAddCategory}>
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
  toyBoxIcon: {
    width: '50px',
    height: '50px',
    cursor: 'pointer'
  },
  categoryDropdown: {
    position: 'absolute',  // Ensure dropdown stays under toybox
    top: '60px',           // Adjust based on toybox icon size
    left: '0',
    backgroundColor: '#333',
    color: 'white',
    borderRadius: '8px',
    padding: '10px',
    zIndex: '100',        // Ensure it appears above other content
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },
  categoryItem: {
    padding: '10px',
    cursor: 'pointer'
  },
  largeStar: {
    fontSize: '3rem',
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
