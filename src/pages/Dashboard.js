import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/firebase';

const db = getFirestore();

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userRef = doc(db, 'users', authUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.displayName}!</h1>
          <img src={user.photoURL} alt="Profile" style={{ borderRadius: '50%', width: '80px' }} />
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}

      <h1>Dashboard</h1>
      <p>Choose a child, category, and give them stars!</p>
      <form>
        <select>
          <option>Mira</option>
          <option>Shea</option>
        </select>
        <select>
          <option>Kindness</option>
          <option>Chores</option>
        </select>
        <div>
          <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
        </div>
        <button type="submit">Give Stars!</button>
      </form>
    </div>
  );
}

export default Dashboard;
