import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcrypt';


const registerSchema = {
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: {
        type: 'string',
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$' // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    400: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
};

const loginSchema = {
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' }
      }
    },
    401: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
};

interface User {
  id: number;
  username: string;
  password: string;
}

const users: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/register', { schema: registerSchema }, async (request, reply) => {
    const { username, password } = request.body as { username: string, password: string };
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const stmt = fastify.sqlite.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
      stmt.run(username, hashedPassword);
      reply.send({ message: 'User registered successfully' });
    } catch (err) {
      // TODO: Fix the error type here
      if ((err as any).code === 'SQLITE_CONSTRAINT_UNIQUE') {
        reply.badRequest('User already exists');
      } else {
        reply.internalServerError('Error registering user');
      }
    }
  });

  fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
    const { username, password } = request.body as { username: string, password: string };
    const stmt = fastify.sqlite.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username) as User

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.unauthorized('Invalid username or password');
    }

    const token = fastify.jwt.sign({ id: user.id, username });
    reply.send({ token });
  });
};

export default users;
