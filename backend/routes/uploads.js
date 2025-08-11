// uploads.js - single endpoint to handle media upload
const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e6);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } }); // 200MB limit

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'missing auth' });
  const token = header.split(' ')[1];
  try { req.user = jwt.verify(token, JWT_SECRET); next(); } catch (e) { res.status(401).json({ error: 'invalid token' }); }
}

// upload media and attach to guide
router.post('/', auth, upload.single('file'), (req, res) => {
  const { guide_id, step_index } = req.body;
  if (!req.file) return res.status(400).json({ error: 'no file' });
  const insert = db.prepare('INSERT INTO media (guide_id, step_index, filename, mime) VALUES (?, ?, ?, ?)');
  insert.run(guide_id || null, step_index || 0, req.file.filename, req.file.mimetype);
  res.json({ ok: true, filename: req.file.filename, url: `/uploads/${req.file.filename}` });
});

module.exports = router;
