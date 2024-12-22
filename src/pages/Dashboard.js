import { useState } from 'react';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth } from '../firebase/firebase';

const db = getFirestore();

function Dashboard() {
  const [rating, setRating] = useState(0);

  const handleRating = async (value) => {
    setRating(value);
    const user = auth.currentUser;
    const userRef = doc(db, 'ratings', user.uid);

    await updateDoc(userRef, {
      ratings: arrayUnion({
        stars: value,
        date: new Date().toISOString()
      })
    });
    alert(`You gave ${value} stars!`);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {[...Array(5)].map((_, i) => (
        <span key={i} onClick={() => handleRating(i + 1)}>⭐</span>
      ))}
    </div>
  );
}

export default Dashboard;
