// guides.js
const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// helper: auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'missing auth' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'invalid token' });
  }
}

// list with optional search, tag, difficulty
router.get('/', (req, res) => {
  const q = req.query.q || '';
  const tag = req.query.tag || '';
  const difficulty = req.query.difficulty || '';
  let sql = 'SELECT id, title, slug, difficulty, tags, est_time_minutes, created_at FROM guides WHERE 1=1';
  const params = [];
  if (q) { sql += ' AND (title LIKE ? OR content LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
  if (tag) { sql += ' AND tags LIKE ?'; params.push(`%${tag}%`); }
  if (difficulty) { sql += ' AND difficulty = ?'; params.push(difficulty); }
  sql += ' ORDER BY created_at DESC LIMIT 100';
  const rows = db.prepare(sql).all(...params);
  res.json(rows);
});

// get single guide with media and comments
router.get('/:slug', (req, res) => {
  const gid = db.prepare('SELECT * FROM guides WHERE slug = ?').get(req.params.slug);
  if (!gid) return res.status(404).json({ error: 'not found' });
  const media = db.prepare('SELECT * FROM media WHERE guide_id = ? ORDER BY step_index').all(gid.id);
  const comments = db.prepare('SELECT c.*, u.username, u.display_name FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.guide_id = ? ORDER BY created_at').all(gid.id);
  res.json({ guide: gid, media, comments });
});

// create guide
router.post('/', auth, (req, res) => {
  const { title, slug, difficulty, est_time_minutes, tags = '', content } = req.body;
  if (!title || !slug || !content) return res.status(400).json({ error: 'title, slug, content required' });
  try {
    const stmt = db.prepare(`INSERT INTO guides (title, slug, author_id, difficulty, est_time_minutes, tags, content)
                             VALUES (?, ?, ?, ?, ?, ?, ?)`);
    const info = stmt.run(title, slug, req.user.id, difficulty, est_time_minutes, tags, content);
    const guide = db.prepare('SELECT id, title, slug FROM guides WHERE id = ?').get(info.lastInsertRowid);
    res.json(guide);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') return res.status(400).json({ error: 'slug exists' });
    console.error(err); res.status(500).json({ error: 'server error' });
  }
});

// comment + rating
router.post('/:slug/comments', auth, (req, res) => {
  const guide = db.prepare('SELECT id FROM guides WHERE slug = ?').get(req.params.slug);
  if (!guide) return res.status(404).json({ error: 'guide not found' });
  const { body, rating } = req.body;
  db.prepare('INSERT INTO comments (guide_id, user_id, body, rating) VALUES (?, ?, ?, ?)').run(guide.id, req.user.id, body, rating || null);
  res.json({ ok: true });
});

module.exports = router;
