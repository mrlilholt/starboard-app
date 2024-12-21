import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);  // Prevents flashing during auth check

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/');
      } else {
        setLoading(false);  // Stop loading once user is confirmed
      }
    });

    return () => unsubscribe();  // Clean up listener on unmount
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;  // Optional: Show loading until redirect completes
  }

  return (
    <div className="app-container">
      <h1>Dashboard</h1>
      {/* Star rating components here */}
    </div>
  );
}

export default Dashboard;
