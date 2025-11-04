const Database = require("better-sqlite3");
const path = require("path");
const dbPath =
  process.env.SQLITE_FILE || path.join(__dirname, "..", "data", "app.db");
const db = new Database(dbPath);

// initialize
db.exec(`
CREATE TABLE IF NOT EXISTS items (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
description TEXT
);
`);

module.exports = db;
