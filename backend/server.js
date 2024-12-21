const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Save Star Rating
app.post('/rate', async (req, res) => {
  const { child, category, stars } = req.body;
  try {
    const docRef = db.collection('ratings').doc();
    await docRef.set({
      child,
      category,
      stars,
      timestamp: new Date(),
    });
    res.status(200).send('Rating saved!');
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).send('Failed to save rating');
  }
});

// Fetch Star Ratings
app.get('/stats', async (req, res) => {
  try {
    const snapshot = await db.collection('ratings').get();
    const ratings = snapshot.docs.map(doc => doc.data());
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).send('Failed to fetch stats');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
