// db.js - initialize sqlite and migrations
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_FILE = path.join(__dirname, 'data.db');
const db = new Database(DB_FILE);

// run migrations if first run
const migrations = fs.readFileSync(path.join(__dirname, 'migrations.sql'), 'utf8');
db.exec(migrations);

module.exports = db;
