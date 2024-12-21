import { auth } from '../firebase/firebase';

function NavBar() {
  const user = auth.currentUser;

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>🌟 Starboard</div>
      {user && (
        <img
          src={user.photoURL || 'https://via.placeholder.com/50'}
          alt="User"
          style={styles.userIcon}
        />
      )}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '20px',
    width: '100%',
    zIndex: '1000',
  },
  userIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginTop: '10px',
    border: '3px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  }
};

export default NavBar;
