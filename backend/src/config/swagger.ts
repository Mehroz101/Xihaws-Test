// config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Link Website API',
      version: '1.0.0',
      description: 'A comprehensive API for managing website links with AI-generated descriptions and image uploads',
      contact: {
        name: 'XIHawks Developer',
        email: 'developer@xihawks.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: 'Development server'
      },
      {
        url: 'https://api.smartlink.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique user identifier'
            },
            username: {
              type: 'string',
              description: 'Unique username',
              example: 'john_doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
              minLength: 6
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'User role',
              default: 'user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp'
            }
          }
        },
        Site: {
          type: 'object',
          required: ['site_url', 'title', 'category'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique site identifier'
            },
            site_url: {
              type: 'string',
              format: 'uri',
              description: 'Website URL',
              example: 'https://google.com'
            },
            title: {
              type: 'string',
              description: 'Website title',
              example: 'Google Search'
            },
            cover_image: {
              type: 'string',
              format: 'uri',
              description: 'Cover image URL (optional)',
              example: 'https://res.cloudinary.com/example/image/upload/v1234567890/sample.jpg'
            },
            description: {
              type: 'string',
              description: 'AI-generated description',
              example: 'Google is a powerful search engine that helps you find information on the web quickly and efficiently.'
            },
            category: {
              type: 'string',
              description: 'Website category',
              enum: ['Technology', 'Design', 'News', 'Education', 'Entertainment', 'Business', 'Health', 'Travel'],
              example: 'Technology'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Site creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Site last update timestamp'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123'
            }
          }
        },
        SignupRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'john_doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'password123'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT authentication token'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        AIDescriptionRequest: {
          type: 'object',
          required: ['title', 'category', 'link'],
          properties: {
            title: {
              type: 'string',
              description: 'Website title',
              example: 'Google'
            },
            category: {
              type: 'string',
              description: 'Website category',
              example: 'Technology'
            },
            link: {
              type: 'string',
              description: 'Website URL',
              example: 'https://google.com'
            }
          }
        },
        AIDescriptionResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            description: {
              type: 'string',
              description: 'AI-generated description',
              example: 'Google is a powerful search engine that helps you find information on the web quickly and efficiently.'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Detailed error information'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Sites',
        description: 'Website link management endpoints'
      },
      {
        name: 'AI',
        description: 'AI-powered description generation'
      }
    ]
  },
  // Try different paths - choose one that works
  apis: [
    './src/routes/*.ts',           // If your routes are in src/routes
    './routes/*.ts',               // If your routes are in routes (no src)
    './dist/routes/*.js',          // For production build
    './src/routes/*.js',           // If using JS files
    path.join(__dirname, '../routes/*.ts'), // Absolute path
  ],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Smart Link API Documentation'
  }));

  // Swagger JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📚 Swagger documentation available at /api-docs');
};