import { champions } from './data/champions.ts';

import sqlite3 from 'npm:sqlite3';

const db = new sqlite3.Database('index.db');
let dbInitialized = false;

export async function initDB() {
  if (dbInitialized) return;
  dbInitialized = true;

  await createChampionsTable();
  await seedChampions();
}

function createChampionsTable() {
  return new Promise<void>((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS champions (
        id TEXT PRIMARY KEY UNIQUE, 
        name TEXT UNIQUE, 
        votes INTEGER DEFAULT 0
      )
    `,
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}

function seedChampions() {
  const query = `
    INSERT INTO champions (id, name, votes)
    VALUES (?, ?, 0)
    ON CONFLICT (id) DO NOTHING
  `;

  return new Promise<void>((resolve, reject) => {
    const stmt = db.prepare(query);

    champions.forEach((champion) => {
      stmt.run([champion.id, champion.name], (err) => {
        if (err) reject(err);
      });
    });

    stmt.finalize((err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

export function getChampions() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM champions ORDER BY votes DESC`, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

export function upvoteChampion(championId: string) {
  return new Promise<void>((resolve, reject) => {
    db.run(
      `UPDATE champions SET votes = votes + 1 WHERE id = ?`,
      [championId],
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}
