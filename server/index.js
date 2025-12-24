
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new Database(dbPath);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT DEFAULT 'User',
    currency TEXT DEFAULT '$',
    monthlyBudget REAL DEFAULT 3000
  );

  INSERT OR IGNORE INTO profile (id, name, currency, monthlyBudget) VALUES (1, 'User', '$', 3000);
`);

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/api/expenses', (req, res) => {
  const rows = db.prepare('SELECT * FROM expenses ORDER BY date DESC').all();
  res.json(rows);
});

app.post('/api/expenses', (req, res) => {
  const { amount, category, description, date, type } = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  
  const insert = db.prepare('INSERT INTO expenses (id, amount, category, description, date, type) VALUES (?, ?, ?, ?, ?, ?)');
  insert.run(id, amount, category, description, date, type);
  
  const newExpense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
  res.status(201).json(newExpense);
});

app.put('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { amount, category, description, date, type } = req.body;
  
  const update = db.prepare('UPDATE expenses SET amount = ?, category = ?, description = ?, date = ?, type = ? WHERE id = ?');
  const info = update.run(amount, category, description, date, type, id);
  
  if (info.changes > 0) {
    const updated = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
  res.status(204).send();
});

app.get('/api/profile', (req, res) => {
  const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  res.json(profile);
});

app.listen(PORT, () => {
  console.log(`RSD Spend Backend with SQLite running at http://localhost:${PORT}`);
  console.log(`Database located at: ${dbPath}`);
});
