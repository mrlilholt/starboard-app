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
    alert(`${value} unicorns awarded to ${childName}!`);
  };

  const getFillPercentage = (index) => {
    const fill = hover || rating;
    return Math.min(Math.max((fill - index) * 100, 0), 100);
  };

  return (
    <div style={styles.ratingContainer}>
      {[...Array(5)].map((_, index) => {
        const unicornValue = index + 1;

        return (
          <div
            key={index}
            onClick={() => handleClick(unicornValue)}
            onMouseMove={(e) => {
              const percent = (e.nativeEvent.offsetX / e.target.offsetWidth) * 100;
              setHover(index + percent / 100);
            }}
            onMouseLeave={() => setHover(0)}
            style={{
              ...styles.unicorn,
              background: `linear-gradient(90deg, #FF69B4 ${getFillPercentage(index)}%, #ccc ${getFillPercentage(index)}%)`,
            }}
          >
            🦄
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
  unicorn: {
    display: 'inline-block',
    width: '50px',
    height: '50px',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitBackgroundClip: 'text',
  }
};

export default StarRating;
