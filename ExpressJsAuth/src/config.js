import * as nodemailer from "nodemailer";
import { createLogger, format, transports } from 'winston';
import swaggerJSDoc from 'swagger-jsdoc';

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  service: process.env.EMAIL_SERVICE,
  auth: {
      user: process.env.user,
      pass: process.env.pass,
  }
})

export const logger = createLogger({
  levels: logLevels,
  transports: [new transports.Console()],
});

export const secretKey = process.env.JWT_SECRET;
export const appSecret = process.env.MY_SECRET;
export const appSession = process.env.APP_SESSION;
export const isDev = process.env.isDEV;

export const port = process.env.NODE_LOCAL_PORT

 // Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.3',
    info: {
        title: 'Express Auth API',
        version: '1.0.0',
        description: 'A simple demo API using express.js framework',
    },
    servers: [
        { url: `http://localhost:${port}`}
    ],
    tags: [
      {name: 'API Entry Point', description: ''},
      {name: 'Auth', description: 'Api Authentication'}
    ],
    authAction: {
      JWT: {
        name: "JWT",
        schema: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: ""
        },
        value: "Bearer <JWT>"  // Placeholder value for the UI
      }
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          example: {
            name: 'Barry',
            email: 'example@email.com',
            password: '1234abcd'
          },
          properties: {
            name: {
              type: 'string',
              description: 'Name of the user'
            },
            email: {
              type: 'string',
              description: 'User login email'
            },
            password: {
              type: 'string',
              description: 'User Password'
            }
          }
        },
        UserWithId: {
          type: 'object',
          required: ['_id', 'name', 'email', 'password'],
          example: {
            name: 'Barry',
            email: 'example@email.com',
            password: '1234abcd',
            '_id': '1z2y3x'
          },
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'Name of the user'
            },
            email: {
              type: 'string',
              description: 'User login email'
            },
            password: {
              type: 'string',
              description: 'User Password'
            }
          }
        },
      },
      securitySchemes: {
        bearerAuth: {
            type: 'http',
            name: 'authorization',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT', 
            description: 'Enter the token with the `Bearer: ` prefix, e.g. "Bearer abcde12345"'
        },
        cookieAuth: {
            type: 'apiKey',
            name: 'refreshToken',
            in: 'cookie',
            scheme: 'bearer',
            description: 'Enter the refresh token'
        },
      },
    },
  },
  apis: ['src/index.mjs', 'src/routes/*.js'], // Path to your API docs
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
export const rateLimitConfig = {
  total: 20,
  duration_in_ms: 60000,
  delay_after: 5,
  window_ms: 15000,
  delay_in_ms: 2000,
}

export const demoAccounts = {
  'blhyk.es@gmail.com': true,
  'blhykes@gmail.com': true
}

export const allowedOrigins = process.env.allowedOrigins.split(" ")