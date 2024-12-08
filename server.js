const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Configuraties
const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connectie
mongoose.connect('mongodb://localhost:27017/orders-db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose modellen
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  customerName: String,
  productName: String,
  status: String,
}));

// API-routes
// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Orders ophalen
app.get('/api/orders', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');

  try {
    jwt.verify(token, SECRET_KEY);
    Order.find().then(orders => res.json(orders));
  } catch {
    res.status(403).send('Invalid token');
  }
});

// Serve static files from the dist folder for production
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(path.join(__dirname, 'dist')));

  // Handle SPA routing for Vue.js
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
