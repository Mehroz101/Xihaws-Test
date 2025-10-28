import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

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
        url: 'http://localhost:3001',
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
          required: ['siteUrl', 'title', 'category'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique site identifier'
            },
            siteUrl: {
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
            coverImage: {
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
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Site creation timestamp'
            },
            updatedAt: {
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
          required: ['title', 'category'],
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
        ImageUploadResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Image uploaded successfully'
            },
            image: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  format: 'uri',
                  description: 'Cloudinary image URL'
                },
                public_id: {
                  type: 'string',
                  description: 'Cloudinary public ID'
                },
                width: {
                  type: 'integer',
                  description: 'Image width'
                },
                height: {
                  type: 'integer',
                  description: 'Image height'
                },
                format: {
                  type: 'string',
                  description: 'Image format'
                }
              }
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
      },
      {
        name: 'Images',
        description: 'Image upload and management'
      }
    ]
  },
  apis: ['./src/routes/*.ts'], // Path to the API files
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
};
