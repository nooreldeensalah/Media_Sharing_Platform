import { FastifyInstance } from 'fastify';
import * as bcrypt from 'bcrypt';
import { User, ServiceError, LoginResponse, RegisterResponse } from '../types';

export class UserService {
  constructor(private fastify: FastifyInstance) {}

  async registerUser(username: string, password: string): Promise<RegisterResponse> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = this.fastify.sqlite.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
      stmt.run(username, hashedPassword);

      return { message: 'User registered successfully' };
    } catch (err) {
      if (err instanceof Error && 'code' in err && err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        const error = new Error('Username already exists') as ServiceError;
        error.statusCode = 400;
        throw error;
      }

      this.fastify.log.error('Registration error:', err);
      const error = new Error('Error registering user') as ServiceError;
      error.statusCode = 500;
      throw error;
    }
  }

  async loginUser(username: string, password: string): Promise<LoginResponse> {
    const stmt = this.fastify.sqlite.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username) as User | undefined;

    if (!user || !(await bcrypt.compare(password, user.password))) {
      const error = new Error('Invalid username or password') as ServiceError;
      error.statusCode = 401;
      throw error;
    }

    const token = this.fastify.jwt.sign({ id: user.id, username });
    return { token };
  }

  async getUserById(id: number): Promise<User | null> {
    const stmt = this.fastify.sqlite.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const stmt = this.fastify.sqlite.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User | null;
  }
}
