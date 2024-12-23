import React from 'react';
import { useNavigate } from 'react-router-dom';

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.modalOverlay}>
  <div style={styles.modal}></div>
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>About Starboard</h1>
      </header>

      <div style={styles.content}>
        <p>
          Starboard is a fun and engaging app designed to help parents track and rate
          their children's behaviors in a lighthearted way. Inspired by the simplicity of
          rating systems like Uber, Starboard lets you assign stars to various aspects of
          your kids' day-to-day activities. Collect stars, track progress, and enjoy the
          journey together!
        </p>
        <p>
          This app was created with love to make parenting just a little more entertaining.
          Remember, it's all in good fun!
        </p>
      </div>

      <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
        Back to Dashboard
      </button>
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
  modalOverlay: {
    position: 'fixed',   
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Dim the background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflowY: 'auto',  
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',  
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    overflowY: 'auto',  
  },
  
  header: {
    marginBottom: '30px'
  },
  content: {
    maxWidth: '600px',
    lineHeight: '1.6',
    marginBottom: '20px'
  },
  backButton: {
    marginTop: '30px',
    padding: '12px 24px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};

export default AboutPage;
