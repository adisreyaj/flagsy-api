export const ENV_SCHEMA = {
  type: 'object',
  required: ['PORT', 'JWT_SECRET', 'COOKIE_SECRET'],
  properties: {
    PORT: {
      type: 'number',
    },
    JWT_SECRET: {
      type: 'string',
    },
    COOKIE_SECRET: {
      type: 'string',
    },
    NODE_ENV: {
      type: 'string',
    },
  },
};
