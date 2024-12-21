import { useState } from 'react';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';

const db = getFirestore();

function StarRating({ childName, uid }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = async (value) => {
    setRating(value);

    const childRef = doc(db, 'ratings', uid);
    await updateDoc(childRef, {
      ratings: arrayUnion({
        stars: value,
        date: new Date().toISOString(),
        childName
      })
    });
    alert(`${value} stars awarded to ${childName}!`);
  };

  const getFillPercentage = (index) => {
    const fill = hover || rating;
    return Math.min(Math.max((fill - index) * 100, 0), 100);
  };

  return (
    <div style={styles.ratingContainer}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;

        return (
          <div
            key={index}
            onClick={() => handleClick(starValue)}
            onMouseMove={(e) => {
              const percent = (e.nativeEvent.offsetX / e.target.offsetWidth) * 100;
              setHover(index + percent / 100);
            }}
            onMouseLeave={() => setHover(0)}
            style={{
              ...styles.star,
              background: `linear-gradient(90deg, #FFD700 ${getFillPercentage(index)}%, #ccc ${getFillPercentage(index)}%)`,
            }}
          >
            ★
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  ratingContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    fontSize: '3rem',
    cursor: 'pointer',
  },
  star: {
    display: 'inline-block',
    width: '50px',
    height: '50px',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitBackgroundClip: 'text',
  }
};

export default StarRating;
