require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = new Database("exercise_logs.db");

db.prepare(
  `CREATE TABLE IF NOT EXISTS exercise_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_name TEXT NOT NULL,
    weight_kg REAL NOT NULL,
    reps INTEGER NOT NULL,
    logged_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`
).run();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/logs", (req, res) => {
  const { exercise_name, weight_kg, reps, logged_at } = req.body;

  if (!exercise_name || weight_kg === undefined || reps === undefined) {
    return res.status(400).json({
      error: "exercise_name, weight_kg, and reps are required",
    });
  }

  const insert = db.prepare(
    `INSERT INTO exercise_logs (exercise_name, weight_kg, reps, logged_at)
     VALUES (?, ?, ?, COALESCE(?, datetime('now')))`
  );

  const result = insert.run(exercise_name.trim(), Number(weight_kg), Number(reps), logged_at);
  const created = db.prepare("SELECT * FROM exercise_logs WHERE id = ?").get(result.lastInsertRowid);

  return res.status(201).json(created);
});

app.get("/logs", (req, res) => {
  const logs = db.prepare("SELECT * FROM exercise_logs ORDER BY id DESC").all();
  return res.json(logs);
});

app.put("/logs/:id", (req, res) => {
  const id = Number(req.params.id);
  const { exercise_name, weight_kg, reps, logged_at } = req.body;

  if (!exercise_name || weight_kg === undefined || reps === undefined) {
    return res.status(400).json({
      error: "exercise_name, weight_kg, and reps are required",
    });
  }

  const existing = db.prepare("SELECT * FROM exercise_logs WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "Log not found" });
  }

  db.prepare(
    `UPDATE exercise_logs
     SET exercise_name = ?, weight_kg = ?, reps = ?, logged_at = COALESCE(?, logged_at)
     WHERE id = ?`
  ).run(exercise_name.trim(), Number(weight_kg), Number(reps), logged_at, id);

  const updated = db.prepare("SELECT * FROM exercise_logs WHERE id = ?").get(id);
  return res.json(updated);
});

app.delete("/logs/:id", (req, res) => {
  const id = Number(req.params.id);
  const result = db.prepare("DELETE FROM exercise_logs WHERE id = ?").run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Log not found" });
  }

  return res.json({ message: "Log deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
