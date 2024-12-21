import { useState } from 'react';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';

const db = getFirestore();

function StarRating({ childName, uid }) {
  const [rating, setRating] = useState(0);

  const handleRating = async (stars) => {
    setRating(stars);
    const childRef = doc(db, 'ratings', uid);

    await updateDoc(childRef, {
      ratings: arrayUnion({
        stars,
        date: new Date().toISOString(),
        childName
      })
    });

    alert(`${stars} stars awarded to ${childName}!`);
  };

  return (
    <div>
      <h3>{childName}</h3>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          onClick={() => handleRating(index + 1)}
          style={{
            cursor: 'pointer',
            fontSize: '2rem',
            color: index < rating ? 'gold' : 'gray'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
