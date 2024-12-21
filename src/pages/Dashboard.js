function Dashboard() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      <p style={styles.subtitle}>Track your family's star rankings here.</p>

      <div style={styles.card}>
        <h2>Mira</h2>
        <p>⭐ ⭐ ⭐ ⭐ ⭐</p>
      </div>

      <div style={styles.card}>
        <h2>Shay</h2>
        <p>⭐ ⭐ ⭐ ⭐</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '50px',
    backgroundColor: '#1E1E1E',
    color: '#fff',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  card: {
    padding: '20px',
    backgroundColor: '#333',
    borderRadius: '12px',
    margin: '20px 0',
  },
};

export default Dashboard;
