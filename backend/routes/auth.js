// auth.js
const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// register
router.post('/register', async (req, res) => {
  try {
    const { username, password, display_name } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username+password required' });
    const hash = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password_hash, display_name) VALUES (?, ?, ?)');
    const info = stmt.run(username, hash, display_name || null);
    const user = db.prepare('SELECT id, username, display_name FROM users WHERE id = ?').get(info.lastInsertRowid);
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') return res.status(400).json({ error: 'username taken' });
    console.error(err); res.status(500).json({ error: 'server error' });
  }
});

// login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, username: user.username, display_name: user.display_name }, token });
});

module.exports = router;
