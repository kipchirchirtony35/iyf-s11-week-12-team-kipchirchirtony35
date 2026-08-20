require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const db = require('./db'); // ensures DB initialized
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const loansRoutes = require('./routes/loans');
const usersRoutes = require('./routes/users');
const reportsRoutes = require('./routes/reports');

const app = express();
app.use(express.json());

const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: CORS_ORIGIN }));

// API
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reports', reportsRoutes);

// Serve frontend static files
app.use('/', express.static(path.join(__dirname, '../frontend')));

// fallback for SPA pages (optional)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));