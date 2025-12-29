require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- ROUTES ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/teams', require('./routes/teams')); // <--- ADD THIS LINE HERE

app.get('/', (req, res) => {
  res.send('PokéWiki Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});