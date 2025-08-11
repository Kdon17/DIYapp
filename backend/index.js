// index.js - Express server with auth and guides
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const authRoutes = require('./routes/auth');
const guidesRoutes = require('./routes/guides');
const uploadsRoutes = require('./routes/uploads');

const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded media
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/guides', guidesRoutes);
app.use('/api/uploads', uploadsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
