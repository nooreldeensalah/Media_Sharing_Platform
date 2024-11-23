import fp from 'fastify-plugin';
import sqlite3 from 'better-sqlite3';
import { FastifyPluginAsync } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    sqlite: sqlite3.Database;
  }
}

interface SQLitePluginOptions {
  databasePath: string;
}

const sqlitePlugin: FastifyPluginAsync<SQLitePluginOptions> = async (fastify, options) => {
  const { databasePath } = options;

  const db = sqlite3(databasePath || 'database.sqlite');

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

  try {
    db.exec(createMediaTableQuery);
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
