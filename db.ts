import { champions } from './data/champions.ts';

// import sqlite3 from 'npm:sqlite3';
// const db = new sqlite3.Database('index.db');
import { Database } from '@db/sqlite';
const db = new Database('index.db');

let dbInitialized = false;

export function initDB() {
  if (dbInitialized) return;
  dbInitialized = true;

  createChampionsTable();
  seedChampions();
}

function createChampionsTable() {
  db.run(
    `
      CREATE TABLE IF NOT EXISTS champions (
        id TEXT PRIMARY KEY UNIQUE, 
        name TEXT UNIQUE, 
        votes INTEGER DEFAULT 0
      )
    `
  );
}

function seedChampions() {
  const query = `
    INSERT INTO champions (id, name, votes)
    VALUES (?, ?, 0)
    ON CONFLICT (id) DO NOTHING
  `;

  const stmt = db.prepare(query);

  champions.forEach((champion) => {
    stmt.run(champion.id, champion.name);
  });
}

export function getChampions() {
  return db.prepare(`SELECT * FROM champions ORDER BY votes DESC`).all();
}

export function upvoteChampion(championId: string) {
  db.run(`UPDATE champions SET votes = votes + 1 WHERE id = ?`, championId);
}
