-- users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- guides
CREATE TABLE IF NOT EXISTS guides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  author_id INTEGER,
  difficulty TEXT,
  est_time_minutes INTEGER,
  tags TEXT,         -- comma separated tags (simple)
  content TEXT,      -- markdown for guide steps and lists
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(author_id) REFERENCES users(id)
);

-- media (images/videos)
CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guide_id INTEGER,
  step_index INTEGER,
  filename TEXT,
  mime TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(guide_id) REFERENCES guides(id)
);

-- comments/ratings
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guide_id INTEGER,
  user_id INTEGER,
  body TEXT,
  rating INTEGER, -- 1..5
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(guide_id) REFERENCES guides(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Basic full-text-ish search index could be added later
