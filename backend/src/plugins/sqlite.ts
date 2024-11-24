import fp from 'fastify-plugin';
import sqlite3 from 'better-sqlite3';
import { FastifyPluginAsync } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    sqlite: sqlite3.Database;
  }
}


const sqlitePlugin: FastifyPluginAsync = async (fastify, options) => {
  const { DATABASE_FILE_NAME } = process.env;

  const db = sqlite3(DATABASE_FILE_NAME || "database.sqlite");

  fastify.decorate('sqlite', db);

  // Ensure the required tables exist
  const createMediaTableQuery = `
  CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_name TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    url TEXT NOT NULL,
    created_at TEXT NOT NULL,
    mimetype TEXT NOT NULL
  );
`;

const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`;

const createLikesTableQuery = `
  CREATE TABLE IF NOT EXISTS likes (
    user_id INTEGER NOT NULL,
    media_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, media_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
  );
`;

  try {
    db.exec(createMediaTableQuery);
    db.exec(createUsersTableQuery);
    db.exec(createLikesTableQuery);
  } catch (error) {
    throw new Error('Failed to initialize database schema');
  }

  // Clean up database connection on server close
  fastify.addHook('onClose', async (instance) => {
    db.close();
  });
};

export default fp(sqlitePlugin, {
  name: 'sqlite-plugin',
});
