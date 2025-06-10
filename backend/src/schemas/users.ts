// User-related schemas
export const registerSchema = {
  tags: ["users"],
  summary: "User registration endpoint",
  errorMessage: {
    body: {
      properties: {
        password: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
      }
    }
  },
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string', minLength: 3, maxLength: 50 },
      password: {
        type: 'string',
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>-])[A-Za-z\\d!@#$%^&*(),.?":{}|<>-]{8,}$'
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
    },
    500: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
};

export const loginSchema = {
  tags: ["users"],
  summary: 'User login endpoint',
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
    },
    500: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
};
