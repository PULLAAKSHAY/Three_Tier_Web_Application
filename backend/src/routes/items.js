const express = require("express");
const router = express.Router();
const db = require("../db");
const { httpRequestDurationMs } = require("../metrics");

function withMetrics(route) {
  return async (req, res, next) => {
    const end = httpRequestDurationMs.startTimer();
    try {
      await route(req, res, next);
      end({
        method: req.method,
        route: req.route?.path || req.path,
        code: res.statusCode,
      });
    } catch (err) {
      end({
        method: req.method,
        route: req.route?.path || req.path,
        code: 500,
      });
      next(err);
    }
  };
}

// Create
router.post(
  "/",
  withMetrics((req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });
    const stmt = db.prepare(
      "INSERT INTO items (name, description) VALUES (?, ?)"
    );
    const info = stmt.run(name, description || null);
    const item = db
      .prepare("SELECT * FROM items WHERE id = ?")
      .get(info.lastInsertRowid);
    res.status(201).json(item);
  })
);

// Read all
router.get(
  "/",
  withMetrics((req, res) => {
    const rows = db.prepare("SELECT * FROM items").all();
    res.json(rows);
  })
);

// Read one
router.get(
  "/:id",
  withMetrics((req, res) => {
    const row = db
      .prepare("SELECT * FROM items WHERE id = ?")
      .get(req.params.id);
    if (!row) return res.status(404).json({ error: "not found" });
    res.json(row);
  })
);

// Update
router.put(
  "/:id",
  withMetrics((req, res) => {
    const { name, description } = req.body;
    const stmt = db.prepare(
      "UPDATE items SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?"
    );
    const info = stmt.run(name, description, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: "not found" });
    const item = db
      .prepare("SELECT * FROM items WHERE id = ?")
      .get(req.params.id);
    res.json(item);
  })
);

// Delete
router.delete(
  "/:id",
  withMetrics((req, res) => {
    const stmt = db.prepare("DELETE FROM items WHERE id = ?");
    const info = stmt.run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: "not found" });
    res.status(204).end();
  })
);

module.exports = router;
